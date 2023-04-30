import { stringToTa, uxToHex } from "@urbit/api";
import { parseToRgba } from "color2k";

export function encodeLookup(value: string | undefined) {
  if (!value) {
    return '';
  }

  return stringToTa(value).replace('~.', '~~');
}

export function isColor(color: string): boolean {
  try {
    parseToRgba(color);
    return true;
  } catch (error) {
    return false;
  }
}

export function getColor(image: string): string | undefined {
  return isColor(image) ? image : undefined;
}

export function getImage(image: string): string | undefined {
  return isColor(image) ? undefined : image;
}

export function normalizeColor(color: string): string {
  if (color.startsWith('#')) {
    return color;
  }

  return `#${uxToHex(color)}`
} 

export function normalizeLink(link: string): string {
  // ref or URL format
  if (!link.startsWith('web+urbitgraph://') || link.startsWith('http')) {
    return link;
  }

  // old format
  const normLink = link.replace('web+urbitgraph://', '');
  const parts = normLink.split('/');
  const first = parts[0];

  if (first !== 'group') {
    return `/1/desk/${normLink}`;
  }

  if (parts.length === 3) {
    return `/1/group/${parts[1]}/${parts[2]}`;
  }

  return `/1/chan/diary/${parts[4]}/${parts[5]}/note/${parts[6]}`
}

export function refToURL(cite: string): string | { nest: string, where: string } {
  const parts = cite.slice(1).split('/');
  if (parts[0] !== '1') {
    return '';
  }

  const type = parts[1];
  if (type === 'desk') {
    const ship = parts[2];
    const desk = parts[3];
    return `/apps/grid/search/${ship}/apps/${ship}/${desk}`;
  }

  if (type === 'group') {
    const ship = parts[2];
    const name = parts[3];
    return `/apps/groups/find/${ship}/${name}`;
  }

  const chanType = parts[2];
  const ship = parts[3];
  const name = parts[4];
  return {
    nest: `${chanType}/${ship}/${name}`,
    where: parts.slice(5).join('/'),
  }
}
