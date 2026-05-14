import { home, registry, rsvp, schedule, site, travel } from '../content'
import type { PageId } from '../types'
import { getPathForPage } from './navigation'

type PageMetadata = {
  title: string
  description: string
  image: string
}

const pageMetadata = {
  home: {
    title: `${site.coupleName} | Wedding in Crete`,
    description: `${home.hero.date} in ${home.hero.location}. Wedding details, travel information, RSVP, and registry for ${site.coupleName}.`,
    image: home.hero.image.src,
  },
  schedule: {
    title: `${schedule.intro.title} | ${site.coupleName}`,
    description: schedule.intro.copy,
    image: schedule.days[1]?.events[0]?.image.src ?? home.hero.image.src,
  },
  travel: {
    title: `${travel.hero.title} | ${site.coupleName}`,
    description: travel.venue.description,
    image: travel.venue.image.src,
  },
  rsvp: {
    title: `${rsvp.hero.title} | ${site.coupleName}`,
    description: rsvp.hero.message,
    image: home.hero.image.src,
  },
  registry: {
    title: `${registry.hero.title} | ${site.coupleName}`,
    description: registry.hero.message,
    image: registry.items[0]?.image.src ?? home.hero.image.src,
  },
} satisfies Record<PageId, PageMetadata>

const getAbsoluteUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  return new URL(path, window.location.origin).toString()
}

const setMetaTag = (
  selector: string,
  attribute: 'name' | 'property',
  key: string,
  content: string,
) => {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.append(tag)
  }

  tag.content = content
}

const setCanonical = (href: string) => {
  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  )

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }

  canonical.href = href
}

export const updatePageMetadata = (page: PageId) => {
  const metadata = pageMetadata[page]
  const pageUrl = getAbsoluteUrl(getPathForPage(page))
  const imageUrl = getAbsoluteUrl(metadata.image)

  document.title = metadata.title
  setCanonical(pageUrl)
  setMetaTag('meta[name="description"]', 'name', 'description', metadata.description)
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website')
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', metadata.title)
  setMetaTag(
    'meta[property="og:description"]',
    'property',
    'og:description',
    metadata.description,
  )
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl)
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl)
  setMetaTag(
    'meta[name="twitter:card"]',
    'name',
    'twitter:card',
    'summary_large_image',
  )
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.title)
  setMetaTag(
    'meta[name="twitter:description"]',
    'name',
    'twitter:description',
    metadata.description,
  )
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)
}
