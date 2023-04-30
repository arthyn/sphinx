import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Listings } from '../components/Listings';
import { Paginator } from '../components/Paginator';
import { useSearch } from '../state/search';
import { Remove, Search } from '../types/sphinx';
import { PUBLISHED_KEY } from '../keys';

interface RouteParams extends Record<string, string | undefined> {
  limit?: string;
  page?: string;
}

export const AllListings = () => {
  const queryClient = useQueryClient();
  const { 
    limit,
    page
  } = useParams<RouteParams>();
  const {
    results,
    pages,
    pageInt,
    linkBuild
  } = useSearch({
    key: (start, size) => ['all', start, size],
    fetcher: (start, size) => api.scry<Search>({
      app: 'sphinx',
      path: `/lookup/all/${start}/${size}`
    }),
    enabled: true,
    limit,
    page,
    linkPrefix: '/manage-listings/all'
  })
  const { mutate } = useMutation((hash: string) => {
    return api.poke<Remove>({
      app: 'sphinx',
      mark: 'remove',
      json: hash
    })
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(PUBLISHED_KEY);
    }
  });

  return (
    <>
      <header className='flex items-center'>
        <h1 className='text-2xl font-semibold'>All Listings</h1>
      </header>
      {results && <div className='flex justify-end border-t border-zinc-300'>
        <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
      </div>}
      <Listings listings={results.listings} remove={mutate} />
      {results && pages > 1 && <div className='flex justify-end border-t border-zinc-300'>
        <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
      </div>}
    </>
  )
}