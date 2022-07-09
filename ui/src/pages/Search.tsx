import cn from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { SearchInput } from '../components/SearchInput';
import { SearchList } from '../components/SearchList';
import { useQuery } from 'react-query';
import { Search as SearchType } from '../types/seek';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { Paginator } from '../components/Paginator';
import { stringToTa } from '@urbit/api';

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
  const [rawSearch, setRawSearch] = useState(lookup || '');
  const size = parseInt(limit || '10', 10);
  const pageInt = parseInt(page || '1', 10) - 1;
  const start = pageInt * size;
  const { data } = useQuery<unknown, unknown, SearchType>(`lookup-${lookup}-${size}-${start}`, () => api.scry<SearchType>({
    app: 'seek',
    path: `/lookup/${encodeLookup(lookup)}/${start}/${size}`
  }), {
    enabled: !!lookup,
    keepPreviousData: true
  });

  const total = data?.total || 0;
	const pages =
		total % size === 0
			? total / size
			: Math.floor(total / size) + 1;

  const update = useRef(debounce((value: string) => {
    if (!value) {
      navigate('/');
      return;
    }

    navigate(`/${value}/${size}/${page || '1'}`)
  }, 200))

  const onChange = useCallback((value: string) => {
    setRawSearch(value);
    update.current(value);
  }, []);

  const linkBuild = useCallback((page) => {
    if (!page) {
      return null;
    }
    
    return `/${lookup}/${size}/${page || 1}`
  }, [lookup, size]);

  return (
    <main className={cn("flex flex-col items-center min-h-screen", !data && 'justify-center')}>
      <div className="max-w-xl w-full p-4 sm:py-12 px-8 space-y-6">
        <header>
          <SearchInput lookup={rawSearch} onChange={onChange} />
        </header>
        {data && <div className='flex justify-end border-t border-zinc-300'>
          <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
        </div>}
        <SearchList listings={data?.listings || []} />
        {data && pages > 1 && <div className='flex justify-end border-t border-zinc-300'>
          <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
        </div>}
      </div>
    </main>
  )
}