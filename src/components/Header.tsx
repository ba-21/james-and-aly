import { type MouseEvent, useState } from 'react'
import { getPathForPage } from '../app/navigation'
import { site } from '../content'
import type { PageId } from '../types'
import { Icon } from './Icon'

export type NavigationProps = {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

export function Header({ activePage, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    page: PageId,
  ) => {
    event.preventDefault()
    onNavigate(page)
    setIsMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="brand-button"
          href={getPathForPage('home')}
          onClick={(event) => handleNavigate(event, 'home')}
        >
          {site.coupleName}
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {site.navItems.map((item) => (
            <a
              className={`nav-link ${activePage === item.id ? 'is-active' : ''}`}
              href={getPathForPage(item.id)}
              aria-current={activePage === item.id ? 'page' : undefined}
              key={item.id}
              onClick={(event) => handleNavigate(event, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className="icon-button menu-button"
          type="button"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label="Open navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} />
        </button>
      </div>
      {isMenuOpen ? (
        <nav
          className="mobile-menu"
          id="mobile-menu"
          aria-label="Mobile navigation"
        >
          {site.navItems.map((item) => (
            <a
              className={`mobile-menu-link ${
                activePage === item.id ? 'is-active' : ''
              }`}
              href={getPathForPage(item.id)}
              aria-current={activePage === item.id ? 'page' : undefined}
              key={item.id}
              onClick={(event) => handleNavigate(event, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  )
}

export function MobileNav({
  activePage,
  onNavigate,
}: NavigationProps) {
  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    page: PageId,
  ) => {
    event.preventDefault()
    onNavigate(page)
  }

  return (
    <nav className="mobile-bottom-nav" aria-label="Quick navigation">
      <a
        className={`mobile-nav-item ${activePage === 'home' ? 'is-active' : ''}`}
        href={getPathForPage('home')}
        aria-current={activePage === 'home' ? 'page' : undefined}
        onClick={(event) => handleNavigate(event, 'home')}
      >
        <Icon name="home" filled={activePage === 'home'} />
        <span>Home</span>
      </a>
      <a
        className={`mobile-nav-item ${
          activePage === 'schedule' ? 'is-active' : ''
        }`}
        href={getPathForPage('schedule')}
        aria-current={activePage === 'schedule' ? 'page' : undefined}
        onClick={(event) => handleNavigate(event, 'schedule')}
      >
        <Icon name="calendar_today" filled={activePage === 'schedule'} />
        <span>Schedule</span>
      </a>
      <a
        className={`mobile-nav-item ${
          activePage === 'travel' ? 'is-active' : ''
        }`}
        href={getPathForPage('travel')}
        aria-current={activePage === 'travel' ? 'page' : undefined}
        onClick={(event) => handleNavigate(event, 'travel')}
      >
        <Icon name="flight" filled={activePage === 'travel'} />
        <span>Travel</span>
      </a>
      <a
        className={`mobile-nav-item ${
          activePage === 'rsvp' ? 'is-active' : ''
        }`}
        href={getPathForPage('rsvp')}
        aria-current={activePage === 'rsvp' ? 'page' : undefined}
        onClick={(event) => handleNavigate(event, 'rsvp')}
      >
        <Icon name="favorite" filled={activePage === 'rsvp'} />
        <span>RSVP</span>
      </a>
      <a
        className={`mobile-nav-item ${
          activePage === 'registry' ? 'is-active' : ''
        }`}
        href={getPathForPage('registry')}
        aria-current={activePage === 'registry' ? 'page' : undefined}
        onClick={(event) => handleNavigate(event, 'registry')}
      >
        <Icon name="redeem" filled={activePage === 'registry'} />
        <span>Registry</span>
      </a>
    </nav>
  )
}
