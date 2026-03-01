import { marked } from 'marked';

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, {
    gfm: true,
    breaks: false,
  }) as string;
}
