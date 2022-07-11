import cn from 'classnames';
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Meta } from './Meta';

export const Layout = () => {
  const params = useParams<{ lookup: string }>();

  return (
    <main className={cn("flex flex-col items-center min-h-screen", !params.lookup && 'justify-center')}>
      <div className="max-w-2xl w-full p-4 sm:py-12 px-8 space-y-6">
        <Outlet />
      </div>
      <Meta className='self-start mx-10 my-6 sm:m-0 sm:fixed left-4 bottom-4 text-sm'/>
    </main>
  )
}