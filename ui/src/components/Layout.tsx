import cn from 'classnames';
import React from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { Meta } from './Meta';

export const Layout = () => {
  const params = useParams<{ lookup: string }>();

  return (
    <main className={cn("flex flex-col items-center min-h-screen", !params.lookup && 'justify-center')}>
      <div className="max-w-2xl w-full p-4 sm:py-12 sm:px-8 space-y-6">
        <Outlet />
      </div>
      <aside className='self-start mx-4 mb-6 mt-auto sm:m-0 sm:fixed left-4 bottom-4'>
        <nav className='mb-10'>
          <ul className='font-semibold text-sm space-y-4'>
            <li>
              <NavLink to="/search" className={({ isActive }) => cn('hover:text-rosy transition-colors', isActive && 'underline')}>search</NavLink>
            </li>
            <li>
              <NavLink to="/manage-listings" end className={({ isActive }) => cn('hover:text-rosy transition-colors', isActive && 'underline')}>my listings</NavLink>
            </li>
            <li>
              <NavLink to="/manage-listings/post" className={({ isActive }) => cn('hover:text-rosy transition-colors', isActive && 'underline')}>post listing</NavLink>
            </li>
            <li>
              <NavLink to="/manage-listings/apps" className={({ isActive }) => cn('hover:text-rosy transition-colors', isActive && 'underline')}>add apps</NavLink>
            </li>
            <li>
              <NavLink to="/manage-listings/groups" className={({ isActive }) => cn('hover:text-rosy transition-colors', isActive && 'underline')}>add groups</NavLink>
            </li>
          </ul>
        </nav>
        <Meta className='text-sm'/>
      </aside>
    </main>
  )
}