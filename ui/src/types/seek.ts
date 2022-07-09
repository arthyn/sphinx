export interface Post {
  title: string;
  type: 'app' | 'group' | 'content' | 'other';
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