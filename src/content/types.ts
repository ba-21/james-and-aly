import type { MaterialIconName, PageId } from '../types'

export type NavItem = {
  id: PageId
  label: string
}

export type SiteContent = {
  coupleName: string
  weddingDate: string
  navItems: NavItem[]
  footer: {
    copyrightName: string
    message: string
  }
}

export type EventImage = {
  src: string
  alt: string
}

export type CelebrationDetail = {
  icon: MaterialIconName
  title: string
  lines: string[]
}

export type HomeContent = {
  hero: {
    eyebrow: string
    firstName: string
    secondName: string
    date: string
    location: string
    image: EventImage
    scrollLabel: string
  }
  countdown: {
    ariaLabel: string
    labels: {
      days: string
      hours: string
      minutes: string
    }
  }
  details: {
    title: string
    primaryCta: string
    secondaryCta: string
    contactCta: string
    items: CelebrationDetail[]
  }
}

export type ScheduleEvent = {
  title: string
  time: string
  description: string
  location: string
  icon: MaterialIconName
  image: EventImage
  imageSide: 'left' | 'right'
}

export type ScheduleDay = {
  date: string
  title: string
  events: ScheduleEvent[]
}

export type ScheduleContent = {
  intro: {
    title: string
    copy: string
    dividerText: string
  }
  days: ScheduleDay[]
}

export type RegistryItem = {
  title: string
  description: string
  cta: string
  image: EventImage
  variant: 'feature' | 'vertical' | 'wide-reverse' | 'wide'
}

export type RegistryContent = {
  hero: {
    eyebrow: string
    title: string
    message: string
    signature: string
  }
  items: RegistryItem[]
  partners: {
    title: string
    cta: string
    items: string[]
  }
}

export type VenueDetail = {
  icon: MaterialIconName
  label: string
  value: string
}

export type TravelVenue = {
  title: string
  description: string
  mapUrl: string
  mapCta: string
  details: VenueDetail[]
  image: EventImage
}

export type HotelRecommendation = {
  title: string
  distance: string
  description: string
  image: EventImage
  buttonLabel: string
  featured: boolean
}

export type TravelTip = {
  icon: MaterialIconName
  title: string
  description: string
}

export type TravelFeature = {
  image: EventImage
  caption: string
}

export type TravelContent = {
  hero: {
    eyebrow: string
    title: string
  }
  venue: TravelVenue
  stay: {
    title: string
    copy: string
    hotels: HotelRecommendation[]
  }
  gettingThere: {
    title: string
    copy: string
    tips: TravelTip[]
  }
  feature: TravelFeature
}

export type Attendance = '' | 'attending' | 'declining'

export type RsvpContent = {
  hero: {
    title: string
    message: string
  }
  decorativeImage: EventImage
  form: {
    recipientEmail: string
    guestNamesLabel: string
    guestNamesPlaceholder: string
    attendanceLabel: string
    attendanceOptions: Array<{
      value: Exclude<Attendance, ''>
      label: string
    }>
    dietaryPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    submitLabel: string
    thanksMessage: string
    confirmationMessage: string
  }
}
