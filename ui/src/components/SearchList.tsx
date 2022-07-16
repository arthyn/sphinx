import cn from 'classnames';
import React, { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import api from '../api';
import { Listing, Remove } from '../types/sphinx';

interface SearchListProps {
  listings: Listing[];
  remove: (hash: string) => void;
  className?: string;
}

export const SearchList = ({ listings, remove, className }: SearchListProps) => {
  if (!listings) {
    return null;
  }

  if (listings.length === 0) {
    return (
      <div>
        <h2 className='text-xl font-semibold'>No Results</h2>
      </div>
    )
  }

  return (
    <ul className={cn('px-2 space-y-6', className)}>
      {listings && listings.map(l => (
        <li key={l.hash}>
          <article className='group flex w-full'>
            {l.post.image ? (
              <img src={l.post.image} className="w-24 h-24 object-cover rounded-xl" />
              ) : <div className='w-24 h-24 bg-rosy/20 rounded-xl' />}
            <div className='flex-1 ml-4'>
              <a className='block w-full mb-2 hover:text-rosy transition-colors' href={l.post.link}>
                <h2 className='block font-semibold text-lg leading-none mb-1'>{l.post.title}</h2>                
                <div className='font-mono text-xs space-x-3'>
                  <strong>%{l.post.type}</strong>
                  <span>{l.post.link.replace('web+urbitgraph://', '')}</span>
                </div>
              </a>
              <p className='mb-2 text-sm'>{l.post.description}</p>              
              <div className='flex items-center w-full font-mono text-xs text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity'>                
                <span><span className='font-semibold font-sans'>by:</span> {l.source}</span>
                <time dateTime={(new Date(l.time)).toISOString()} className="ml-3">
                  {(new Date(l.time)).toLocaleString()}
                </time>
                <button className='ml-auto font-semibold font-sans hover:text-rosy bg-transparent border-0' onClick={() => remove(l.hash)}>remove</button>
              </div>  
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}