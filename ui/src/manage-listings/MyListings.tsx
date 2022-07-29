import { size } from 'lodash';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../api';
import { Listings } from '../components/Listings';
import { Directory, Remove } from '../types/sphinx';

export const MyListings = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery('published', () => api.scry<Directory>({
    app: 'sphinx',
    path: '/published'
  }));
  const { mutate } = useMutation((hash: string) => {
    return api.poke<Remove>({
      app: 'sphinx',
      mark: 'remove',
      json: hash
    })
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('published');
    }
  });

  return (
    <div className='w-full space-y-6 m-auto'>
      <header className='flex items-center'>
        <h1 className='text-2xl font-semibold'>My Listings</h1>
      </header>
      <Listings listings={Object.values(data || {})} remove={mutate} className="mt-6" />
    </div>
  )
}