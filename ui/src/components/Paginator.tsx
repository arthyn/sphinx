import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon, DotsHorizontalIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

interface PaginatorProps {
  linkBuilder: (page: number | null) => string | null;
  currentPage: number;
  pages: number;
  showNextPrev?: boolean;
  pagesShownLimit?: number;
  className?: string;
}

interface Page {
  number: number;
  active?: boolean;
  ellipsis?: boolean;
}

function calculateShownPages(currentPage: number, pages: number, pagesShownLimit: number): Page[] {
  const first = 1;
  const last = pages;
  const gap = Math.floor(pagesShownLimit / 2);
  const start = Math.max(1, Math.min(pages - pagesShownLimit, currentPage - gap));
  const end = Math.min(last, Math.max(first + pagesShownLimit, currentPage + gap));
  const firstEllipsis = (currentPage - first) > gap + 1 && start !== first;
  const lastEllipsis = (last - currentPage) > gap + 1 && end !== last;

  const pageSet: Page[] = [];

  if (start !== first) {
      pageSet.push({
          number: first,
          active: currentPage === first
      });
  }

  if (firstEllipsis) {
      pageSet.push({
          number: 0,
          ellipsis: true,
          active: false
      });
  }

  for (let number=start; number<=end; number++) {
      pageSet.push({ number, active: currentPage === number });
  }

  if (lastEllipsis) {
      pageSet.push({
          number: 0,
          ellipsis: true,
          active: false
      });
  }

  if (last !== end) {
      pageSet.push({
          number: last,
          active: currentPage === last
      })
  }

  return pageSet;
}

export const Paginator = ({ className, linkBuilder, currentPage, pages, showNextPrev = false, pagesShownLimit = 3 }: PaginatorProps) => {
  const normCurrent = currentPage + 1; //shift for 0 based indexing
  if (pages <= 1)
      return null;

  const pageSet = calculateShownPages(normCurrent, pages, pagesShownLimit);
  const prevUrl = linkBuilder(currentPage - 1 >= 0 ? normCurrent - 1 : null);
  const nextUrl = linkBuilder(currentPage + 1 <= pages - 1 ? normCurrent + 1 : null);
      
  return (
    <>
      {showNextPrev && (
        <div className="-mt-px w-0 flex-1 flex">
          {!prevUrl && (
            <span className='border-t-2 border-transparent pt-2 pl-1 inline-flex items-center text-sm font-medium text-zinc-300'>
              <ArrowNarrowLeftIcon className="mr-3 h-5 w-5" />
              Previous
            </span>
          )}
          {prevUrl && <Link to={prevUrl} className="border-t-2 border-transparent pt-2 pr-1 inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700 hover:border-zinc-300">
            <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-zinc-400" />
            Previous
          </Link>}
        </div>
      )}
      {pageSet.map((page, index) => {
        if (page.ellipsis)
            return <span key={index} className="border-transparent text-zinc-500 border-t-2 pt-2 px-4 inline-flex items-center text-sm font-medium"><DotsHorizontalIcon className='w-3 h-3' /></span>
        
        return (
          <Link 
            key={index} 
            to={linkBuilder(page.number) || ''}
            className={cn(
              'border-t-2 pt-2 px-4 inline-flex items-center text-sm font-medium', 
              page.active && 'border-lavender/80 text-lavender',
              !page.active && 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
            )}
            aria-current={page.active ? 'page' : undefined}
          >
            {page.number}
          </Link>
        )
      })}
      {showNextPrev && (
        <div className="-mt-px w-0 flex-1 flex justify-end">
          {!nextUrl && (
            <span className='border-t-2 border-transparent pt-2 pl-1 inline-flex items-center text-sm font-medium text-zinc-300'>
              Next
              <ArrowNarrowRightIcon className="ml-3 h-5 w-5" />
            </span>
          )}
          {nextUrl && <Link to={nextUrl} className="border-t-2 border-transparent pt-2 pl-1 inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700 hover:border-zinc-300">
            Next
            <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-zinc-400" />
          </Link>}
        </div>
      )}
    </>
  );
};
