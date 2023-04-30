import { UsersIcon, UserRemoveIcon } from '@heroicons/react/solid';
import { deSig } from '@urbit/api';
import React from 'react';
import { ListingImage } from './ListingImage';
import { Listing as ListingType } from '../types/sphinx';
import { normalizeLink, refToURL } from '../utils';
import { Pals } from '../state/pals';
import { ChannelPreview } from '../types';
import { useChannelPreview } from '../state/groups';

interface ListingProps extends ListingType {
  remove: (hash: string) => void;
  removePal: (ship: string) => void;
  outgoing: Pals;
}

function getURL(link: string | { nest: string, where: string }, preview?: ChannelPreview) {
  if (typeof link === 'string') {
    return link;
  }

  const prefix = `/apps/groups`;
  const suffix = `/${link.nest}/${link.where}`

  if (!preview) {
    return `${prefix}/1/chan${suffix}`;
  }

  return `${prefix}/groups/${preview.group.flag}/channels${suffix}`;
}

export const Listing = ({ hash, time, source, post, remove, removePal, outgoing }: ListingProps) => {
  const cite = normalizeLink(post.link);
  const link = refToURL(cite);
  const preview = useChannelPreview(typeof link === 'object' ? link.nest : '');
  const hardURL = getURL(link, preview);

  return (
    <article className='group-1 flex w-full'>
      <ListingImage {...post} className="hidden sm:inline-block w-24 h-24 rounded-xl" />
      <div className='flex-1 min-w-0 sm:ml-4'>
        <div className='flex items-center'>
          <ListingImage {...post} className="flex-none sm:hidden w-14 h-14 mr-2 mb-2 rounded-xl" />
          <a className='flex-1 min-w-0 mb-2 hover:text-rosy transition-colors' href={hardURL}>
            <h2 className='block font-semibold text-lg leading-none mb-1'>{post.title}</h2>                
            <div className='font-mono text-xs space-x-3 truncate'>
              <strong>%{post.type}</strong>
              <span>{cite}</span>
            </div>
          </a>
        </div>
        <p className='mb-2 text-sm'>{post.description}</p>              
        <div className='flex flex-col items-start sm:flex-row sm:items-center w-full font-mono text-xs text-zinc-500 sm:opacity-0 group-1-hover:opacity-100 transition-opacity'>
          <div className='flex items-center'>                
            <span className='inline-flex items-center'>
              <span className='font-semibold font-sans mr-1'>by:</span> 
              <span>{source}</span>
              {outgoing[deSig(source) || ''] && (
                <button className='group-2 relative inline-flex items-center justify-center px-2 hover:text-rosy' aria-label='Remove pal' title="Remove Pal" onClick={() => removePal(deSig(source) || '')}>
                  <UsersIcon className='h-4 w-4 opacity-0 sm:opacity-100 group-2-hover:opacity-0' />
                  <UserRemoveIcon className='absolute h-4 w-4 sm:opacity-0 group-2-hover:opacity-100' />
                </button>
              )}
            </span>
            <time dateTime={(new Date(time)).toISOString()} className="ml-3">
              {(new Date(time)).toLocaleString()}
            </time>
          </div>
          <button className='sm:ml-auto font-semibold font-sans hover:text-rosy bg-transparent border-0' onClick={() => remove(hash)}>remove</button>
        </div>  
      </div>
    </article>
  )
}