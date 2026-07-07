import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

describe('site structure', () => {
  it.each(['index', 'about', 'posts', 'projects'])('provides the %s page', (page) => {
    expect(() => read(`src/pages/${page}.astro`)).not.toThrow();
  });

  it('exposes all four destinations in the shared navigation', () => {
    const navigation = read('src/components/Header.astro');
    expect(navigation).toMatch(/href={withBase\(["']\/["']\)}/);
    expect(navigation).toMatch(/href={withBase\(["']\/about\/["']\)}/);
    expect(navigation).toMatch(/href={withBase\(["']\/posts\/["']\)}/);
    expect(navigation).toMatch(/href={withBase\(["']\/projects\/["']\)}/);
  });

  it('uses one shared layout on every page', () => {
    for (const page of ['index', 'about', 'posts', 'projects']) {
      expect(read(`src/pages/${page}.astro`)).toContain('<BaseLayout');
    }
  });
});

describe('interaction and presentation', () => {
  it('provides an accessible scroll progress indicator', () => {
    const layout = read('src/layouts/BaseLayout.astro');
    expect(layout).toContain('role="progressbar"');
    expect(layout).toContain('aria-label="Page scroll progress"');
    expect(layout).toContain("document.documentElement.scrollHeight");
    expect(layout).toContain("style.transform = `scaleX(${progress})`");
  });

  it('does not render the decorative astronaut', () => {
    const layout = read('src/layouts/BaseLayout.astro');
    expect(layout).not.toContain('Astronaut');
  });

  it('uses solid, high-contrast styling for emphasized title text', () => {
    const styles = read('src/styles/global.css');
    expect(styles).toMatch(/\.outline\s*{[^}]*color:\s*var\(--blue-bright\)/s);
    expect(styles).not.toContain('color: transparent');
  });

  it('has responsive navigation and reduced-motion support', () => {
    const styles = read('src/styles/global.css');
    expect(styles).toMatch(/@media\s*\(max-width:\s*700px\)/);
    expect(styles).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });

  it('configures a static GitHub Pages-compatible build', () => {
    const config = read('astro.config.mjs');
    expect(config).toContain("output: 'static'");
    expect(config).toContain("process.env.BASE_PATH");
  });

  it('stores editable projects and contact details in a data file', () => {
    const site = read('src/data/site.ts');
    expect(site).toContain('export const contact');
    expect(site).toContain('Itenirarium');
    expect(site).toContain('Job Tracker');
  });

  it('structures articles as Markdown pages with reusable frontmatter', () => {
    const filenames = readdirSync(resolve(root, 'src/pages/posts')).filter((name) => name.endsWith('.md'));
    expect(filenames.length).toBeGreaterThan(0);
    const post = read(`src/pages/posts/${filenames[0]}`);
    expect(post).toContain('layout: ../../layouts/BlogPost.astro');
    expect(post).toContain('title:');
    expect(post).toContain('pubDate:');
    expect(post).toContain('tags:');
  });

  it('automatically builds the post archive from Markdown files', () => {
    const archive = read('src/pages/posts.astro');
    expect(archive).toMatch(/import\.meta\.glob<PostModule>\(["']\.\/posts\/\*\.md["']/);
    expect(archive).toContain('Object.values(modules).sort');
  });

  it('offers the public résumé for download from Home and About', () => {
    expect(() => read('public/resume.pdf')).not.toThrow();
    for (const page of ['index', 'about']) {
      const source = read(`src/pages/${page}.astro`);
      expect(source).toContain('resume.pdf');
      expect(source).toContain('download="Artur-Gamrat-Resume.pdf"');
    }
  });
});
