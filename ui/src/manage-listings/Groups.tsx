import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../api';
import { PostOptions } from '../components/PostOptions';
import { useGroups } from '../state/groups';
import { Declare, PostOption, PostOptionsForm } from '../types/sphinx';

export const Groups = () => {
  const groups = useGroups();
  const [firstLoad, setFirstLoad] = useState(true);
  const form = useForm<PostOptionsForm>({
    defaultValues: {
      options: []
    }
  });
  const { handleSubmit, reset, watch, setValue } = form;
  const options = watch('options');

  useEffect(() => {
    if (groups.length > 0 && firstLoad) {
      reset({
        options: []
      })

      setFirstLoad(false);
    }
  }, [groups, firstLoad]);

  const toggleAll = useCallback(() => {
    if (options.length !== groups.length) {
      setValue('options', groups.map(g => g.key));
    } else {
      setValue('options', []);
    }
  }, [groups, options, setValue]);

  const onSubmit = useCallback((values: PostOptionsForm) => {
    api.poke<Declare[]>({
      app: 'sphinx',
      mark: 'declarations',
      json: groups.filter(a => values.options.includes(a.key)).map(a => ({
        post: a.post,
        reach: 'friends'
      }))
    });

    reset();
  }, [reset]);

  return (
    <>
      <header className='flex items-center'>
        <h1 className='text-2xl font-semibold'>Add Groups</h1>
        <button className='p-2 ml-auto text-sm underline font-semibold' onClick={toggleAll}>
          {options.length !== groups.length && 'select all'}
          {options.length === groups.length && 'deselect all'}
        </button>
      </header>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <PostOptions options={groups} emptyMessage="No groups found" />
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