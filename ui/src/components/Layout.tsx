import { MenuIcon } from '@heroicons/react/solid';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cn from 'classnames';
import React from 'react';
import { NavLink, NavLinkProps, Outlet } from 'react-router-dom';
import useMedia from '../logic/useMedia';
import { BrowsingRoutes, PostingRoutes } from '../routes';
import { Meta } from './Meta';

const DesktopNavLink = ({ to, children, ...props }: NavLinkProps) => (
  <li>
    <NavLink to={to} className={({ isActive }) => cn('hover:text-rosy transition-colors', isActive && 'underline')} {...props}>
      { children }
    </NavLink>
  </li>
)

interface WrappedNavLinkProps extends NavLinkProps {
  navClassName: (props: { isActive: boolean }) => string;
}

const WrappedNavLink = React.forwardRef<HTMLAnchorElement, WrappedNavLinkProps>(({ className, navClassName, ...props }, forwardedRef) => {
  return (
    <NavLink
      {...props}
      className={(props) => `${className} ${navClassName(props)}`}
      ref={forwardedRef}
    />
  );
});

const MobileNavLink = ({ to, children }: NavLinkProps) => (
  <DropdownMenu.Item asChild>
    <WrappedNavLink to={to} navClassName={({ isActive }) => cn('block hover:text-rosy transition-colors', isActive && 'underline')}>
      { children }
    </WrappedNavLink>
  </DropdownMenu.Item>
)

export const Layout = () => {
  const isMobile = useMedia('(max-width: 639px)');

  return (
    <main className={cn("flex flex-col items-center h-full min-h-screen")}>
      <Outlet />
      <aside className='self-start mx-4 mb-6 mt-auto sm:m-0 sm:fixed left-4 bottom-4'>
        {isMobile ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className='button fixed bottom-6 right-4 p-2 rounded-full' aria-label='Open Menu'>
              <MenuIcon className='w-6 h-6' />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content sideOffset={16} className='min-w-[200px] bg-linen shadow-lg rounded-xl'>
              <div className='p-4 space-y-3 text-right bg-fawn/30 rounded-xl'>
                {Object.entries(BrowsingRoutes).map(([k,v]) => <MobileNavLink key={v} to={v}>{k}</MobileNavLink>)}
                <DropdownMenu.Separator className='border-t-2 border-mauve'/>
                {Object.entries(PostingRoutes).map(([k,v]) => <MobileNavLink key={v} to={v}>{k}</MobileNavLink>)}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : (
          <nav className='w-24 mb-10'>
            <ul className='font-semibold text-sm space-y-2'>
              {Object.entries(BrowsingRoutes).map(([k,v]) => <DesktopNavLink key={v} to={v} end={k === 'tags'}>{k}</DesktopNavLink>)}
            </ul>
            <hr className='block my-4 border-mauve/60'/>
            <ul className='font-semibold text-sm space-y-2'>
              {Object.entries(PostingRoutes).map(([k,v]) => <DesktopNavLink key={v} to={v}>{k}</DesktopNavLink>)}
            </ul>
          </nav>
        )}
        <Meta className='text-sm'/>
      </aside>
    </main>
  )
}