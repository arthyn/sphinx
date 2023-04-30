import { CheckIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PostOption, PostOptionsForm } from '../types/sphinx';
import { normalizeColor } from '../utils';

interface PostOptionsProps {
  options: PostOption[];
  showTags?: boolean;
  className?: string;
}

export const PostOptions = ({ options, showTags = false, className }: PostOptionsProps) => {
  const { register } = useFormContext<PostOptionsForm>();

  return (
    <ul className={cn('space-y-3', className)}>
      {options && options.map((o, index) => (
        <li key={o.key}>
          <input {...register('options')} id={o.key} value={o.key} type="checkbox" className='sr-only' />
          <label htmlFor={o.key} className='checked-bg-fawn group-1 relative grid grid-rows-[auto,auto] sm:grid-rows-1 grid-cols-[64px,1fr] sm:grid-cols-[64px,1fr,24px] w-full p-2 hover:bg-fawn  cursor-pointer rounded-xl'>
            <div className='absolute z-10 top-7 left-7 flex items-center justify-center h-6 w-6 border-2 border-solid border-mauve rounded bg-linen/80'>
              <CheckIcon className='show-when-checked h-4 w-4 opacity-0' />
            </div>
            {o.post.image ? (
                <img 
                  src={o.post.image} 
                  className="show-when-checked w-16 h-16 col-span-1 object-cover rounded-lg opacity-60"
                  loading={index > 15 ? 'lazy' : 'eager'} 
                  style={{ backgroundColor: o.post.color ? normalizeColor(o.post.color) : undefined }}
                />
              ) : (
                <div 
                  className='w-16 h-16 col-span-1 bg-rosy/20 rounded-lg' 
                  style={{ backgroundColor: o.post.color ? normalizeColor(o.post.color) : undefined }}
                />
              )}
            <div className='ml-4 min-w-0 sm:space-y-2'>
              <span className='block font-semibold text-lg leading-none mb-2 sm:mb-0'>{o.post.title}</span>                
              <div className='flex flex-col sm:flex-row sm:items-center w-full text-xs space-y-2 sm:space-y-0 sm:space-x-3 truncate'>
                <strong className='font-mono'>%{o.post.type}</strong>
                {showTags && <p><strong>tags: </strong><em>{o.post.tags.join()}</em></p>}
              </div>              
              <p className='hidden sm:block font-mono text-xs truncate'>{o.post.link.replace('web+urbitgraph://', '')}</p>
            </div>
            <div className='col-span-2 row-start-2 mt-2'>
              <p className='font-mono text-xs truncate sm:hidden'>{o.post.link.replace('web+urbitgraph://', '')}</p>
              <p className='text-sm'>{o.post.description}</p>
            </div>            
          </label>
        </li>
      ))}
    </ul>
  )
}