import cn from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface TagCloudProps {
  tags: [string, number][];
}

export const TagCloud = ({ tags }: TagCloudProps) => (
  <section className='flex flex-wrap gap-2'>
    {tags.map(([t, count]) => (
      <NavLink key={t} to={`/tags/${t}`} className={({ isActive }) => cn("py-0.5 px-1.5 space-x-2 rounded-md font-semibold", isActive ? 'bg-lavender text-linen' : 'bg-fawn')}>
        <span>{t}</span>
        <span className='opacity-60'>{count}</span>
      </NavLink>
    ))}
  </section>
)