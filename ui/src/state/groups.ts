import { GroupUpdateInitial, MetadataUpdateInitial } from "@urbit/api";
import { useQuery, useQueryClient } from "react-query"
import api from "../api"
import { PostOption } from "../types/sphinx";



export const useGroups = (): PostOption[] => {
  const { data } = useQuery('metadata', () => api.subscribeOnce<{ 'metadata-update': MetadataUpdateInitial }>('metadata-store', '/all'));
  const { data: groupData } = useQuery('groups', () => api.subscribeOnce<{ groupUpdate: GroupUpdateInitial }>('group-store', '/groups'));

  //web+urbitgraph://group/~nocsyx-lassul/celestial-systems
  console.log(data, groupData)

  return data && groupData ? Object.entries(data['metadata-update'].associations)
    .filter(([k,v]) => v['app-name'] === 'groups' && 'open' in (groupData.groupUpdate.initial[v.resource]?.policy || {})) 
    .map(([k,v]) => ({ key: k, post: {
      type: 'group',
      title: v.metadata.title,
      link: v.group.replace('/ship/', 'web+urbitgraph://group/'),
      image: v.metadata.picture,
      description: v.metadata.description,
      tags: ['group']
    }})) : [];
}