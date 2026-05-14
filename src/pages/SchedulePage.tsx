import { Icon } from '../components/Icon'
import { schedule, type ScheduleEvent } from '../content'

type EventDetailsProps = {
  event: ScheduleEvent
  align: 'left' | 'right'
}

function EventDetails({ event, align }: EventDetailsProps) {
  return (
    <div className={`event-details event-details--${align}`}>
      <div className="event-meta">
        <Icon className="event-icon" name={event.icon} />
        <span>{event.time}</span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <div className="event-location">
        <Icon name="location_on" />
        <span>{event.location}</span>
      </div>
    </div>
  )
}

function EventImage({ event }: { event: ScheduleEvent }) {
  return (
    <div className="event-image-frame">
      <img src={event.image.src} alt={event.image.alt} loading="lazy" />
    </div>
  )
}

export function SchedulePage() {
  return (
    <section className="schedule-page" aria-labelledby="schedule-title">
      <div className="section-inner centered schedule-intro">
        <h1 className="page-title" id="schedule-title">
          {schedule.intro.title}
        </h1>
        <p className="page-kicker">{schedule.intro.copy}</p>
        <div className="and-divider" aria-hidden="true">
          <span />
          <em>{schedule.intro.dividerText}</em>
          <span />
        </div>
      </div>

      <div className="section-inner timeline">
        {schedule.days.map((day) => (
          <section className="timeline-day" key={day.date}>
            <div className="day-heading">
              <span className="date-pill">{day.date}</span>
              <h2>{day.title}</h2>
            </div>
            <div className="day-events">
              {day.events.map((event) => {
                const imageFirst = event.imageSide === 'left'
                const align = imageFirst ? 'left' : 'right'

                return (
                  <article
                    className={`event-row event-row--image-${event.imageSide}`}
                    key={event.title}
                  >
                    {imageFirst ? (
                      <>
                        <EventImage event={event} />
                        <EventDetails event={event} align={align} />
                      </>
                    ) : (
                      <>
                        <EventDetails event={event} align={align} />
                        <EventImage event={event} />
                      </>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
