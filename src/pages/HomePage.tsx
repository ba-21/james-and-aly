import { useCallback, useState } from 'react'
import { ContactModal } from '../components/ContactModal'
import { GalleryModal } from '../components/GalleryModal'
import { Icon } from '../components/Icon'
import { home, rsvp, weddingDate } from '../content'
import { useCountdown } from '../hooks/useCountdown'
import type { PageId } from '../types'

export type HomePageProps = {
  onNavigate: (page: PageId) => void
  onRsvp: () => void
}

const formatUnit = (value: number) => value.toString().padStart(2, '0')

export function HomePage({ onNavigate, onRsvp }: HomePageProps) {
  const countdown = useCountdown(weddingDate)
  const storyImages = home.story.images
  const storyCount = storyImages.length
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const countdownItems = [
    { label: home.countdown.labels.days, value: countdown.days.toString() },
    { label: home.countdown.labels.hours, value: formatUnit(countdown.hours) },
    {
      label: home.countdown.labels.minutes,
      value: formatUnit(countdown.minutes),
    },
  ]

  const closeStoryModal = useCallback(() => setActiveStoryIndex(null), [])

  const stepStory = useCallback(
    (direction: -1 | 1) => {
      setActiveStoryIndex((currentIndex) => {
        if (currentIndex === null || storyCount === 0) {
          return currentIndex
        }

        return (currentIndex + direction + storyCount) % storyCount
      })
    },
    [storyCount],
  )

  return (
    <>
      <section className="hero-section" aria-labelledby="home-title">
        <img
          className="hero-image"
          src={home.hero.image.src}
          alt={home.hero.image.alt}
          fetchPriority="high"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">{home.hero.eyebrow}</p>
          <h1 className="hero-title" id="home-title">
            {home.hero.firstName} <span>&amp;</span> {home.hero.secondName}
          </h1>
          <div className="short-divider" />
          <p className="hero-date">
            {home.hero.date} <span aria-hidden="true">&middot;</span>{' '}
            {home.hero.location}
          </p>
          <div className="countdown" aria-label={home.countdown.ariaLabel}>
            {countdownItems.map((item, index) => (
              <div className="countdown-group" key={item.label}>
                <div className="countdown-unit">
                  <span className="countdown-value">{item.value}</span>
                  <span className="countdown-label">{item.label}</span>
                </div>
                {index < countdownItems.length - 1 ? (
                  <span className="countdown-separator" aria-hidden="true">
                    :
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <button
          className="scroll-cue"
          type="button"
          onClick={() =>
            document.getElementById('rsvp')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        >
          <span>{home.hero.scrollLabel}</span>
          <Icon name="expand_more" />
        </button>
      </section>

      <section className="details-section" id="rsvp" aria-labelledby="details">
        <div className="section-inner centered">
          <h2 className="section-title" id="details">
            {home.details.title}
          </h2>
          <div className="detail-grid">
            {home.details.items.map((detail) => (
              <article className="detail-card" key={detail.title}>
                <Icon className="detail-icon" name={detail.icon} />
                <h3>{detail.title}</h3>
                <p>
                  {detail.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </article>
            ))}
          </div>
          <div className="home-actions">
            <button className="primary-button" type="button" onClick={onRsvp}>
              {home.details.primaryCta}
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => onNavigate('schedule')}
            >
              {home.details.secondaryCta}
            </button>
            <button
              className="secondary-button contact-button"
              type="button"
              onClick={() => setIsContactOpen(true)}
            >
              <Icon name="mail" />
              <span>{home.details.contactCta}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="story-section" aria-labelledby="story-title">
        <div className="section-inner centered">
          <h2 className="section-title" id="story-title">
            {home.story.title}
          </h2>
          <div className="story-grid">
            {storyImages.map((story, index) => (
              <figure className="story-card" key={story.title}>
                <button
                  className="story-card-button"
                  type="button"
                  aria-label={`Open ${story.title}`}
                  onClick={() => setActiveStoryIndex(index)}
                >
                  <img
                    src={story.image.src}
                    alt={story.image.alt}
                    loading="lazy"
                  />
                </button>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <GalleryModal
        title={home.story.title}
        items={storyImages}
        activeIndex={activeStoryIndex}
        onClose={closeStoryModal}
        onStep={stepStory}
      />
      <ContactModal
        isOpen={isContactOpen}
        recipientEmail={rsvp.form.recipientEmail}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  )
}
