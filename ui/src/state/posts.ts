import _ from "lodash";
import { useQuery } from "@tanstack/react-query"
import api from "../api"
import { PostType, Search } from "../types/sphinx";
import { usePublicGroups } from "./groups";
import { POST_LISTINGS_KEY, notesKey } from "../keys";
import { Diary, DiaryOutlines, GroupChannel, NoteContent, Shelf, VerseInline, inlineToString } from "../types";
import { useMemo } from "react";
import { udToDec } from '@urbit/api';

export const useNotebooks = () => {
  const { groups, isLoading: groupsLoading } = usePublicGroups();
  const { data, isLoading } = useQuery(notesKey(), () => api.scry<Shelf>({
    app: 'diary',
    path: '/shelf'
  }));
  
  const notebooks = useMemo(() => {
    const nbs: Record<string, GroupChannel & Diary> = {};
    debugger;
    if (!data) return nbs;

    Object.entries(data).forEach(([k,v]) => {
      const group = groups.find(([g]) => g === v.perms.group);
      if (!group) return;

      debugger;
      const channel = group[1].channels[`diary/${k}`];
      if (!channel) return;

      if (channel.readers.length === 0) {
        nbs[k] = { ...v, ...channel };
      }
    });

    return nbs;
  }, [data, groups]);

  return {
    notebooks,
    groups,
    loading: isLoading || groupsLoading
  }
}

export const usePosts = (ship: string, name: string, type: PostType, tags: string[]) => {
  const flag = `${ship}/${name}`;
  const { notebooks, loading } = useNotebooks();
  const { data, isLoading } = useQuery(notesKey(flag), () => api.scry<DiaryOutlines>({
    app: 'diary',
    path: `/diary/${flag}/notes/newest/9.999.999/outline`
  }));
  const { data: d, isLoading: postsLoading } = useQuery(POST_LISTINGS_KEY, () => api.scry<Search>({
    app: 'sphinx',
    path: '/lookup/tag/0/9.999/~~post'
  }));
  
  const items = data ? Object.entries(data)
  .map(([date, outline]) => {
    return { key: date.toString(), post: {
      type,
      title: outline.title,
      link: getPermalink(flag, date),
      image: outline.image,
      color: '',
      description: getSnippet(outline.content),
      tags
    }}
  }) : [];

  const posts =  items.filter(p => !d || d.listings.length === 0 || !d.listings.find(l => l.post.link === p.post.link));

  return {
    notebook: notebooks[flag],
    loading: loading || isLoading || postsLoading,
    posts
  }
}

function getPermalink(flag: string, time: string): string {
  return `/1/chan/diary/${flag}/note/${udToDec(time)}`;
}

function getSnippet(content: NoteContent): string {
  const inlines = content.filter(c => 'inlines' in c) as VerseInline[];
  if (inlines.length === 0) return '';

  const text = inlines[0].inlines.map(inlineToString).join(' ');
  const end = text.length > 256 ? 253 : text.length;
  let start = text.substring(0, end);
  const length = new Blob([start]).size;
  if (length > end) {
    start = start.substring(0, end - (length - end))
  }
  
  return start === text ? start : `${start}...`;
}
