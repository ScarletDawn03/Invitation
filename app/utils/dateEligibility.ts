export { isEligibleDate } from '#shared/invitation/validation'
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kuala_Lumpur'
  }).format(new Date(`${date}T00:00:00+08:00`))
}
