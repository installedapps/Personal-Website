# Personal Website

A responsive four-page portfolio built with Astro and vanilla CSS.

## Local development

```sh
pnpm install
pnpm dev
```

Run tests with `pnpm test` and create the static build with `pnpm build`.

## GitHub Pages

Push to `main`, then select **GitHub Actions** as the Pages source in the repository settings. The included workflow tests, builds, and deploys the site with the repository name as its base path.

## Updating your content

- **Articles:** add a `.md` file to `src/pages/posts/`. Copy an existing post, update its frontmatter, then write the article below the second `---` using Markdown. The filename becomes its URL and the Posts page updates automatically.
- **Projects:** edit the `projects` array in `src/data/site.ts`. Each entry supports a title, type, description, repository URL, and technology label.
- **Contact details:** edit the `contact` object at the top of `src/data/site.ts`. Replace the placeholder email and LinkedIn URL before publishing.
- **About text:** edit `src/pages/about.astro` if you want to change the biography itself.
