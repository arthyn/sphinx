import React from 'react';
import { TagCloud } from '../components/TagCloud';
import { useTags } from '../state/tags';

export const Tags = () => {
  const tags = useTags();

  return (
    <>
      <header className='flex items-center'>
        <h1 className='text-2xl font-semibold'>Tags</h1>
      </header>
      <TagCloud tags={tags} />
    </>
  )
}