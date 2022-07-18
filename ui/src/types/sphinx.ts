export type PostType = 'app' | 'group' | 'content' | 'other';

export type PostFilter = 'all' | PostType;

export interface Declare {
  reach: 'friends' | 'public' | 'private';
  post: Post
}

export type Remove = string;

export interface Post {
  title: string;
  type: PostType;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

export interface Listing {
  post: Post;
  hash: string;
  source: string;
  time: number;
}

export type Search = {
  listings: Listing[];
  start: number;
  limit: number;
  size: number;
  total: number;
}

export interface Directory {
  [hash: string]: Listing;
}

export interface PostOption {
  post: Post;
  key: string;
}

export interface PostOptionsForm {
  options: string[];
}