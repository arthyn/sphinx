import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../api';
import { PostOptions } from '../components/PostOptions';
import { Spinner } from '../components/Spinner';
import { useApps } from '../state/apps';
import { Declare, Listing, PostOption, PostOptionsForm } from '../types/sphinx';

function getAppKeys(apps: PostOption[]): string[] {
  return apps.map(({ key }) => key);
}

export const Apps = () => {
  const { apps, loading } = useApps();
  const form = useForm<PostOptionsForm>({
    defaultValues: {
      options: []
    }
  });
  const { handleSubmit, reset, watch, setValue } = form;
  const options = watch('options');

  const toggleAll = useCallback(() => {
    if (options.length !== apps.length) {
      setValue('options', getAppKeys(apps));
    } else {
      setValue('options', []);
    }
  }, [apps, options, setValue]);

  const queryClient = useQueryClient();
  const { mutate } = useMutation(async (values: PostOptionsForm) => {
    return api.poke<Declare[]>({
      app: 'sphinx',
      mark: 'declarations',
      json: apps.filter(a => values.options.includes(a.key)).map(a => ({
        post: a.post,
        reach: 'friends'
      }))
    });
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('app-listings');
    }
  })

  const onSubmit = useCallback((values: PostOptionsForm) => {
    mutate(values)
    reset() 
  }, [reset, mutate]);

  return (
    <>
      <header className='flex items-center'>
        <h1 className='text-2xl font-semibold'>Add Apps</h1>
        {apps.length > 0 && (
          <button className='p-2 ml-auto text-sm underline font-semibold' onClick={toggleAll}>
            {options.length !== apps.length && 'select all'}
            {options.length === apps.length && 'deselect all'}
          </button>
        )}
      </header>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {apps.length === 0 && loading ? (
            <div className='flex items-center space-x-2 text-lavender'>
              <Spinner className='w-6 h-6' />
              <span>Checking apps...</span>
            </div>
          ) : apps.length === 0 && !loading ? (
            <h2 className='text-lavender'>All apps already indexed</h2>
          ) : (
            <PostOptions options={apps} />
          )}
          <div className='flex justify-between border-t border-zinc-300 py-3 mt-6'>
            <Link to="/search" className='flex items-center rounded-lg text-base font-semibold text-rosy bg-rosy/30 border-2 border-transparent hover:border-rosy leading-none py-2 px-3 transition-colors'>
              Back to Search
            </Link>
            {apps.length > 0 && (
              <button type="submit" className='flex items-center rounded-lg text-base font-semibold text-linen bg-rosy disabled:bg-zinc-200 disabled:text-zinc-400 disabled:border-transparent border-2 border-transparent hover:border-linen/60 leading-none py-2 px-3 transition-colors' disabled={options.length === 0}>
                Publish
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
}