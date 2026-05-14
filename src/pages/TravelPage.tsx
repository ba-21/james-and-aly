import { Icon } from '../components/Icon'
import { travel } from '../content'

export function TravelPage() {
  return (
    <section className="travel-page" aria-labelledby="travel-title">
      <header className="travel-hero">
        <span className="eyebrow travel-eyebrow">{travel.hero.eyebrow}</span>
        <h1 className="page-title" id="travel-title">
          {travel.hero.title}
        </h1>
        <div className="fine-divider" />
      </header>

      <section className="section-inner venue-section" aria-labelledby="venue">
        <div className="venue-copy">
          <h2 id="venue">{travel.venue.title}</h2>
          <p>{travel.venue.description}</p>
          <div className="venue-details">
            {travel.venue.details.map((detail) => (
              <div className="venue-detail" key={detail.label}>
                <Icon name={detail.icon} />
                <div>
                  <h3>{detail.label}</h3>
                  <p>{detail.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="venue-image-frame">
          <img
            src={travel.venue.image.src}
            alt={travel.venue.image.alt}
            loading="lazy"
          />
          <div className="venue-image-overlay">
            <a
              className="map-link"
              href={travel.venue.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="map" />
              {travel.venue.mapCta}
            </a>
          </div>
        </div>
      </section>

      <section className="stay-section" aria-labelledby="recommended-stay">
        <div className="section-inner">
          <div className="stay-intro">
            <h2 id="recommended-stay">{travel.stay.title}</h2>
            <p>{travel.stay.copy}</p>
          </div>
          <div className="hotel-grid">
            {travel.stay.hotels.map((hotel) => (
              <article className="hotel-card" key={hotel.title}>
                <div className="hotel-image">
                  <img src={hotel.image.src} alt={hotel.image.alt} loading="lazy" />
                </div>
                <div className="hotel-content">
                  <div className="hotel-heading">
                    <div>
                      <h3>{hotel.title}</h3>
                      <p>{hotel.distance}</p>
                    </div>
                    <Icon name="star" filled />
                  </div>
                  <p className="hotel-description">{hotel.description}</p>
                  <a
                    className={`hotel-button ${
                      hotel.featured ? 'hotel-button--primary' : ''
                    }`}
                    href="#recommended-stay"
                  >
                    {hotel.buttonLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section-inner getting-there"
        id="getting-there"
        aria-labelledby="getting-there-title"
      >
        <div className="getting-there-intro">
          <h2 id="getting-there-title">{travel.gettingThere.title}</h2>
          <p>{travel.gettingThere.copy}</p>
        </div>
        <div className="travel-tip-grid">
          {travel.gettingThere.tips.map((tip) => (
            <article className="travel-tip" key={tip.title}>
              <div className="travel-tip-icon">
                <Icon name={tip.icon} />
              </div>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-inner travel-feature">
        <img
          src={travel.feature.image.src}
          alt={travel.feature.image.alt}
          loading="lazy"
        />
        <div className="travel-feature-overlay" />
        <p>{travel.feature.caption}</p>
      </section>
    </section>
  )
}
