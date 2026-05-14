import type { MouseEvent } from 'react'
import { getPathForPage } from '../app/navigation'
import { site } from '../content'
import type { PageId } from '../types'
import { Icon } from './Icon'

const currentYear = new Date().getFullYear()

export type FooterProps = {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

export function Footer({ activePage, onNavigate }: FooterProps) {
  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    page: PageId,
  ) => {
    event.preventDefault()
    onNavigate(page)
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <a
          className="footer-brand"
          href={getPathForPage('home')}
          onClick={(event) => handleNavigate(event, 'home')}
        >
          {site.coupleName}
        </a>
        <div className="footer-links">
          <a
            className={`footer-link ${
              activePage === 'travel' ? 'is-active' : ''
            }`}
            href={getPathForPage('travel')}
            onClick={(event) => handleNavigate(event, 'travel')}
          >
            Travel
          </a>
          <a
            className={`footer-link ${
              activePage === 'registry' ? 'is-active' : ''
            }`}
            href={getPathForPage('registry')}
            onClick={(event) => handleNavigate(event, 'registry')}
          >
            Registry
          </a>
          <a
            className={`footer-link ${
              activePage === 'rsvp' ? 'is-active' : ''
            }`}
            href={getPathForPage('rsvp')}
            onClick={(event) => handleNavigate(event, 'rsvp')}
          >
            RSVP
          </a>
          <a
            className={`footer-link ${
              activePage === 'schedule' ? 'is-active' : ''
            }`}
            href={getPathForPage('schedule')}
            onClick={(event) => handleNavigate(event, 'schedule')}
          >
            Schedule
          </a>
        </div>
        <p className="footer-copy">
          &copy; {currentYear} {site.footer.copyrightName}.{' '}
          {site.footer.message}
        </p>
        <div className="footer-icons" aria-hidden="true">
          <Icon name="favorite" filled />
          <Icon name="auto_awesome" />
        </div>
      </div>
    </footer>
  )
}
