import { useCallback } from "react";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { Search } from "../types/sphinx";

interface UseSearchParams {
  key: (start: number, size: number) => QueryKey;
  fetcher: (start: number, size: number) => Promise<Search>;
  enabled: boolean;
  linkPrefix: string;
  limit?: string;
  page?: string;
}

export const useSearch = ({ key, fetcher, enabled, limit, page, linkPrefix }: UseSearchParams) => {
  const size = parseInt(limit || '10', 10);
  const pageInt = parseInt(page || '1', 10) - 1;
  const start = pageInt * size;
  
  const { data, ...query } = useQuery<Search>(key(start, size), () => fetcher(start, size), {
    enabled,
    keepPreviousData: true
  });

  const total = data?.total || 0;
	const pages =
		total % size === 0
			? total / size
			: Math.floor(total / size) + 1;

  const linkBuild = useCallback((page) => {
    if (!page) {
      return null;
    }
    
    return `${linkPrefix}/${size}/${page || 1}`
  }, [linkPrefix, size]);

  return {
    results: data || {
      listings: []
    },
    ...query,
    size,
    pageInt,
    start,
    pages,
    linkBuild
  }
}