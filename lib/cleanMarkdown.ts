import removeMarkdown from 'remove-markdown';

const NAVIGATION_PHRASES = [
  'Skip to content',
  'Quick Links',
  'Search',
  'Share this:',
  'Read more',
];

export function cleanMarkdown(text: string): string {
  let cleaned = text.replace(/<[^>]*>/g, '');
  // Preserve markdown links by converting `[text](url)` to `text (url)`
  cleaned = cleaned.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');
  cleaned = removeMarkdown(cleaned);

  const lines = cleaned.split(/\r?\n/);
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    return !NAVIGATION_PHRASES.some((phrase) =>
      trimmed.toLowerCase().includes(phrase.toLowerCase())
    );
  });

  return filtered.join('\n');
}

export default cleanMarkdown;