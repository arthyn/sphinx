import { stringToTa } from "@urbit/api";

export function encodeLookup(value: string | undefined) {
  if (!value) {
    return '';
  }

  return stringToTa(value).replace('~.', '~~');
}