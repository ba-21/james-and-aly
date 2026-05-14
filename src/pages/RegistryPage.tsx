import { Icon } from '../components/Icon'
import { registry } from '../content'

export function RegistryPage() {
  return (
    <section className="registry-page" aria-labelledby="registry-title">
      <header className="registry-hero">
        <span className="eyebrow registry-eyebrow">
          {registry.hero.eyebrow}
        </span>
        <h1 className="page-title" id="registry-title">
          {registry.hero.title}
        </h1>
        <div className="fine-divider" />
        <p className="registry-message">{registry.hero.message}</p>
        <p className="registry-signature">{registry.hero.signature}</p>
      </header>

      <div className="section-inner registry-grid" aria-label="Registry gifts">
        {registry.items.map((item) => (
          <article
            className={`registry-card registry-card--${item.variant}`}
            key={item.title}
          >
            <div className="registry-card-image">
              <img src={item.image.src} alt={item.image.alt} loading="lazy" />
            </div>
            <div className="registry-card-content">
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <a className="text-link" href="#registry-partners">
                {item.cta}
                {item.variant === 'feature' ? (
                  <Icon name="arrow_forward" />
                ) : null}
              </a>
            </div>
          </article>
        ))}
      </div>

      <section
        className="registry-partners"
        id="registry-partners"
        aria-labelledby="registry-partners-title"
      >
        <div className="fine-divider" />
        <h2 id="registry-partners-title">{registry.partners.title}</h2>
        <div className="partner-list">
          {registry.partners.items.map((partner) => (
            <span key={partner}>{partner}</span>
          ))}
        </div>
        <a className="primary-button registry-button" href="#registry-title">
          {registry.partners.cta}
        </a>
      </section>
    </section>
  )
}
