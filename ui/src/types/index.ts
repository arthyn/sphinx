export interface GroupMeta {
  title: string;
  description: string;
  image: string;
  cover: string;
}

export interface Vessel {
  sects: string[];
  joined: number;
}

export interface Fleet {
  [ship: string]: Vessel;
}

export interface GroupChannel {
  meta: GroupMeta;
  readers: string[];
}

export interface Channels {
  [nest: string]: GroupChannel;
}

export interface Group {
  fleet: Fleet;
  channels: Channels;
  meta: GroupMeta;
  secret: boolean;
}

export interface Groups {
  [flag: string]: Group;
}

export interface GroupPreview {
  flag: string;
  meta: GroupMeta;
  time?: number;
  secret: boolean;
}

export interface ChannelPreview {
  nest: string;
  meta: GroupMeta;
  group: GroupPreview;
}

export interface Ship {
  ship: string;
}

export interface Italics {
  italics: Inline[];
}

export interface Bold {
  bold: Inline[];
}

export interface Strikethrough {
  strike: Inline[];
}

export interface Break {
  break: null;
}

export interface InlineCode {
  'inline-code': string;
}

export interface BlockCode {
  code: string;
}

export interface Blockquote {
  blockquote: Inline[];
}

/**
 A reference to the accompanying blocks, indexed at 0
*/
export interface BlockReference {
  block: {
    index: number;
    text: string;
  };
}

export interface Tag {
  tag: string;
}

export interface Link {
  link: {
    href: string;
    content: string;
  };
}

export type Inline =
  | string
  | Bold
  | Italics
  | Strikethrough
  | Ship
  | Break
  | InlineCode
  | BlockCode
  | Blockquote
  | BlockReference
  | Tag
  | Link;

export type InlineKey =
  | 'italics'
  | 'bold'
  | 'strike'
  | 'blockquote'
  | 'inline-code'
  | 'block'
  | 'code'
  | 'tag'
  | 'link'
  | 'break';

export function isBold(item: unknown): item is Bold {
  return typeof item === 'object' && item !== null && 'bold' in item;
}

export function isItalics(item: unknown): item is Italics {
  return typeof item === 'object' && item !== null && 'italics' in item;
}

export function isLink(item: unknown): item is Link {
  return typeof item === 'object' && item !== null && 'link' in item;
}

export function isStrikethrough(item: unknown): item is Strikethrough {
  return typeof item === 'object' && item !== null && 'strike' in item;
}

export function isBlockquote(item: unknown): item is Blockquote {
  return typeof item === 'object' && item !== null && 'blockquote' in item;
}

export function isInlineCode(item: unknown): item is InlineCode {
  return typeof item === 'object' && item !== null && 'inline-code' in item;
}

export function isBlockCode(item: unknown): item is BlockCode {
  return typeof item === 'object' && item !== null && 'code' in item;
}

export function isBreak(item: unknown): item is Break {
  return typeof item === 'object' && item !== null && 'break' in item;
}

export function isShip(item: unknown): item is Ship {
  return typeof item === 'object' && item !== null && 'ship' in item;
}

export function inlineToString(inline: Inline): any {
  if (typeof inline === 'string') {
    return inline;
  }

  if (isBold(inline)) {
    return inline.bold.map((i: Inline) => inlineToString(i)).join(' ');
  }

  if (isItalics(inline)) {
    return inline.italics.map((i: Inline) => inlineToString(i));
  }

  if (isStrikethrough(inline)) {
    return inline.strike.map((i: Inline) => inlineToString(i));
  }

  if (isLink(inline)) {
    return inline.link.content;
  }

  if (isBlockquote(inline)) {
    return Array.isArray(inline.blockquote)
      ? inline.blockquote.map((i) => inlineToString(i)).join(' ')
      : inline.blockquote;
  }

  if (isInlineCode(inline)) {
    return typeof inline['inline-code'] === 'object'
      ? inlineToString(inline['inline-code'])
      : inline['inline-code'];
  }

  if (isShip(inline)) {
    return inline.ship;
  }

  return '';
}

export interface VerseInline {
  inlines: Inline[];
}

export interface VerseBlock {
  block: any;
} 

export type Verse = VerseInline | VerseBlock;

export type NoteContent = Verse[];

export interface NoteEssay {
  title: string;
  image: string;
  content: NoteContent;
  author: string;
  sent: number;
}

export interface DiaryOutline extends NoteEssay {
  type: 'outline';
  quipCount: number;
  quippers: string[];
}

export interface DiaryOutlines {
  [time: string]: DiaryOutline;
}

export interface DiaryPerm {
  writers: string[];
  group: string;
}

export interface Diary {
  perms: DiaryPerm;
}

export interface Shelf {
  [key: string]: Diary;
}