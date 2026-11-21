import { OPTION_IDS, MAX_PREFERRED_DATES } from '#shared/invitation/constants'
import { UUID, isEligibleDate, validTimes } from '#shared/invitation/validation'
import type {
  InvitationDraft,
  InvitationSubmission
} from '#shared/invitation/types'
// crypto.randomUUID only exists in secure contexts (HTTPS/localhost), so build
// a v4 UUID from getRandomValues when testing over plain HTTP on the LAN.
function newSessionId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6]! & 0x0f) | 0x40
  b[8] = (b[8]! & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}
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
    if (!draft.value.sessionId) draft.value.sessionId = newSessionId()
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
