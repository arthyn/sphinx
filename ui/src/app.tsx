import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Search } from './pages/Search';

const queryClient = new QueryClient();

function Main() {
  return (
    <Routes>
      <Route path="/" element={<Search />} />
      <Route path="/:lookup" element={<Search />} />
      <Route path="/:lookup/:limit/:page" element={<Search />} />
    </Routes>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename='/apps/seek'>
        <Main />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
