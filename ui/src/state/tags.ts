import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { Tags } from "../types/sphinx";
import { TAGS_KEY } from "../keys";

export const useTags = () => {
  const { data } = useQuery(TAGS_KEY, () => api.scry<Tags>({
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