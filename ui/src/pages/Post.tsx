import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { MultiValue } from 'react-select';
import api from '../api';
import { Filter } from '../components/Filter';
import { Option, TagField } from '../components/TagField';
import { Declare, Post as PostForm } from '../types/sphinx';

export const Post = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<MultiValue<Option>>([]);
  const [image, setImage] = useState<string>('');
  const { register, watch, reset, setValue, handleSubmit } = useForm<PostForm>({
    defaultValues: {
      title: '',
      type: 'other',
      link: '',
      image: '',
      description: ''
    }
  });

  const updateImg = useRef(debounce(setImage));
  const img = watch('image');
  const type = watch('type');

  const onSubmit = useCallback((values: Omit<PostForm, 'tags'>) => {
    api.poke<Declare>({
      app: 'sphinx',
      mark: 'declare',
      json: {
        reach: 'friends',
        post: {
          ...values,
          tags: tags.map(t => t.value)
        }
      }
    })
    reset();
    setTags([]);
  }, [tags]);

  useEffect(() => {
    register('type')
  }, []);

  useEffect(() => {
    if (img) {
      updateImg.current(img)
    }
  }, [img]);

  return (
    <>
      <header>
        <h1 className='text-2xl font-semibold'>Add a Listing</h1>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex w-full space-x-6'>
          <div className='flex-1 space-y-3'>
            <div>
              <label htmlFor='title' className='text-sm font-semibold'>Title</label>
              <div className='flex items-center space-x-2'>
                <input {...register('title', { required: true, maxLength: 80 })} className='flex-1 w-full py-1 px-2 bg-fawn/30 focus:outline-none focus:ring-2 ring-lavender rounded-lg border border-fawn/30' placeholder='sphinx'/>
                <Filter selected={type} onSelect={(value) => setValue('type', value)} />
              </div>
            </div>
            <div className='flex items-center space-x-6'>
              <div className='flex-1 space-y-3'>
                <div>
                  <label htmlFor='image' className='text-sm font-semibold'>Image</label>
                  <input type="url" {...register('image')} className='flex-1 w-full py-1 px-2 bg-fawn/30 focus:outline-none focus:ring-2 ring-lavender rounded-lg border border-fawn/30' placeholder='https://nyc3.digitaloceanspaces.com/...' />
                </div>
                <div>
                  <label htmlFor='link' className='text-sm font-semibold'>Link</label>
                  <input type="url" {...register('link', { required: true })} className='flex-1 w-full py-1 px-2 bg-fawn/30 focus:outline-none focus:ring-2 ring-lavender rounded-lg border border-fawn/30' placeholder='web+urbitgraph://~nocsyx-lassul/sphinx' />
                </div>
              </div>
              <img className='flex-none object-cover w-28 h-28 mt-4 border-2 border-dashed border-mauve/60 rounded-lg' src={image || undefined} />
            </div>
            <div>
              <label htmlFor='description' className='text-sm font-semibold'>Description</label>
              <textarea {...register('description', { required: true, maxLength: 256 })} rows={2} className='align-middle w-full py-1 px-2 bg-fawn/30 focus:outline-none focus:ring-2 ring-lavender rounded-lg border border-fawn/30' placeholder='An app for answering your riddles' />
            </div>
            <div>
              <label className='text-sm font-semibold'>Tags</label>
              <TagField tags={tags} onTags={setTags} />
            </div>
            <div className='pt-3'>
              <div className='flex justify-between border-t border-zinc-300 py-3'>
                <button type="button" className='flex items-center rounded-lg text-base font-semibold text-rosy bg-rosy/30 border-2 border-transparent hover:border-rosy leading-none py-2 px-3 transition-colors' onClick={() => navigate(-1)}>
                  Back to Search
                </button>
                <button type="submit" className='flex items-center rounded-lg text-base font-semibold text-linen bg-rosy border-2 border-transparent hover:border-linen/60 leading-none py-2 px-3 transition-colors'>
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}