import cn from 'classnames';
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import useMedia from '../logic/useMedia';
import { useNotebooks } from '../state/posts';
import { Posts } from './Posts';
import { getColor, getImage } from '../utils';

export const Notebooks = () => {
  const { ship, name } = useParams<{ ship: string, name: string }>();
  const limited = useMedia('(max-width: 899px)');
  const { groups, notebooks, loading } = useNotebooks();
  const sortedNotebooks = Object.entries(notebooks)
    .sort(([,a], [,b]) => a.meta.title.localeCompare(b.meta.title));

  return (
    <div className="flex-none flex flex-col max-w-5xl w-full p-4 sm:py-12 sm:px-8 space-y-6 sm:pl-32 xl:pl-8">
      <div className='flex items-start'>
        {((limited && !ship) || !limited) &&
          <aside className='sticky top-4 sm:top-12 flex-none flex flex-col sm:w-72 sm:h-[80vh] pt-14 sm:pt-0 mr-6 self-start'>
            <header className='flex-none fixed sm:static top-0 w-full p-4 pl-0 sm:p-0 bg-linen'>
              <h1 className='text-2xl font-semibold ml-2 sm:mb-6'>Add Posts</h1>
            </header>
            <ul className='flex-1 sm:overflow-y-auto'>
              {loading && <div className='flex items-center space-x-2 text-lavender mt-6'>
                <Spinner className='w-6 h-6' />
                <span>Loading notebooks...</span>
              </div>}
              {sortedNotebooks.map(([id, n], index) => {
                const [,group] = groups.find(([k]) => k === n.perms.group) || [];
                const image = group && (getImage(group.meta.image) || getImage(group.meta.cover) || '');
                const color = group && (getColor(group.meta.image) || getColor(group.meta.cover) || '');

                return (
                  <li key={id}>
                    <NavLink to={`/manage-listings/posts/${id}`} className={({ isActive }) => cn('flex items-center p-2 space-x-2 leading-tight rounded-md hover:bg-fawn', isActive && 'bg-fawn')}>
                      {group && image ? (
                        <img 
                          src={image} 
                          className="flex-none w-10 h-10 object-cover rounded-md"
                          loading={index > 15 ? 'lazy' : 'eager'} 
                          style={{ backgroundColor: color }}
                        />
                      ) : group ? (
                        <div 
                          className='flex-none w-10 h-10 bg-rosy/20 rounded-md' 
                          style={{ backgroundColor: color }}
                        />
                      ) : null}
                      <div className='flex flex-col min-w-0'>
                        <strong className='w-full truncate'>{n.meta.title}</strong>
                        {group && <span className='text-sm'>{group.meta.title}</span>}
                      </div>
                    </NavLink>
                  </li>
                )}
              )}
            </ul>
          </aside>
        }
        {((limited && ship) || !limited) &&
          <section className='flex-1 min-w-0 space-y-6'>
            {!loading && notebooks && ship && name && <Posts ship={ship} name={name} />}
          </section>
        }
      </div>
    </div>
  )
}