import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../markdown-renderer';

describe('Markdown Renderer', () => {
  it('should render markdown to HTML', () => {
    const markdown = '# Hello\n\nThis is a test.';
    const html = renderMarkdown(markdown);

    expect(html).toContain('<h1');
    expect(html).toContain('Hello');
    expect(html).toContain('<p>');
    expect(html).toContain('This is a test');
  });

  it('should handle code blocks', () => {
    const markdown = '```python\nprint("hello")\n```';
    const html = renderMarkdown(markdown);

    expect(html).toContain('print(&quot;hello&quot;)');
  });
});
