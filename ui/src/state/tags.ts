import { useMemo } from "react";
import { useQuery } from "react-query";
import api from "../api";
import { Tags } from "../types/sphinx";

export const useTags = () => {
  const { data } = useQuery('tags', () => api.scry<Tags>({
    app: 'sphinx',
    path: '/tags'
  }));
  
  return useMemo(() => data ? Object.entries(data).sort(([tagA, a], [tagB, b]) => {
    if (a === b) {
      return tagA.localeCompare(tagB);
    }

    return b - a
  }) 
  : [], [data]);
}