import type { PageId } from '../types'

const pagePaths = {
  home: '/',
  schedule: '/schedule',
  travel: '/travel',
  rsvp: '/rsvp',
  registry: '/registry',
} satisfies Record<PageId, string>

const pathPages = new Map<string, PageId>(
  Object.entries(pagePaths).map(([page, path]) => [path, page as PageId]),
)

export const getPathForPage = (page: PageId): string => pagePaths[page]

export const getPageFromPathname = (pathname: string): PageId => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'

  return pathPages.get(normalizedPath) ?? 'home'
}

export const jumpToTop = () => {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}
