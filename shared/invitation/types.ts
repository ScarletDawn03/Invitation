import type { OPTION_IDS } from './constants.ts'
export type ItineraryId = (typeof OPTION_IDS)[number]
export interface InvitationSubmission {
  session_id: string
  accepted: true
  preferred_dates: string[]
  pickup_time: string
  dropoff_time: string
  selected_itinerary_id: ItineraryId
  schema_version: 1
}
export interface InvitationDraft {
  version: 1
  sessionId: string
  accepted: boolean
  dates: string[]
  multiple: boolean
  dateChoice: boolean
  pickup: string
  dropoff: string
  itinerary: ItineraryId | ''
  submitted: boolean
}
