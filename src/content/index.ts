import homeJson from './home.json'
import registryJson from './registry.json'
import rsvpJson from './rsvp.json'
import scheduleJson from './schedule.json'
import {
  assertHomeContent,
  assertRegistryContent,
  assertRsvpContent,
  assertScheduleContent,
  assertSiteContent,
  assertTravelContent,
  validateContent,
} from './schemas'
import siteJson from './site.json'
import travelJson from './travel.json'

export const site = validateContent('site', siteJson, assertSiteContent)
export const home = validateContent('home', homeJson, assertHomeContent)
export const schedule = validateContent(
  'schedule',
  scheduleJson,
  assertScheduleContent,
)
export const travel = validateContent('travel', travelJson, assertTravelContent)
export const registry = validateContent(
  'registry',
  registryJson,
  assertRegistryContent,
)
export const rsvp = validateContent('rsvp', rsvpJson, assertRsvpContent)
export const weddingDate = new Date(site.weddingDate)

export type * from './types'
