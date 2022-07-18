import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Apps } from './manage-listings/Apps';
import { Groups } from './manage-listings/Groups';
import { MyListings } from './manage-listings/MyListings';
import { Post } from './manage-listings/Post';
import { Search } from './pages/Search';

const queryClient = new QueryClient();

function Main() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Search />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:lookup" element={<Search />} />
        <Route path="/search/:lookup/:limit/:page" element={<Search />} />
        <Route path="/manage-listings">
          <Route index element={<MyListings />} />
          <Route path="post" element={<Post />} />
          <Route path="apps" element={<Apps />} />
          <Route path="groups" element={<Groups />} />
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
