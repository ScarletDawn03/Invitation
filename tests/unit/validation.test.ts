import { describe, it, expect } from 'vitest'
import {
  isEligibleDate,
  validTimes,
  validateSubmission
} from '../../shared/invitation/validation'
import { itineraries } from '../../app/data/itineraries'
const valid = () => ({
  session_id: '12345678-1234-4234-8234-123456789012',
  accepted: true,
  preferred_dates: ['2026-11-14'],
  pickup_time: '11:00',
  dropoff_time: '21:00',
  selected_itinerary_id: 'option-a',
  schema_version: 1
})
describe('date rules', () => {
  it('allows available weekends and every day from December 19 through 31', () => {
    const days = Array.from({ length: 61 }, (_, i) =>
      new Date(Date.UTC(2026, 10, i + 1)).toISOString().slice(0, 10)
    ).filter(isEligibleDate)
    expect(days).toHaveLength(21)
    expect(days[0]).toBe('2026-11-14')
    expect(days.at(-1)).toBe('2026-12-31')
    for (let day = 19; day <= 31; day++)
      expect(isEligibleDate(`2026-12-${day}`)).toBe(true)
    expect(isEligibleDate('2026-12-17')).toBe(false)
    expect(isEligibleDate('2026-12-18')).toBe(false)
    expect(validateSubmission({ ...valid(), preferred_dates: days })).toBeNull()
  })
  it.each([
    '2026-11-13',
    '2026-11-15',
    '2026-12-13',
    '2027-01-02',
    '2026-11-16',
    '2026-12-17',
    '2026-11-31',
    '2026-11-14T00:00:00Z',
    null
  ])('rejects %s', (value) => expect(isEligibleDate(value)).toBe(false))
})
describe('submission contract', () => {
  it('accepts a single or multiple dates and each alternative', () => {
    for (const selected_itinerary_id of [
      'option-a',
      'option-b',
      'option-c',
      'decide-together'
    ])
      expect(
        validateSubmission({
          ...valid(),
          selected_itinerary_id,
          preferred_dates: ['2026-11-14', '2026-12-27']
        })
      ).toBeNull()
  })
  it.each([
    { accepted: false },
    { preferred_dates: [] },
    { preferred_dates: ['2026-11-14', '2026-11-14'] },
    { preferred_dates: ['2026-11-16'] },
    { selected_itinerary_id: ['option-a', 'option-b'] },
    { selected_itinerary_id: 'option-d' },
    { pickup_time: '22:00' },
    { dropoff_time: '11:00' },
    { session_id: 'fake' },
    { schema_version: 2 },
    { unexpected: 'x'.repeat(3000) }
  ])('rejects invalid payload %j', (patch) =>
    expect(validateSubmission({ ...valid(), ...patch })).not.toBeNull()
  )
  it('keeps three ordered venue stops per option', () => {
    expect(itineraries).toHaveLength(3)
    for (const option of itineraries) {
      expect(option.stops.map((s) => s.type)).toEqual([
        'lunch',
        'activity',
        'dinner'
      ])
      expect(
        option.stops.every(
          (s) => s.venue && s.description && s.address && s.image
        )
      ).toBe(true)
    }
  })
  it('compares strictly formatted times', () => {
    expect(validTimes('09:00', '21:30')).toBe(true)
    for (const [a, b] of [
      ['9:00', '21:00'],
      ['24:00', '25:00'],
      ['12:60', '21:00'],
      ['12:00', '12:00'],
      ['23:00', '01:00']
    ])
      expect(validTimes(a!, b!)).toBe(false)
  })
})
