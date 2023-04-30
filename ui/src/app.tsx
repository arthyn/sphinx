import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CenterColumn } from './components/CenterColumn';
import { Layout } from './components/Layout';
import { AllListings } from './manage-listings/AllListings';
import { Apps } from './manage-listings/Apps';
import { Groups } from './manage-listings/Groups';
import { MyListings } from './manage-listings/MyListings';
import { Notebooks } from './manage-listings/Notebooks';
import { Post } from './manage-listings/Post';
import { Search } from './pages/Search';
import { Tag } from './pages/Tag';

const queryClient = new QueryClient();

function Main() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<CenterColumn />}>
          <Route path="/" element={<Search />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search/:lookup" element={<Search />} />
          <Route path="/search/:lookup/:limit/:page" element={<Search />} />
          <Route path="/tags" element={<Tag />} />
          <Route path="/tags/:tag" element={<Tag />} />
          <Route path="/tags/:tag/:limit/:page" element={<Tag />} />
        </Route>
        <Route path="/manage-listings">
          <Route element={<CenterColumn />}>
            <Route index element={<MyListings />} />
            <Route path="all" element={<AllListings />} />
            <Route path="all/:limit/:page" element={<AllListings />} />
            <Route path="post" element={<Post />} />
            <Route path="apps" element={<Apps />} />
            <Route path="groups" element={<Groups />} />
          </Route>
          <Route path="posts" element={<Notebooks />} />
          <Route path="posts/:ship/:name" element={<Notebooks />} />
        </Route>
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename='/apps/sphinx'>
        <Main />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
