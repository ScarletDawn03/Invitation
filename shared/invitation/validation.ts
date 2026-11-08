import {
  DATE_START,
  DATE_END,
  FULL_AVAILABILITY_START,
  MAX_PREFERRED_DATES,
  OPTION_IDS
} from './constants.ts'
import type { InvitationSubmission } from './types.ts'
export const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export function isEligibleDate(value: unknown): value is string {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value < DATE_START ||
    value > DATE_END ||
    value === '2026-11-15' ||
    value === '2026-12-13'
  )
    return false
  const day = new Date(`${value}T00:00:00Z`)
  return (
    !Number.isNaN(day.getTime()) &&
    day.toISOString().slice(0, 10) === value &&
    (value >= FULL_AVAILABILITY_START || [0, 6].includes(day.getUTCDay()))
  )
}
export function validTimes(pickup: string, dropoff: string) {
  const time = /^([01]\d|2[0-3]):[0-5]\d$/
  return time.test(pickup) && time.test(dropoff) && pickup < dropoff
}
export function validateSubmission(input: unknown): string | null {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return 'Please send a valid response.'
  const p = input as Record<string, unknown>
  const keys = [
    'session_id',
    'accepted',
    'preferred_dates',
    'pickup_time',
    'dropoff_time',
    'selected_itinerary_id',
    'schema_version'
  ]
  if (
    Object.keys(p).length !== keys.length ||
    Object.keys(p).some((k) => !keys.includes(k))
  )
    return 'Unexpected response fields.'
  if (typeof p.session_id !== 'string' || !UUID.test(p.session_id))
    return 'Please start your invitation again.'
  if (p.accepted !== true || p.schema_version !== 1)
    return 'This response version is not supported.'
  if (
    !Array.isArray(p.preferred_dates) ||
    !p.preferred_dates.length ||
    p.preferred_dates.length > MAX_PREFERRED_DATES ||
    !p.preferred_dates.every(isEligibleDate) ||
    new Set(p.preferred_dates).size !== p.preferred_dates.length
  )
    return 'Choose at least one available date.'
  if (
    typeof p.pickup_time !== 'string' ||
    typeof p.dropoff_time !== 'string' ||
    !validTimes(p.pickup_time, p.dropoff_time)
  )
    return 'Your home time should be later than your pickup time.'
  if (
    !OPTION_IDS.includes(
      p.selected_itinerary_id as InvitationSubmission['selected_itinerary_id']
    )
  )
    return 'Choose a plan or decide together.'
  return null
}
