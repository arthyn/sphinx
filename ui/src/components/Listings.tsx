import { UserRemoveIcon, UsersIcon } from '@heroicons/react/solid';
import { deSig, uxToHex } from '@urbit/api';
import cn from 'classnames';
import React from 'react';
import { usePals } from '../state/pals';
import { Listing } from '../types/sphinx';

interface ListingsProps {
  listings: Listing[];
  remove: (hash: string) => void;
  className?: string;
}

export const Listings = ({ listings, remove, className }: ListingsProps) => {
  const { installed, outgoing, remove: removePal } = usePals();
  console.log(outgoing);
  if (!listings) {
    return null;
  }

  if (listings.length === 0) {
    return (
      <div>
        <h2 className='text-xl font-semibold'>No Results</h2>
        {installed ? (
          <p>Try adding more <a href="/pals" className='underline'>pals</a> to see what others have shared</p>
        ) : (
          <p>Without pals installed you'll only see your own listings</p>
        )}
      </div>
    )
  }

  return (
    <ul className={cn('space-y-6', className)}>
      {listings && listings.map(l => (
        <li key={l.hash}>
          <article className='group-1 flex w-full'>
            {l.post.image ? (
              <img 
                src={l.post.image} 
                className="w-24 h-24 object-cover rounded-xl" 
                style={{ backgroundColor: l.post.color ? `#${uxToHex(l.post.color)}` : undefined }}
              />
            ) : (
              <div 
                className='w-24 h-24 bg-rosy/20 rounded-xl' 
                style={{ backgroundColor: l.post.color ? `#${uxToHex(l.post.color)}` : undefined }}
              />
            )}
            <div className='flex-1 ml-4'>
              <a className='block w-full mb-2 hover:text-rosy transition-colors' href={l.post.link}>
                <h2 className='block font-semibold text-lg leading-none mb-1'>{l.post.title}</h2>                
                <div className='font-mono text-xs space-x-3'>
                  <strong>%{l.post.type}</strong>
                  <span>{l.post.link.replace('web+urbitgraph://', '')}</span>
                </div>
              </a>
              <p className='mb-2 text-sm'>{l.post.description}</p>              
              <div className='flex flex-col items-start sm:flex-row sm:items-center w-full font-mono text-xs text-zinc-500 opacity-0 group-1-hover:opacity-100 transition-opacity'>
                <div className='flex items-center'>                
                  <span className='inline-flex items-center'>
                    <span className='font-semibold font-sans mr-1'>by:</span> 
                    <span>{l.source}</span>
                    {outgoing[deSig(l.source) || ''] && (
                      <button className='group-2 relative inline-flex items-center justify-center px-2 hover:text-rosy' aria-label='Remove pal' title="Remove Pal" onClick={() => removePal(deSig(l.source) || '')}>
                        <UsersIcon className='h-4 w-4 group-2-hover:opacity-0' />
                        <UserRemoveIcon className='absolute h-4 w-4 opacity-0 group-2-hover:opacity-100' />
                      </button>
                    )}
                  </span>
                  <time dateTime={(new Date(l.time)).toISOString()} className="ml-3">
                    {(new Date(l.time)).toLocaleString()}
                  </time>
                </div>
                <button className='sm:ml-auto font-semibold font-sans hover:text-rosy bg-transparent border-0' onClick={() => remove(l.hash)}>remove</button>
              </div>  
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}