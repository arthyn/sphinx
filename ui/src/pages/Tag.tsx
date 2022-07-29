import cn from 'classnames';
import React from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { Listings } from '../components/Listings';
import { Paginator } from '../components/Paginator';
import { TagCloud } from '../components/TagCloud';
import { useSearch } from '../state/search';
import { useTags } from '../state/tags';
import { Remove, Search } from '../types/sphinx';
import { encodeLookup } from '../utils';

interface RouteParams extends Record<string, string | undefined> {
  tag?: string;
  limit?: string;
  page?: string;
}

const tagKey = (tag?: string) => (start: number, size: number) => `tag-${tag || ''}-${size}-${start}`

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
      <header className='flex items-center'>
        <h1 className='text-2xl font-semibold leading-none'>{tag}</h1>
      </header>
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