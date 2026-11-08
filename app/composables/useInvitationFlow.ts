import { OPTION_IDS, MAX_PREFERRED_DATES } from '#shared/invitation/constants'
import { UUID, isEligibleDate, validTimes } from '#shared/invitation/validation'
import type {
  InvitationDraft,
  InvitationSubmission
} from '#shared/invitation/types'
const fresh = (): InvitationDraft => ({
  version: 1,
  sessionId: '',
  accepted: false,
  dates: [],
  multiple: false,
  dateChoice: false,
  pickup: '11:00',
  dropoff: '22:00',
  itinerary: '',
  submitted: false
})
export function useInvitationFlow() {
  const draft = useState<InvitationDraft>('invitation', fresh)
  const ready = useState('invitation-ready', () => false)
  const storageWarning = useState('storage-warning', () => false)
  const pending = useState('submission-pending', () => false)
  function hydrate() {
    if (!import.meta.client || ready.value) return
    try {
      const p = JSON.parse(localStorage.getItem('little-date-v1') || 'null')
      if (
        p?.version === 1 &&
        typeof p.sessionId === 'string' &&
        UUID.test(p.sessionId) &&
        p.accepted === true
      ) {
        draft.value = {
          ...fresh(),
          sessionId: p.sessionId,
          accepted: true,
          dates: Array.isArray(p.dates)
            ? [...new Set<string>(p.dates.filter(isEligibleDate))]
                .slice(0, MAX_PREFERRED_DATES)
                .sort()
            : [],
          multiple: p.multiple === true,
          dateChoice: p.dateChoice === true,
          pickup: p.submitted === true ? p.pickup : '11:00',
          dropoff: p.submitted === true ? p.dropoff : '22:00',
          itinerary: OPTION_IDS.includes(p.itinerary) ? p.itinerary : '',
          submitted: p.submitted === true
        }
      }
    } catch {
      storageWarning.value = true
    }
    ready.value = true
  }
  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem('little-date-v1', JSON.stringify(draft.value))
    } catch {
      storageWarning.value = true
    }
  }
  function accept() {
    hydrate()
    if (!draft.value.sessionId) draft.value.sessionId = crypto.randomUUID()
    draft.value.accepted = true
    persist()
    return navigateTo(draft.value.submitted ? '/thank-you' : '/dates')
  }
  function payload(): InvitationSubmission {
    return {
      session_id: draft.value.sessionId,
      accepted: true,
      preferred_dates: [...draft.value.dates].sort(),
      pickup_time: '11:00',
      dropoff_time: '22:00',
      selected_itinerary_id: draft.value
        .itinerary as InvitationSubmission['selected_itinerary_id'],
      schema_version: 1
    }
  }
  const timesValid = computed(() =>
    validTimes(draft.value.pickup, draft.value.dropoff)
  )
  return {
    draft,
    ready,
    storageWarning,
    pending,
    hydrate,
    persist,
    accept,
    payload,
    timesValid
  }
}
