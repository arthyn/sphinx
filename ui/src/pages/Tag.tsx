import { PlusIcon, PlusSmIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import qs from 'query-string';
import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { Listings } from '../components/Listings';
import { Paginator } from '../components/Paginator';
import { TagCloud } from '../components/TagCloud';
import { useSearch } from '../state/search';
import { useTags } from '../state/tags';
import { Remove, Search } from '../types/sphinx';
import { encodeLookup } from '../utils';
import { tagKey } from '../keys';

interface RouteParams extends Record<string, string | undefined> {
  tag?: string;
  limit?: string;
  page?: string;
}

export const Tag = () => {
  const tags = useTags();
  const { tag, limit, page } = useParams<RouteParams>();
  const {
    size,
    start,
    pageInt,
    pages,
    results,
    linkBuild
  } = useSearch({
    key: tagKey(tag),
    fetcher: (start, size) => api.scry<Search>({
      app: 'sphinx',
      path: `/lookup/tag/${start}/${size}/${encodeLookup(tag)}`
    }),
    enabled: !!tag,
    limit,
    page,
    linkPrefix: `/tags/${tag}`
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation((hash: string) => {
    return api.poke<Remove>({
      app: 'sphinx',
      mark: 'remove',
      json: hash
    })
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(tagKey(tag)(start, size))
    }
  });

  return (
    <div className={cn('w-full space-y-6', !tag && 'm-auto')}>
      {!tag && <h1 className='text-2xl font-semibold'>Tags</h1>}
      <div className={cn('h-[136px] overflow-y-auto', tag && 'mb-12')}>
        <TagCloud tags={tags} />
      </div>
      {tag && <header className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold leading-none'>{tag}</h1>
        <Link 
          to={{ pathname: '/manage-listings/post', search: qs.stringify({ tags: [tag] }) }}
          className="inline-flex items-center px-2 pr-3 py-1 font-semibold text-linen bg-lavender hover:bg-rosy transition-colors rounded-lg"
        >
          <PlusSmIcon className='w-5 h-5' />
          <span>Add</span>
        </Link>
      </header>}
      {tag && results && <div className='flex justify-end border-t border-zinc-300'>
        <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
      </div>}
      {tag && <Listings listings={results.listings} remove={mutate} />}
      {results && pages > 1 && <div className='flex justify-end border-t border-zinc-300'>
        <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
      </div>}
    </div>
  )
}