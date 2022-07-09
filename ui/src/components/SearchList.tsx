import cn from 'classnames';
import React from 'react';
import { Listing } from '../types/seek';

interface SearchListProps {
  listings: Listing[];
  className?: string;
}

export const SearchList = ({ listings, className }: SearchListProps) => {
  return (
    <ul className={cn('px-2 space-y-6', className)}>
      {listings && listings.map(l => (
        <li key={l.hash}>
          <article className='group relative flex w-full'>
            {l.post.image ? (
              <img src={l.post.image} className="absolute -left-28 w-24 h-24 object-cover" />
              ) : <div className='absolute -left-28 w-24 h-24' />}
            <div className='flex-1'>
              <a className='block w-full mb-2 hover:text-rosy transition-colors' href={l.post.link}>
                <h2 className='block font-semibold text-lg leading-none mb-1'>{l.post.title}</h2>                
                <span className='block font-mono text-xs'>{l.post.link.replace('web+urbitgraph://', '')}</span>
              </a>
              <p className='mb-2 text-sm'>{l.post.description}</p>              
              <div className='flex font-mono text-xs text-zinc-500 space-x-3 opacity-0 group-hover:opacity-100 transition-opacity'>                
                <span><span className='font-semibold font-sans'>by:</span> {l.source}</span>
                <time dateTime={(new Date(l.time)).toISOString()}>
                  {(new Date(l.time)).toLocaleString()}
                </time>
              </div>  
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}