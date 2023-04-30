import { useQuery } from "@tanstack/react-query"
import api from "../api"
import { PostType, Search } from "../types/sphinx";
import { ChannelPreview, Groups } from "../types";
import { useMemo } from "react";
import { GROUPS_KEY, GROUP_LISTINGS_KEY } from "../keys";
import { getColor, getImage, isColor } from "../utils";

export const usePublicGroups = () => {
  const { data, ...query } = useQuery(GROUPS_KEY, 
    () => api.scry<Groups>({
      app: 'groups',
      path: '/groups/light'
    }),
    { initialData: {} }
  );

  const groups = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).filter(([,v]) => !v.secret);
  }, [data]);

  return {
    ...query,
    groups
  }
}

export const useGroups = () => {
  const { groups, isLoading: loading } = usePublicGroups();
  const { data: d, isLoading } = useQuery(GROUP_LISTINGS_KEY, () => api.scry<Search>({
    app: 'sphinx',
    path: '/lookup/group/0/999'
  }));

  return {
    loading: loading || isLoading,
    groups: groups.map(([k,v]) => ({ key: k, post: {
      type: 'group' as PostType,
      title: v.meta.title,
      link: `/1/group/${k}`, //`/apps/groups/groups/${k}`,
      image: getImage(v.meta.image) || getImage(v.meta.cover) || '',
      color: getColor(v.meta.image) || getColor(v.meta.cover) || '',
      description: v.meta.description,
      tags: ['group']
    }}))
    .filter(({ post }) => !d || d.listings.length === 0 || !d.listings.some(l => l.post.link === post.link || l.post.title === post.title))
  }
}

export function useChannelPreview(nest: string): ChannelPreview | undefined {
  const { groups } = usePublicGroups();
  const group = groups.find(([,g]) => {
    return !!g.channels[nest];
  });

  const { data } = useQuery(['channel-preview', nest],
    () => api.subscribeOnce<ChannelPreview>('groups', `/chan/${nest}`, 5000),
    {
      enabled: groups && !!nest && !group,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  return group ? {
    nest,
    meta: group[1].channels[nest].meta,
    group: {
      flag: group[0],
      meta: group[1].meta,
      secret: group[1].secret
    }
  } : data;
}
