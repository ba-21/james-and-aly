import { useEffect, useState } from 'react'
import { Footer } from '../components/Footer'
import { Header, MobileNav } from '../components/Header'
import { HomePage } from '../pages/HomePage'
import { RegistryPage } from '../pages/RegistryPage'
import { RsvpPage } from '../pages/RsvpPage'
import { SchedulePage } from '../pages/SchedulePage'
import { TravelPage } from '../pages/TravelPage'
import type { PageId } from '../types'
import { updatePageMetadata } from './metadata'
import { getPageFromPathname, getPathForPage, jumpToTop } from './navigation'

function App() {
  const [activePage, setActivePage] = useState<PageId>(() =>
    getPageFromPathname(window.location.pathname),
  )

  useEffect(() => {
    const handlePopState = () => {
      jumpToTop()
      setActivePage(getPageFromPathname(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    updatePageMetadata(activePage)
  }, [activePage])

  const navigateTo = (page: PageId) => {
    const nextPath = getPathForPage(page)

    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath)
    }

    jumpToTop()
    setActivePage(page)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'schedule':
        return <SchedulePage />
      case 'travel':
        return <TravelPage />
      case 'rsvp':
        return <RsvpPage />
      case 'registry':
        return <RegistryPage />
      case 'home':
        return (
          <HomePage onNavigate={navigateTo} onRsvp={() => navigateTo('rsvp')} />
        )
    }
  }

  return (
    <div className="app-shell">
      <Header activePage={activePage} onNavigate={navigateTo} />
      <main>{renderPage()}</main>
      <Footer activePage={activePage} onNavigate={navigateTo} />
      <MobileNav activePage={activePage} onNavigate={navigateTo} />
    </div>
  )
}

export default App
