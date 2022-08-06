import { SearchIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import React, { ChangeEvent, useCallback } from 'react';
import { Spinner } from './Spinner';

interface SearchInputProps {
  lookup: string;
  loading: boolean;
  className?: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ lookup, loading, className, onChange }: SearchInputProps) => {
  const onInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange(value);
  }, [onChange]);

  return (
    <div className={cn('relative flex items-center', className)}>
      <SearchIcon className='flip absolute left-2 h-5 w-5' />
      <input 
        type='text' 
        value={lookup} 
        onChange={onInput}
        placeholder="Search"
        className={cn('w-full py-1 pl-9 pr-2 bg-fawn/30 focus:outline-none focus:ring-2 ring-lavender rounded-lg border border-fawn/30')}
      />
      {loading && <Spinner className='absolute right-2 h-5 w-5' />}
    </div>    
  )
}
