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
"/uploads/hero-wedding.png"
```

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

The RSVP and contact forms validate required fields on the client and submit through EmailJS.

EmailJS configuration is read from Vite environment variables. Use `.env.example` as the template for local setup:

```text
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_CONTACT_TEMPLATE_ID=
VITE_EMAILJS_RSVP_TEMPLATE_ID=
```

The RSVP destination email is configured in `src/content/rsvp.json` under `form.recipientEmail`. Contact form destination emails are passed from the page content that opens the contact modal.
