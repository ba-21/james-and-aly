import type { ChangeEvent, FormEvent } from 'react'
import { useRef, useState } from 'react'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { Icon } from '../components/Icon'
import { rsvp, type Attendance } from '../content'
import { sendRsvpEmail } from '../services/email'

type RsvpFormState = {
  guests: string
  attendance: Attendance
  dietaryNotes: string
  message: string
}

const initialForm: RsvpFormState = {
  guests: '',
  attendance: '',
  dietaryNotes: '',
  message: '',
}

const getFormErrors = (form: RsvpFormState) => ({
  guests: form.guests.trim() ? '' : 'Please enter the guest names.',
  attendance: form.attendance ? '' : 'Please select whether you can attend.',
})

const getAttendanceLabel = (attendance: Attendance) =>
  rsvp.form.attendanceOptions.find((option) => option.value === attendance)
    ?.label ?? 'Not selected'

const getOptionalValue = (value: string) => value.trim() || 'None provided'

export function RsvpPage() {
  const guestNamesRef = useRef<HTMLInputElement | null>(null)
  const firstAttendanceRef = useRef<HTMLInputElement | null>(null)
  const [form, setForm] = useState<RsvpFormState>(initialForm)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [confettiKey, setConfettiKey] = useState(0)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const formErrors = getFormErrors(form)
  const showGuestError = hasAttemptedSubmit && Boolean(formErrors.guests)
  const showAttendanceError =
    hasAttemptedSubmit && Boolean(formErrors.attendance)

  const updateField =
    <Field extends keyof RsvpFormState>(field: Field) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const value = event.target.value as RsvpFormState[Field]

      setForm((current) => ({
        ...current,
        [field]: value,
      }))
      setIsSubmitted(false)
      setSendError('')
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setHasAttemptedSubmit(true)
    setSendError('')

    const nextErrors = getFormErrors(form)

    if (nextErrors.guests) {
      guestNamesRef.current?.focus()
      setIsSubmitted(false)
      return
    }

    if (nextErrors.attendance) {
      firstAttendanceRef.current?.focus()
      setIsSubmitted(false)
      return
    }

    setIsSending(true)

    try {
      await sendRsvpEmail({
        toEmail: rsvp.form.recipientEmail.trim(),
        guestNames: form.guests.trim(),
        attendance: getAttendanceLabel(form.attendance),
        dietaryNotes: getOptionalValue(form.dietaryNotes),
        guestMessage: getOptionalValue(form.message),
      })
      setForm(initialForm)
      setHasAttemptedSubmit(false)
      setIsSubmitted(true)
      setConfettiKey((current) => current + 1)
    } catch (error) {
      console.error(error)
      setIsSubmitted(false)
      setSendError('Sorry, your RSVP could not be sent. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="rsvp-page" aria-labelledby="rsvp-title">
      <header className="rsvp-hero">
        <h1 className="page-title" id="rsvp-title">
          {rsvp.hero.title}
        </h1>
        <p>{rsvp.hero.message}</p>
        <div className="short-divider" />
      </header>

      <section className="rsvp-form-section" aria-label="RSVP form">
        <div className="rsvp-card">
          <img
            className="rsvp-decoration"
            src={rsvp.decorativeImage.src}
            alt={rsvp.decorativeImage.alt}
            aria-hidden="true"
          />
          {isSubmitted ? (
            <ConfettiBurst key={confettiKey} />
          ) : null}
          <form
            className="rsvp-form"
            onSubmit={handleSubmit}
            autoComplete="off"
            aria-busy={isSending}
            noValidate
          >
            <div className="form-group">
              <label htmlFor="guest-names">
                {rsvp.form.guestNamesLabel}
              </label>
              <input
                ref={guestNamesRef}
                id="guest-names"
                className="rsvp-input"
                type="text"
                value={form.guests}
                onChange={updateField('guests')}
                placeholder={rsvp.form.guestNamesPlaceholder}
                aria-invalid={showGuestError}
                aria-describedby={showGuestError ? 'guest-names-error' : undefined}
              />
              {showGuestError ? (
                <p className="rsvp-error" id="guest-names-error" role="alert">
                  {formErrors.guests}
                </p>
              ) : null}
            </div>

            <fieldset
              className="form-group rsvp-fieldset"
              aria-invalid={showAttendanceError}
              aria-describedby={
                showAttendanceError ? 'attendance-error' : undefined
              }
            >
              <legend>{rsvp.form.attendanceLabel}</legend>
              <div className="radio-row">
                {rsvp.form.attendanceOptions.map((option, index) => (
                  <label className="radio-option" key={option.value}>
                    <input
                      ref={index === 0 ? firstAttendanceRef : undefined}
                      type="radio"
                      name="attendance"
                      value={option.value}
                      checked={form.attendance === option.value}
                      onChange={updateField('attendance')}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {showAttendanceError ? (
                <p className="rsvp-error" id="attendance-error" role="alert">
                  {formErrors.attendance}
                </p>
              ) : null}
            </fieldset>

            <div className="form-group">
              <label htmlFor="dietary-notes">
                {rsvp.form.dietaryPlaceholder}
              </label>
              <input
                id="dietary-notes"
                className="rsvp-input"
                type="text"
                value={form.dietaryNotes}
                onChange={updateField('dietaryNotes')}
                placeholder={rsvp.form.dietaryPlaceholder}
              />
            </div>

            <div className="form-group">
              <label htmlFor="guest-message">{rsvp.form.messageLabel}</label>
              <textarea
                id="guest-message"
                className="rsvp-textarea"
                value={form.message}
                onChange={updateField('message')}
                placeholder={rsvp.form.messagePlaceholder}
                rows={4}
              />
            </div>

            <div className="rsvp-submit-row">
              <button
                className="primary-button rsvp-submit"
                type="submit"
                disabled={isSending}
              >
                {isSending ? 'Sending...' : rsvp.form.submitLabel}
              </button>
              <p>{rsvp.form.thanksMessage}</p>
              {isSubmitted ? (
                <p className="rsvp-confirmation" role="status">
                  {rsvp.form.confirmationMessage}
                </p>
              ) : null}
              {sendError ? (
                <p className="rsvp-error" role="alert">
                  {sendError}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <div className="rsvp-heart" aria-hidden="true">
        <Icon name="favorite" filled />
      </div>
    </section>
  )
}
