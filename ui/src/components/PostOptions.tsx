import { CheckIcon } from '@heroicons/react/solid';
import { uxToHex } from '@urbit/api';
import cn from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { PostOption, PostOptionsForm } from '../types/sphinx';

interface PostOptionsProps {
  options: PostOption[];
  className?: string;
}

export const PostOptions = ({ options, className }: PostOptionsProps) => {
  const { register } = useFormContext<PostOptionsForm>();

  return (
    <ul className={cn('space-y-3', className)}>
      {options && options.map(o => (
        <li key={o.key}>
          <input {...register('options')} id={o.key} value={o.key} type="checkbox" className='sr-only' />
          <label htmlFor={o.key} className='checked-bg-fawn group-1 flex w-full p-2 hover:bg-fawn  cursor-pointer rounded-xl'>
            {o.post.image ? (
                <img 
                  src={o.post.image} 
                  className="w-16 h-16 object-cover rounded-lg" 
                  style={{ backgroundColor: o.post.color ? `#${uxToHex(o.post.color)}` : undefined }}
                />
              ) : (
                <div 
                  className='w-16 h-16 bg-rosy/20 rounded-lg' 
                  style={{ backgroundColor: o.post.color ? `#${uxToHex(o.post.color)}` : undefined }}
                />
              )}
            <div className='flex-1 ml-4'>
              <span className='block font-semibold text-lg leading-none mb-1'>{o.post.title}</span>                
              <div className='font-mono text-xs space-x-3'>
                <strong>%{o.post.type}</strong>
                <span>{o.post.link.replace('web+urbitgraph://', '')}</span>
              </div>
              <p className='text-sm'>{o.post.description}</p> 
            </div>
            <div className='flex items-center justify-center m-5 h-6 w-6 border-2 border-solid border-mauve rounded'>
              <CheckIcon className='show-when-checked h-4 w-4 opacity-0' />
            </div>
          </label>
        </li>
      ))}
    </ul>
  )
}