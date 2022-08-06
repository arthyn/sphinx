import React from 'react';
import { Outlet } from 'react-router-dom';

export const CenterColumn = () => (
  <div className="flex-1 flex flex-col max-w-2xl h-full w-full p-4 sm:py-12 sm:px-8 space-y-6">{<Outlet />}</div>
) 