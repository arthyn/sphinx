interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
  /* Add custom env properties here */
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'remove-markdown-and-html' {
  export default function removeMd(input: string): string;
}