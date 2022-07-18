import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { PostOptions } from '../components/PostOptions';
import { useApps } from '../state/apps';
import { PostOption, PostOptionsForm } from '../types/sphinx';

function getAppKeys(apps: PostOption[]): string[] {
  return apps.map(({ key }) => key);
}

export const Apps = () => {
  const apps = useApps();
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

  const onSubmit = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <>
      <header className='flex items-center'>
        <h1 className='text-2xl font-semibold'>Add Apps</h1>
        <button className='p-2 ml-auto text-sm underline font-semibold' onClick={toggleAll}>
          {options.length !== apps.length && 'select all'}
          {options.length === apps.length && 'deselect all'}
        </button>
      </header>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PostOptions options={apps} emptyMessage="No apps found" />
          <div className='flex justify-between border-t border-zinc-300 py-3 mt-6'>
            <Link to="/search" className='flex items-center rounded-lg text-base font-semibold text-rosy bg-rosy/30 border-2 border-transparent hover:border-rosy leading-none py-2 px-3 transition-colors'>
              Back to Search
            </Link>
            <button type="submit" className='flex items-center rounded-lg text-base font-semibold text-linen bg-rosy disabled:bg-zinc-200 disabled:text-zinc-400 disabled:border-transparent border-2 border-transparent hover:border-linen/60 leading-none py-2 px-3 transition-colors' disabled={options.length === 0}>
              Publish
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}