import cn from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { stringToTa } from '@urbit/api';
import { SearchInput } from '../components/SearchInput';
import { Listings } from '../components/Listings';
import { PostFilter, Remove, Search as SearchType } from '../types/sphinx';
import api from '../api';
import { Paginator } from '../components/Paginator';
import { Filter } from '../components/Filter';
import { PlusSmIcon } from '@heroicons/react/solid';
import { usePals } from '../state/pals';

interface RouteParams extends Record<string, string | undefined> {
  lookup?: string;
  limit?: string;
  page?: string;
}

function encodeLookup(value: string | undefined) {
  if (!value) {
    return '';
  }

  return stringToTa(value).replace('~.', '~~');
}

export const Search = () => {
  const navigate = useNavigate();
  const { 
    lookup,
    limit,
    page
  } = useParams<RouteParams>();
  const [selected, setSelected] = useState<PostFilter>('all')
  const [rawSearch, setRawSearch] = useState(lookup || '');
  const { installed: palsInstalled } = usePals();
  const size = parseInt(limit || '10', 10);
  const pageInt = parseInt(page || '1', 10) - 1;
  const start = pageInt * size;
  const { data } = useQuery<unknown, unknown, SearchType>(`lookup-${selected}-${size}-${start}-${lookup}`, () => api.scry<SearchType>({
    app: 'sphinx',
    path: `/lookup/${selected}/${start}/${size}/${encodeLookup(lookup)}`
  }), {
    enabled: !!lookup,
    keepPreviousData: true
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
      queryClient.invalidateQueries(`lookup-${selected}-${size}-${start}-${lookup}`)
    }
  });

  const total = data?.total || 0;
	const pages =
		total % size === 0
			? total / size
			: Math.floor(total / size) + 1;

  const update = useRef(debounce((value: string) => {
    if (!value) {
      return;
    }

    navigate(`/search/${value}/${size}/${page || '1'}`)
  }, 400))

  const onChange = useCallback((value: string) => {
    setRawSearch(value);
    update.current(value);
  }, []);

  const linkBuild = useCallback((page) => {
    if (!page) {
      return null;
    }
    
    return `/search/${lookup}/${size}/${page || 1}`
  }, [lookup, size]);

  return (
    <>
      <header className='flex items-center space-x-2'>
        <SearchInput className='flex-1' lookup={rawSearch} onChange={onChange} />
        <Filter selected={selected} onSelect={setSelected} className="min-w-0 sm:w-20" />
      </header>
      {!palsInstalled && (
        <div>
          <a href="/apps/grid/leap/search/~paldev/apps/~paldev/pals" className='inline-flex items-center py-1 px-2 mr-2 font-semibold  bg-green-800 text-linen rounded-md'>
            <PlusSmIcon className='h-4 w-4' />
            install pals
          </a>
          to see listings from others
        </div>
      )}
      {lookup && data && <div className='flex justify-end border-t border-zinc-300'>
        <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
      </div>}
      {lookup && <Listings listings={data?.listings || []} remove={mutate} />}
      {data && pages > 1 && <div className='flex justify-end border-t border-zinc-300'>
        <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
      </div>}
    </>
  )
}