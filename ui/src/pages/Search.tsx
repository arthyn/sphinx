import cn from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { SearchInput } from '../components/SearchInput';
import { SearchList } from '../components/SearchList';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { PostFilter, PostType, Remove, Search as SearchType } from '../types/sphinx';
import api from '../api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Paginator } from '../components/Paginator';
import { stringToTa } from '@urbit/api';
import { Filter } from '../components/Filter';
import { Meta } from '../components/Meta';
import { DocumentAddIcon, PlusCircleIcon, PlusIcon } from '@heroicons/react/solid';

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
  const size = parseInt(limit || '10', 10);
  const pageInt = parseInt(page || '1', 10) - 1;
  const start = pageInt * size;
  const { data } = useQuery<unknown, unknown, SearchType>(`lookup-${selected}-${lookup}-${size}-${start}`, () => api.scry<SearchType>({
    app: 'sphinx',
    path: `/lookup/${selected}/${encodeLookup(lookup)}/${start}/${size}`
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
      queryClient.invalidateQueries(`lookup-${selected}-${lookup}-${size}-${start}`)
    }
  })

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
    
    return `/${lookup}/${size}/${page || 1}`
  }, [lookup, size]);

  return (
    <>
      <header className='flex items-center space-x-2'>
        <SearchInput className='flex-1' lookup={rawSearch} onChange={onChange} />
        <Filter selected={selected} onSelect={setSelected} />
      </header>
      {lookup && data && <div className='flex justify-end border-t border-zinc-300'>
        <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
      </div>}
      {lookup && <SearchList listings={data?.listings || []} remove={mutate} />}
      {data && pages > 1 && <div className='flex justify-end border-t border-zinc-300'>
        <Paginator pages={pages} currentPage={pageInt} linkBuilder={linkBuild} />
      </div>}
    </>
  )
}