# James & Alysha

React + Vite + TypeScript wedding website for James and Alysha.

The site includes Home, Schedule, Travel & Stay, RSVP, and Registry pages. Editable copy and image references live in JSON files so they can be managed through Pages CMS.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm preview
```

## Content

Editable content is stored in `src/content`:

```text
src/content/site.json
src/content/home.json
src/content/schedule.json
src/content/travel.json
src/content/rsvp.json
src/content/registry.json
```

TypeScript content types and lightweight runtime validation are kept in:

```text
src/content/types.ts
src/content/schemas.ts
src/content/index.ts
```

## Images

CMS-editable images are stored in:

```text
public/uploads
```

JSON image fields should reference them with root-relative paths, for example:

```json
"/uploads/engagement-01.png"
```

The Our Story gallery is configured in `src/content/home.json` under `story.images`.

## Pages CMS

Pages CMS is configured in:

```text
.pages.yml
```

The CMS media folder is configured as:

```text
input: public/uploads
output: /uploads
```

## Routing

The app uses clean client-side URLs:

```text
/
/schedule
/travel
/rsvp
/registry
```

Static hosting must rewrite these routes to `index.html`. This repo includes:

```text
public/_redirects
vercel.json
```

`public/_redirects` is copied into `dist` during `pnpm build`.

## SEO

Base metadata is defined in `index.html`.

Per-page title, description, canonical URL, Open Graph, and Twitter metadata are updated in:

```text
src/app/metadata.ts
```

## Structure

```text
src/app         App shell, metadata, navigation
src/components  Shared UI components
src/content     JSON content, types, validation
src/hooks       Shared hooks
src/pages       Page components
src/styles      Split CSS files
```

## RSVP

The RSVP form currently validates required fields on the client. It is ready to be wired to an email/form service when the destination email is available.
