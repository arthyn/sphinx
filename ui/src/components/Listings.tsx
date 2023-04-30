import cn from 'classnames';
import React from 'react';
import { usePals } from '../state/pals';
import { Listing as ListingType } from '../types/sphinx';
import { Listing } from './Listing';

interface ListingsProps {
  listings: ListingType[];
  remove: (hash: string) => void;
  className?: string;
}

export const Listings = ({ listings, remove, className }: ListingsProps) => {
  const { installed, outgoing, remove: removePal } = usePals();
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
          <Listing {...l} outgoing={outgoing} remove={remove} removePal={removePal} />
        </li>
      ))}
    </ul>
  )
}