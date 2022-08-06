import { Association, BigIntOrderedMap, buntPost, Content, getGraph, getKeys, Graph, GraphNode, MetadataConfig, Post, resourceFromPath, TextContent, UrlContent } from "@urbit/api";
import bigInt, { BigInteger } from "big-integer";
import removeMd from 'remove-markdown-and-html';
import _ from "lodash";
import { useQuery } from "react-query"
import api from "../api"
import { PostType, Search } from "../types/sphinx";
import { MetaDataUpdate, usePublicGroups } from "./groups";

interface Resource {
  ship: string;
  name: string;
}

interface GraphKeyUpdate {
  'graph-update': {
    keys: Resource[]
  }
}

export const useNotebooks = () => {
  const { data: keys, isLoading: keysLoading } = useQuery('graph-keys', async () => {
    const json = await api.scry<GraphKeyUpdate>(getKeys())
    const update = _.get(json, 'graph-update', false);
    const data: Resource[] = _.get(update, 'keys', false) || [];

    return new Set(data.map((res) => {
      const resource = res.ship + '/' + res.name;
      return resource;
    }));
  });
  const { data, isLoading: metadataLoading } = useQuery('metadata', () => api.subscribeOnce<MetaDataUpdate>('metadata-store', '/all'));
  const { groups, loading } = usePublicGroups(data || {} as MetaDataUpdate);

  const notebooks: Record<string, Association<MetadataConfig>> = _.fromPairs(!data || loading ? [] : Object.entries(data['metadata-update'].associations)
    .filter(([,v]) => v['app-name'] === 'graph' 
      && 'graph' in v.metadata.config 
      && v.metadata.config.graph === 'publish'
      && keys?.has(v.resource.replace('/ship/~', ''))
      && groups.find(([, gv]) => gv.group === v.group)
    ).map(([,v]) => [v.resource.replace('/ship/', ''), v]));

  return {
    loading: metadataLoading || loading,
    notebooks, 
    groups
  }
}

export const usePosts = (ship: string, name: string, type: PostType, tags: string[]) => {
  const { notebooks, loading } = useNotebooks();
  const association = notebooks[`${ship}/${name}`] || {};
  const { data, isLoading } = useQuery(`graph-${association?.resource}`, () => api.scry<Graph>(getGraph(ship, name)), {
    enabled: !!association?.resource
  });
  const { data: d, isLoading: postsLoading } = useQuery('post-listings', () => api.scry<Search>({
    app: 'sphinx',
    path: '/lookup/tag/0/999/~~post'
  }));
  const graph = addGraph(data);
  const items = data && graph ? Array.from(graph)
  .filter(([, node]) => node && typeof node?.post !== 'string')
  .map(([date, node]) => {
    const index = node.post.index.split('/');
    const noteId = bigInt(index[1]);
    const { title, body } = getLatestRevision(node);
    const snippet = getSnippet(body);
    const permalink = getPermalinkForGraph(
      association.group,
      association.resource,
      `/${noteId.toString()}`
    );

    return { key: date.toString(), post: {
      type,
      title,
      link: permalink,
      image: snippet.image,
      color: '',
      description: snippet.content,
      tags
    }}
  }) : [];

  const posts =  items.filter(p => !d || d.listings.length === 0 || !d.listings.find(l => l.post.link === p.post.link));

  return {
    notebook: association,
    loading: loading || isLoading || postsLoading,
    posts
  }
}

function getImage(snippet: string) {
  const pattern = /!\[.*\]\((.*)\)/
  const match = snippet.match(pattern);

  if (!match) {
    return '';
  }

  return match[1];  
}

function getLatestRevision(node: GraphNode): { id: number, title: string, body: Content[], post: Post } {
  const empty = { id: 1, title: '', body: [], post: buntPost() };
  const revs = node.children?.get(bigInt(1));
  if (!revs || revs.children === null) {
    return empty;
  }

  const [revNum, rev] = [...revs.children][0];
  const title = rev.post.contents[0] as TextContent;
  const body = rev.post.contents.slice(1);
  return {
    id: revNum.toJSNumber(), 
    title: title.text, 
    body, 
    post: rev.post
  };
}

export function getSnippet(body: Content[]): { image: string, content: string } {
  const IMAGE_REGEX = new RegExp(
    /(\.jpg|\.img|\.png|\.gif|\.tiff|\.jpeg|\.webp|\.webm|\.svg)$/i
  );

  let sum = 0;
  const firstContent = body.reduce((text, c) => {
    if ('text' in c && sum < 255) {
      sum += removeMd(c.text).length;
      return text + c.text + ' ';
    }

    return text;
  }, '');
  const image = body.filter((c: Content): c is UrlContent => 'url' in c && IMAGE_REGEX.test(c.url)).map(c => c.url)[0] || '';
  const content = removeMd(firstContent.replace(/!\[.*\]\((.*)\)\s*/g, ''));
  const end = content.length > 256 ? 255 : content.length;
  const start = content.substring(0, end);

  return {
    content: start === firstContent ? start : `${start}...`,
    image: getImage(firstContent) || image
  }
}

export function getPermalinkForGraph(
  group: string,
  graph: string,
  index = ''
) {
  const groupLink = getPermalinkForAssociatedGroup(group);
  const { ship, name } = resourceFromPath(graph);
  return `${groupLink}/graph/${ship}/${name}${index}`;
}

function getPermalinkForAssociatedGroup(group: string) {
  const { ship, name } = resourceFromPath(group);
  return `web+urbitgraph://group/${ship}/${name}`;
}

const addGraph = (json: any): Graph => {
  const update = _.get(json, 'graph-update', false);
  const data = _.get(update, 'add-graph', false);
  let graph = new BigIntOrderedMap<GraphNode>();
  const items: [BigInteger, GraphNode][] = data.graph ? Object.entries(data.graph as any).map(([idx, value]) => [bigInt(idx), processNode(value as GraphNode)]) : [];
  
  if (data) {
    graph = graph.gas(items);
  }

  return graph;
};

const processNode = (node: GraphNode): GraphNode => {
  const empty = new BigIntOrderedMap<GraphNode>();
  const items = _.map<GraphNode, [BigInteger, GraphNode]>((node.children || {}) as any, (item: GraphNode, idx: number) => {
    return [bigInt(idx), processNode(item)]
  })

  const newNode = {
    ...node,
    children: !node.children ? empty : empty.gas(items)
  };
  
  return newNode;
};
