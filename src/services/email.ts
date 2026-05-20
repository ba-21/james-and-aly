import { send } from '@emailjs/browser'

export type ContactEmailParams = {
  toEmail: string
  fromName: string
  fromEmail: string
  contactSubject: string
  message: string
}

export type RsvpEmailParams = {
  toEmail: string
  guestNames: string
  attendance: string
  firstMeal: string
  secondMeal: string
  dietaryNotes: string
  songRequest: string
  guestMessage: string
}

const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  contactTemplateId: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
  rsvpTemplateId: import.meta.env.VITE_EMAILJS_RSVP_TEMPLATE_ID,
}

const getSubmittedAt = () =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date())

const assertEmailConfig = () => {
  const missingKeys = Object.entries(emailConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missingKeys.length > 0) {
    throw new Error(`Missing EmailJS configuration: ${missingKeys.join(', ')}`)
  }
}

const sendEmail = (templateId: string, params: Record<string, unknown>) => {
  assertEmailConfig()

  return send(emailConfig.serviceId, templateId, params, {
    publicKey: emailConfig.publicKey,
  })
}

export const sendContactEmail = (params: ContactEmailParams) =>
  sendEmail(emailConfig.contactTemplateId, {
    to_email: params.toEmail,
    from_name: params.fromName,
    from_email: params.fromEmail,
    reply_to: params.fromEmail,
    contact_subject: params.contactSubject,
    message: params.message,
    submitted_at: getSubmittedAt(),
  })

export const sendRsvpEmail = (params: RsvpEmailParams) =>
  sendEmail(emailConfig.rsvpTemplateId, {
    to_email: params.toEmail,
    guest_names: params.guestNames,
    attendance: params.attendance,
    first_meal: params.firstMeal,
    second_meal: params.secondMeal,
    dietary_notes: params.dietaryNotes,
    song_request: params.songRequest,
    guest_message: params.guestMessage,
    submitted_at: getSubmittedAt(),
  })
