import type { MaterialIconName, PageId } from '../types'
import type {
  Attendance,
  CelebrationDetail,
  EventImage,
  HomeContent,
  RegistryContent,
  RegistryItem,
  RsvpContent,
  ScheduleContent,
  ScheduleDay,
  ScheduleEvent,
  SiteContent,
  TravelContent,
  TravelFeature,
  TravelTip,
  TravelVenue,
  VenueDetail,
} from './types'

type ContentRecord = Record<string, unknown>
type ContentAssertion<T> = (
  value: unknown,
  path: string,
) => asserts value is T

const pageIds = [
  'home',
  'schedule',
  'travel',
  'rsvp',
  'registry',
] satisfies PageId[]

const materialIcons = [
  'airport_shuttle',
  'arrow_back',
  'arrow_forward',
  'auto_awesome',
  'bakery_dining',
  'calendar_today',
  'celebration',
  'church',
  'close',
  'directions_car',
  'expand_more',
  'favorite',
  'flight',
  'home',
  'hotel',
  'local_bar',
  'location_on',
  'map',
  'menu',
  'music_note',
  'redeem',
  'restaurant',
  'schedule',
  'star',
  'tips_and_updates',
] satisfies MaterialIconName[]

const attendanceValues = ['attending', 'declining'] satisfies Array<
  Exclude<Attendance, ''>
>
const registryVariants = [
  'feature',
  'vertical',
  'wide-reverse',
  'wide',
] satisfies RegistryItem['variant'][]
const imageSides = ['left', 'right'] satisfies ScheduleEvent['imageSide'][]

const isRecord = (value: unknown): value is ContentRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const fail = (path: string, expectation: string): never => {
  throw new Error(`Invalid CMS content at ${path}: expected ${expectation}.`)
}

const requireObject = (value: unknown, path: string): ContentRecord => {
  if (isRecord(value)) {
    return value
  }

  return fail(path, 'an object')
}

const requireObjectField = (
  record: ContentRecord,
  key: string,
  path: string,
): ContentRecord => requireObject(record[key], `${path}.${key}`)

const requireString = (
  record: ContentRecord,
  key: string,
  path: string,
): string => {
  const value = record[key]

  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  return fail(`${path}.${key}`, 'a non-empty string')
}

const requireBoolean = (
  record: ContentRecord,
  key: string,
  path: string,
): boolean => {
  const value = record[key]

  if (typeof value === 'boolean') {
    return value
  }

  return fail(`${path}.${key}`, 'a boolean')
}

const requireStringField = (
  record: ContentRecord,
  key: string,
  path: string,
): string => {
  const value = record[key]

  if (typeof value === 'string') {
    return value
  }

  return fail(`${path}.${key}`, 'a string')
}

const requireArray = (
  record: ContentRecord,
  key: string,
  path: string,
): unknown[] => {
  const value = record[key]

  if (Array.isArray(value)) {
    return value
  }

  return fail(`${path}.${key}`, 'an array')
}

const assertOneOf = <Value extends string>(
  value: string,
  allowedValues: readonly Value[],
  path: string,
): Value => {
  if (!allowedValues.includes(value as Value)) {
    fail(path, `one of ${allowedValues.join(', ')}`)
  }

  return value as Value
}

const requireStringArray = (value: unknown[], path: string): string[] => {
  value.forEach((item, index) => {
    if (typeof item !== 'string' || item.trim().length === 0) {
      fail(`${path}[${index}]`, 'a non-empty string')
    }
  })

  return value as string[]
}

const assertOptionArray = <Value extends string>(
  value: unknown[],
  allowedValues: readonly Value[],
  path: string,
): void => {
  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`
    const option = requireObject(item, itemPath)
    assertOneOf(
      requireString(option, 'value', itemPath),
      allowedValues,
      `${itemPath}.value`,
    )
    requireString(option, 'label', itemPath)
  })
}

const requireImage = (value: unknown, path: string): EventImage => {
  const image = requireObject(value, path)

  requireString(image, 'src', path)
  requireStringField(image, 'alt', path)

  return image as EventImage
}

const assertIcon = (
  record: ContentRecord,
  key: string,
  path: string,
): MaterialIconName =>
  assertOneOf(requireString(record, key, path), materialIcons, `${path}.${key}`)

const assertNavItem = (value: unknown, path: string): void => {
  const navItem = requireObject(value, path)

  assertOneOf(requireString(navItem, 'id', path), pageIds, `${path}.id`)
  requireString(navItem, 'label', path)
}

const assertCelebrationDetail: ContentAssertion<CelebrationDetail> = (
  value,
  path,
) => {
  const detail = requireObject(value, path)

  assertIcon(detail, 'icon', path)
  requireString(detail, 'title', path)
  requireStringArray(requireArray(detail, 'lines', path), `${path}.lines`)
}

const assertScheduleEvent: ContentAssertion<ScheduleEvent> = (value, path) => {
  const event = requireObject(value, path)

  requireString(event, 'title', path)
  requireString(event, 'time', path)
  requireString(event, 'description', path)
  requireString(event, 'location', path)
  assertIcon(event, 'icon', path)
  requireImage(event.image, `${path}.image`)
  assertOneOf(
    requireString(event, 'imageSide', path),
    imageSides,
    `${path}.imageSide`,
  )
}

const assertScheduleDay: ContentAssertion<ScheduleDay> = (value, path) => {
  const day = requireObject(value, path)

  requireString(day, 'date', path)
  requireString(day, 'title', path)
  requireArray(day, 'events', path).forEach((event, index) =>
    assertScheduleEvent(event, `${path}.events[${index}]`),
  )
}

const assertRegistryItem: ContentAssertion<RegistryItem> = (value, path) => {
  const item = requireObject(value, path)

  requireString(item, 'title', path)
  requireString(item, 'description', path)
  requireString(item, 'cta', path)
  requireImage(item.image, `${path}.image`)
  assertOneOf(
    requireString(item, 'variant', path),
    registryVariants,
    `${path}.variant`,
  )
}

const assertVenueDetail: ContentAssertion<VenueDetail> = (value, path) => {
  const detail = requireObject(value, path)

  assertIcon(detail, 'icon', path)
  requireString(detail, 'label', path)
  requireString(detail, 'value', path)
}

const assertTravelVenue: ContentAssertion<TravelVenue> = (value, path) => {
  const venue = requireObject(value, path)

  requireString(venue, 'title', path)
  requireString(venue, 'description', path)
  requireString(venue, 'mapUrl', path)
  requireString(venue, 'mapCta', path)
  requireArray(venue, 'details', path).forEach((detail, index) =>
    assertVenueDetail(detail, `${path}.details[${index}]`),
  )
  requireImage(venue.image, `${path}.image`)
}

const assertHotel = (value: unknown, path: string): void => {
  const hotel = requireObject(value, path)

  requireString(hotel, 'title', path)
  requireString(hotel, 'distance', path)
  requireString(hotel, 'description', path)
  requireImage(hotel.image, `${path}.image`)
  requireString(hotel, 'buttonLabel', path)
  requireBoolean(hotel, 'featured', path)
}

const assertTravelTip: ContentAssertion<TravelTip> = (value, path) => {
  const tip = requireObject(value, path)

  assertIcon(tip, 'icon', path)
  requireString(tip, 'title', path)
  requireString(tip, 'description', path)
}

const assertTravelFeature: ContentAssertion<TravelFeature> = (value, path) => {
  const feature = requireObject(value, path)

  requireImage(feature.image, `${path}.image`)
  requireString(feature, 'caption', path)
}

export const validateContent = <Content>(
  name: string,
  value: unknown,
  assertion: ContentAssertion<Content>,
): Content => {
  assertion(value, name)

  return value
}

export const assertSiteContent: ContentAssertion<SiteContent> = (value, path) => {
  const site = requireObject(value, path)
  const weddingDate = requireString(site, 'weddingDate', path)

  requireString(site, 'coupleName', path)

  if (Number.isNaN(Date.parse(weddingDate))) {
    fail(`${path}.weddingDate`, 'a parseable date string')
  }

  requireArray(site, 'navItems', path).forEach((item, index) =>
    assertNavItem(item, `${path}.navItems[${index}]`),
  )

  const footer = requireObjectField(site, 'footer', path)
  requireString(footer, 'copyrightName', `${path}.footer`)
  requireString(footer, 'message', `${path}.footer`)
}

export const assertHomeContent: ContentAssertion<HomeContent> = (value, path) => {
  const home = requireObject(value, path)

  const hero = requireObjectField(home, 'hero', path)
  requireString(hero, 'eyebrow', `${path}.hero`)
  requireString(hero, 'firstName', `${path}.hero`)
  requireString(hero, 'secondName', `${path}.hero`)
  requireString(hero, 'date', `${path}.hero`)
  requireString(hero, 'location', `${path}.hero`)
  requireImage(hero.image, `${path}.hero.image`)
  requireString(hero, 'scrollLabel', `${path}.hero`)

  const countdown = requireObjectField(home, 'countdown', path)
  requireString(countdown, 'ariaLabel', `${path}.countdown`)
  const labels = requireObjectField(countdown, 'labels', `${path}.countdown`)
  requireString(labels, 'days', `${path}.countdown.labels`)
  requireString(labels, 'hours', `${path}.countdown.labels`)
  requireString(labels, 'minutes', `${path}.countdown.labels`)

  const details = requireObjectField(home, 'details', path)
  requireString(details, 'title', `${path}.details`)
  requireString(details, 'primaryCta', `${path}.details`)
  requireString(details, 'secondaryCta', `${path}.details`)
  requireString(details, 'contactCta', `${path}.details`)
  requireArray(details, 'items', `${path}.details`).forEach((item, index) =>
    assertCelebrationDetail(item, `${path}.details.items[${index}]`),
  )
}

export const assertScheduleContent: ContentAssertion<ScheduleContent> = (
  value,
  path,
) => {
  const schedule = requireObject(value, path)
  const intro = requireObjectField(schedule, 'intro', path)

  requireString(intro, 'title', `${path}.intro`)
  requireString(intro, 'copy', `${path}.intro`)
  requireString(intro, 'dividerText', `${path}.intro`)
  requireArray(schedule, 'days', path).forEach((day, index) =>
    assertScheduleDay(day, `${path}.days[${index}]`),
  )
}

export const assertRegistryContent: ContentAssertion<RegistryContent> = (
  value,
  path,
) => {
  const registry = requireObject(value, path)
  const hero = requireObjectField(registry, 'hero', path)

  requireString(hero, 'eyebrow', `${path}.hero`)
  requireString(hero, 'title', `${path}.hero`)
  requireString(hero, 'message', `${path}.hero`)
  requireString(hero, 'signature', `${path}.hero`)
  requireArray(registry, 'items', path).forEach((item, index) =>
    assertRegistryItem(item, `${path}.items[${index}]`),
  )

  const partners = requireObjectField(registry, 'partners', path)
  requireString(partners, 'title', `${path}.partners`)
  requireString(partners, 'cta', `${path}.partners`)
  requireStringArray(
    requireArray(partners, 'items', `${path}.partners`),
    `${path}.partners.items`,
  )
}

export const assertTravelContent: ContentAssertion<TravelContent> = (
  value,
  path,
) => {
  const travel = requireObject(value, path)
  const hero = requireObjectField(travel, 'hero', path)

  requireString(hero, 'eyebrow', `${path}.hero`)
  requireString(hero, 'title', `${path}.hero`)
  assertTravelVenue(travel.venue, `${path}.venue`)

  const stay = requireObjectField(travel, 'stay', path)
  requireString(stay, 'title', `${path}.stay`)
  requireString(stay, 'copy', `${path}.stay`)
  requireArray(stay, 'hotels', `${path}.stay`).forEach((hotel, index) =>
    assertHotel(hotel, `${path}.stay.hotels[${index}]`),
  )

  const gettingThere = requireObjectField(travel, 'gettingThere', path)
  requireString(gettingThere, 'title', `${path}.gettingThere`)
  requireString(gettingThere, 'copy', `${path}.gettingThere`)
  requireArray(gettingThere, 'tips', `${path}.gettingThere`).forEach(
    (tip, index) =>
      assertTravelTip(tip, `${path}.gettingThere.tips[${index}]`),
  )

  assertTravelFeature(travel.feature, `${path}.feature`)
}

export const assertRsvpContent: ContentAssertion<RsvpContent> = (value, path) => {
  const rsvp = requireObject(value, path)
  const hero = requireObjectField(rsvp, 'hero', path)

  requireString(hero, 'title', `${path}.hero`)
  requireString(hero, 'message', `${path}.hero`)
  requireImage(rsvp.decorativeImage, `${path}.decorativeImage`)

  const form = requireObjectField(rsvp, 'form', path)
  requireStringField(form, 'recipientEmail', `${path}.form`)
  requireString(form, 'guestNamesLabel', `${path}.form`)
  requireString(form, 'guestNamesPlaceholder', `${path}.form`)
  requireString(form, 'attendanceLabel', `${path}.form`)
  assertOptionArray(
    requireArray(form, 'attendanceOptions', `${path}.form`),
    attendanceValues,
    `${path}.form.attendanceOptions`,
  )
  requireString(form, 'dietaryPlaceholder', `${path}.form`)
  requireString(form, 'messageLabel', `${path}.form`)
  requireString(form, 'messagePlaceholder', `${path}.form`)
  requireString(form, 'submitLabel', `${path}.form`)
  requireString(form, 'thanksMessage', `${path}.form`)
  requireString(form, 'confirmationMessage', `${path}.form`)
}
