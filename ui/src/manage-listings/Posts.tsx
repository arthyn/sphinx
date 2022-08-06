import { ChevronLeftIcon } from '@heroicons/react/solid';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { MultiValue } from 'react-select';
import api from '../api';
import { Filter } from '../components/Filter';
import { PostOptions } from '../components/PostOptions';
import { Spinner } from '../components/Spinner';
import { TagField, Option } from '../components/TagField';
import useMedia from '../logic/useMedia';
import {  usePosts } from '../state/posts';
import { Declare, PostOptionsForm, PostType } from '../types/sphinx';

interface PostsProps {
  ship: string;
  name: string;
}

export const Posts = ({ ship, name }: PostsProps) => {
  const limited = useMedia('(max-width: 899px)');
  const [postType, setPostType] = useState<PostType>('content')
  const [tags, setTags] = useState<MultiValue<Option>>([{ label: 'post', value: 'post' }])
  const { loading, posts, notebook } = usePosts(ship, name, postType, tags.map(t => t.value));
  const [firstLoad, setFirstLoad] = useState(true);
  const form = useForm<PostOptionsForm>({
    defaultValues: {
      options: []
    }
  });
  const { handleSubmit, reset, watch, setValue } = form;
  const options = watch('options');

  useEffect(() => {
    if (posts.length > 0 && firstLoad) {
      reset({
        options: []
      })

      setFirstLoad(false);
    }
  }, [posts, firstLoad]);

  const toggleAll = useCallback(() => {
    if (options.length !== posts.length) {
      setValue('options', posts.map(p => p.key));
    } else {
      setValue('options', []);
    }
  }, [posts, options, setValue]);

  const queryClient = useQueryClient();
  const { mutate } = useMutation(async (values: PostOptionsForm) => {
    return api.poke<Declare[]>({
      app: 'sphinx',
      mark: 'declarations',
      json: posts.filter(a => values.options.includes(a.key)).map(a => ({
        post: a.post,
        reach: 'friends'
      }))
    });
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('post-listings')
    }
  })
 
  const onSubmit = useCallback((values: PostOptionsForm) => {
    mutate(values);
    reset();
  }, [reset, mutate]);

  return (
    <>
      <header className='flex items-center'>
        {limited && (
          <Link to="/manage-listings/posts" className='flex items-center'>
            <ChevronLeftIcon className='h-6 w-6 text-mauve/60' />
            <h1 className='text-2xl font-semibold'>{notebook?.metadata?.title}</h1>
          </Link>
        )}
        {!limited && <h1 className='text-2xl font-semibold'>{notebook?.metadata?.title}</h1>}
        {posts.length > 0 && (
          <button className='p-1.5 ml-auto text-sm underline font-semibold' onClick={toggleAll}>
            {options.length !== posts.length && 'select all'}
            {options.length === posts.length && 'deselect all'}
          </button>
        )}
      </header>
      <div className='flex flex-col items-end sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2'>
        <TagField tags={tags} onTags={setTags} className="flex-1 w-full"/>
        <Filter className='flex-none' selected={postType} onSelect={(value) => setPostType(value)} />
      </div>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {posts.length === 0 && loading ? (
            <div className='flex items-center space-x-2 text-lavender'>
              <Spinner className='w-6 h-6' />
              <span>Checking posts...</span>
            </div>
          ) : posts.length === 0 && !loading ? (
            <h2 className='text-lavender'>All posts already indexed</h2>
          ) : (
            <PostOptions options={posts} showTags />
          )}
          <div className='flex justify-between border-t border-zinc-300 py-3 mt-6'>
            <Link to="/search" className='flex items-center rounded-lg text-base font-semibold text-rosy bg-rosy/30 border-2 border-transparent hover:border-rosy leading-none py-2 px-3 transition-colors'>
              Back to Search
            </Link>
            {posts.length > 0 && (
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