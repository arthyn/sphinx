import { GroupUpdateInitial, MetadataUpdateInitial } from "@urbit/api";
import { useQuery } from "react-query"
import api from "../api"
import { PostOption, PostType, Search } from "../types/sphinx";



export const useGroups = () => {
  const { data, isLoading: metadataLoading } = useQuery('metadata', () => api.subscribeOnce<{ 'metadata-update': MetadataUpdateInitial }>('metadata-store', '/all'));
  const { data: groupData, isLoading: groupDataLoading } = useQuery('groups', () => api.subscribeOnce<{ groupUpdate: GroupUpdateInitial }>('group-store', '/groups'));
  const { data: d, isLoading } = useQuery('group-listings', () => api.scry<Search>({
    app: 'sphinx',
    path: '/lookup/group/0/999'
  }));

  return {
    loading: metadataLoading || groupDataLoading || isLoading,
    groups: !data || !groupData || !d ? [] : Object.entries(data['metadata-update'].associations)
    .filter(([k,v]) => v['app-name'] === 'groups' && 'open' in (groupData.groupUpdate.initial[v.resource]?.policy || {})) 
    .map(([k,v]) => ({ key: k, post: {
      type: 'group' as PostType,
      title: v.metadata.title,
      link: v.group.replace('/ship/', 'web+urbitgraph://group/'),
      image: v.metadata.picture,
      color: v.metadata.color,
      description: v.metadata.description,
      tags: ['group']
    }}))
    .filter(({ post }) => !d.listings.some(l => l.post.link === post.link || l.post.title === post.title))
  }
}