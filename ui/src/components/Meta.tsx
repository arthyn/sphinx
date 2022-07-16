import { PlusIcon } from '@heroicons/react/solid';
import { ChargeUpdateInitial, scryCharges } from '@urbit/api';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Logo } from './Logo';

interface MetaProps {
  className?: string;
}

export const Meta = ({ className }: MetaProps) => {
  const [version, setVersion] = useState('');
  
  useEffect(() => {
    if (!version) {
      api.scry<ChargeUpdateInitial>(scryCharges).then(charges => {
        const version = charges.initial.sphinx?.version;

        if (version) {
          setVersion(version);
        }
      })
    }
  }, []);

  return (
    <footer className={className}>      
      <div className='flex mb-2 space-x-3 items-end'>
        <Logo className="w-24 text-rosy" />
        {version && <span className='mb-[3px]'>v{version}</span>}
      </div>
      <a
        className="inline-block font-mono default-ring underline rounded-md hover:text-rosy mb-4"
        href="web+urbitgraph://group/~nocsyx-lassul/sphinx"
      >
        ~nocsyx-lassul/sphinx
      </a>
      <Link to="/post" className="flex items-center rounded-lg text-base font-semibold text-rosy bg-rosy/30 border-2 border-transparent hover:border-rosy p-2 transition-colors">
        <PlusIcon className='h-4 w-4 mr-1' />
        Add a Listing
      </Link>
    </footer>
  )
}