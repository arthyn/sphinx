import { Associations, GroupUpdateInitial, MetadataUpdateInitial } from "@urbit/api";
import { useQuery } from "react-query"
import api from "../api"
import { PostOption, PostType, Search } from "../types/sphinx";

export type MetaDataUpdate = { 'metadata-update': MetadataUpdateInitial };

export const usePublicGroups = (metadata?: { 'metadata-update': MetadataUpdateInitial }) => {
  const { data, isLoading } = useQuery('metadata', () => api.subscribeOnce<MetaDataUpdate>('metadata-store', '/all'), {
    enabled: !metadata
  });
  const { data: groupData, isLoading: groupDataLoading } = useQuery('groups', () => api.subscribeOnce<{ groupUpdate: GroupUpdateInitial }>('group-store', '/groups'));

  return {
    loading: isLoading || groupDataLoading,
    groups: !data || !groupData ? [] : Object.entries(data['metadata-update'].associations)
    .filter(([k,v]) => v['app-name'] === 'groups' && 'open' in (groupData.groupUpdate.initial[v.resource]?.policy || {}))
  }
}

export const useGroups = () => {
  const { groups, loading } = usePublicGroups();
  const { data: d, isLoading } = useQuery('group-listings', () => api.scry<Search>({
    app: 'sphinx',
    path: '/lookup/group/0/999'
  }));

  return {
    loading: loading || isLoading,
    groups: groups.map(([k,v]) => ({ key: k, post: {
      type: 'group' as PostType,
      title: v.metadata.title,
      link: v.group.replace('/ship/', 'web+urbitgraph://group/'),
      image: v.metadata.picture,
      color: v.metadata.color,
      description: v.metadata.description,
      tags: ['group']
    }}))
    .filter(({ post }) => !d || d.listings.length === 0 || !d.listings.some(l => l.post.link === post.link || l.post.title === post.title))
  }
}