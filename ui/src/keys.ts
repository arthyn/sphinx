import { QueryKey } from "@tanstack/react-query";

export const GROUPS_KEY: QueryKey = ['groups'];
export const VATS_KEY: QueryKey = ['vats'];
export const PALS_KEY: QueryKey = ['pals'];
export const TAGS_KEY: QueryKey = ['tags'];
export const CHARGES_KEY: QueryKey = ['charges'];
export const APP_LISTINGS_KEY: QueryKey = ['app-listings'];
export const GROUP_LISTINGS_KEY: QueryKey = ['group-listings'];
export const POST_LISTINGS_KEY: QueryKey = ['post-listings'];
export const PUBLISHED_KEY: QueryKey = ['published'];
export const notesKey = (diary?: string): QueryKey => diary ? ['notes', diary] : ['notes'];
export const tagKey = (tag?: string) => (start: number, size: number): QueryKey => ['tag', tag || '', size, start];
export const lookupKey = (selected: string, lookup: string | undefined) => (start: number, size: number): QueryKey => ['lookup', selected, size.toString(), start.toString(), lookup || ''];