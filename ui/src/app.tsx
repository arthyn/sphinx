import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Post } from './pages/Post';
import { Search } from './pages/Search';

const queryClient = new QueryClient();

function Main() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Search />} />
        <Route path="/search/:lookup" element={<Search />} />
        <Route path="/search/:lookup/:limit/:page" element={<Search />} />
        <Route path="/post" element={<Post />} />
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
