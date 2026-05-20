import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { sendContactEmail } from '../services/email'
import { Icon } from './Icon'

type ContactFormState = {
  name: string
  email: string
  subject: string
  message: string
}

export type ContactModalProps = {
  isOpen: boolean
  recipientEmail: string
  onClose: () => void
}

const initialContactForm: ContactFormState = {
  name: '',
  email: '',
  subject: 'Info: ',
  message: '',
}

const normalizeSubject = (subject: string) => {
  const trimmedSubject = subject.trim()

  if (trimmedSubject.toLowerCase().startsWith('info:')) {
    return trimmedSubject
  }

  return `Info: ${trimmedSubject || 'Wedding question'}`
}

const getContactErrors = (form: ContactFormState) => ({
  name: form.name.trim() ? '' : 'Please enter your name.',
  email: form.email.trim() ? '' : 'Please enter your email address.',
  subject: normalizeSubject(form.subject) ? '' : 'Please enter a subject.',
  message: form.message.trim() ? '' : 'Please enter your message.',
})

export function ContactModal({
  isOpen,
  recipientEmail,
  onClose,
}: ContactModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [form, setForm] = useState<ContactFormState>(initialContactForm)
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const formErrors = getContactErrors(form)

  useLockBodyScroll(isOpen)

  const handleClose = useCallback(() => {
    setForm(initialContactForm)
    setHasAttemptedSubmit(false)
    setIsSubmitted(false)
    setIsSending(false)
    setSendError('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null
    nameInputRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
        return
      }

      if (event.key === 'Tab' && panelRef.current) {
        const focusableElements =
          panelRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (!firstElement || !lastElement) {
          return
        }

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
      previousFocusRef.current = null
    }
  }, [isOpen, handleClose])

  if (!isOpen) {
    return null
  }

  const updateField =
    <Field extends keyof ContactFormState>(field: Field) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }))
      setIsSubmitted(false)
      setSendError('')
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasAttemptedSubmit(true)
    setSendError('')

    const nextErrors = getContactErrors(form)

    if (
      nextErrors.name ||
      nextErrors.email ||
      nextErrors.subject ||
      nextErrors.message
    ) {
      return
    }

    setIsSending(true)

    try {
      await sendContactEmail({
        toEmail: recipientEmail.trim(),
        fromName: form.name.trim(),
        fromEmail: form.email.trim(),
        contactSubject: normalizeSubject(form.subject),
        message: form.message.trim(),
      })
      setForm(initialContactForm)
      setHasAttemptedSubmit(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error(error)
      setIsSubmitted(false)
      setSendError('Sorry, your message could not be sent. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div
      className="contact-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        className="contact-modal-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="contact-modal-close"
          type="button"
          aria-label="Close contact form"
          onClick={handleClose}
        >
          <Icon name="close" />
        </button>

        <h2 className="contact-modal-title" id="contact-modal-title">
          Contact Us
        </h2>
        <div className="contact-modal-intro">
          <p>Please contact us with any questions you may have</p>
          <p>Obviousley we're quite busy right now</p>
          <p>But we'll get back to you as soon as we can</p>
          <p>Looking forward to seeing you there !</p>
        </div>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-busy={isSending}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="contact-name">Name</label>
            <input
              ref={nameInputRef}
              id="contact-name"
              className="rsvp-input"
              type="text"
              value={form.name}
              onChange={updateField('name')}
              aria-invalid={hasAttemptedSubmit && Boolean(formErrors.name)}
              aria-describedby={
                hasAttemptedSubmit && formErrors.name
                  ? 'contact-name-error'
                  : undefined
              }
            />
            {hasAttemptedSubmit && formErrors.name ? (
              <p className="rsvp-error" id="contact-name-error" role="alert">
                {formErrors.name}
              </p>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              className="rsvp-input"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              aria-invalid={hasAttemptedSubmit && Boolean(formErrors.email)}
              aria-describedby={
                hasAttemptedSubmit && formErrors.email
                  ? 'contact-email-error'
                  : undefined
              }
            />
            {hasAttemptedSubmit && formErrors.email ? (
              <p className="rsvp-error" id="contact-email-error" role="alert">
                {formErrors.email}
              </p>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              className="rsvp-input"
              type="text"
              value={form.subject}
              onChange={updateField('subject')}
              aria-invalid={hasAttemptedSubmit && Boolean(formErrors.subject)}
              aria-describedby={
                hasAttemptedSubmit && formErrors.subject
                  ? 'contact-subject-error'
                  : undefined
              }
            />
            {hasAttemptedSubmit && formErrors.subject ? (
              <p className="rsvp-error" id="contact-subject-error" role="alert">
                {formErrors.subject}
              </p>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              className="rsvp-textarea"
              value={form.message}
              onChange={updateField('message')}
              rows={5}
              aria-invalid={hasAttemptedSubmit && Boolean(formErrors.message)}
              aria-describedby={
                hasAttemptedSubmit && formErrors.message
                  ? 'contact-message-error'
                  : undefined
              }
            />
            {hasAttemptedSubmit && formErrors.message ? (
              <p className="rsvp-error" id="contact-message-error" role="alert">
                {formErrors.message}
              </p>
            ) : null}
          </div>

          <div className="contact-submit-row">
            <button
              className="primary-button contact-submit"
              type="submit"
              disabled={isSending}
            >
              <Icon name="mail" />
              <span>{isSending ? 'Sending...' : 'Send Message'}</span>
            </button>
            {isSubmitted ? (
              <p className="rsvp-confirmation" role="status">
                Your message has been sent.
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
    </div>
  )
}
