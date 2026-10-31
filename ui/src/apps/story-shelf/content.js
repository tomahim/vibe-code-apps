import manifest from './manifest.json';
const files = import.meta.glob('./books/*.md', { query: '?raw', import: 'default', eager: true });
export function parsePages(markdown) {
  return markdown.trim().split(/\n---page---\n/).map((chunk) => {
    const [heading, ...lines] = chunk.trim().split('\n');
    const body = lines.join('\n').trim();
    const note = body.match(/\n\n> (.+)$/)?.[1] || '';
    return { title: heading.replace(/^# /, ''), paragraphs: body.replace(/\n\n> .+$/, '').split('\n\n'), note };
  });
}
const images = import.meta.glob('./images/*.webp', { eager: true, import: 'default' });
export const books = manifest.map(book => ({ ...book, pages: parsePages(files[`./books/${book.slug}.md`]), cover: images[`./images/${book.art}-0.webp`] }));
export const categories = ['History', 'Nature', 'Mountains'];
export function illustration(book, page) { return images[`./images/${book.art}-${page + 1}.webp`]; }
