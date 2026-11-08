import { createClient } from 'npm:@supabase/supabase-js@2'
import { validateSubmission } from '../../../shared/invitation/validation.ts'

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
// Nuxt uses 3001 when 3000 is occupied. Keep this opt-in to local development.
for (const host of ['localhost', '127.0.0.1', '0.0.0.0']) {
  if (allowedOrigins.includes(`http://${host}:3000`))
    allowedOrigins.push(`http://${host}:3001`)
}
Deno.serve(async (request: Request) => {
  const origin = request.headers.get('origin') || ''
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin)
      ? origin
      : 'null',
    'Access-Control-Allow-Headers': 'apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
    'Cache-Control': 'no-store'
  }
  const respond = (status: number, body: object) =>
    new Response(JSON.stringify(body), { status, headers })
  if (!allowedOrigins.includes(origin))
    return respond(403, {
      ok: false,
      error: 'This invitation origin is not allowed.'
    })
  if (request.method === 'OPTIONS')
    return new Response(null, { status: 204, headers })
  if (request.method !== 'POST')
    return respond(405, {
      ok: false,
      error: 'Please submit from the review page.'
    })
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return respond(415, { ok: false, error: 'Please send a JSON response.' })
  try {
    // Bound actual bytes, including chunked requests with no Content-Length.
    const reader = request.body?.getReader()
    if (!reader)
      return respond(400, { ok: false, error: 'Missing preferences.' })
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 2048) {
        await reader.cancel()
        return respond(413, { ok: false, error: 'This response is too large.' })
      }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) {
      bytes.set(chunk, offset)
      offset += chunk.byteLength
    }
    let payload: unknown
    try {
      payload = JSON.parse(new TextDecoder().decode(bytes))
    } catch {
      return respond(400, {
        ok: false,
        error: 'Please send valid preferences.'
      })
    }
    const error = validateSubmission(payload)
    if (error) return respond(400, { ok: false, error })
    const secret = Deno.env.get('RATE_LIMIT_SECRET')
    if (!secret)
      return respond(503, {
        ok: false,
        error: 'Sending is temporarily unavailable. Please try again later.'
      })
    // Supabase gateway supplies the forwarded client address. Do not log it.
    const address =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const hour = Math.floor(Date.now() / 3600000)
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const digest = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`${address}:${hour}`)
    )
    const bucket = Array.from(new Uint8Array(digest), (b) =>
      b.toString(16).padStart(2, '0')
    ).join('')
    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    const { data, error: dbError } = await db.rpc('submit_invitation', {
      p: payload,
      rate_bucket: bucket
    })
    if (dbError)
      return respond(503, {
        ok: false,
        error: 'Could not save your preferences. Please try again.'
      })
    if (data === 'rate_limited')
      return respond(429, {
        ok: false,
        error:
          'A few too many attempts. Your choices are saved — please try again in an hour.'
      })
    if (data === 'conflict')
      return respond(409, {
        ok: false,
        error:
          'This invitation has already been submitted with different preferences. Please contact the author to change them.'
      })
    if (!['created', 'duplicate'].includes(data))
      return respond(503, {
        ok: false,
        error: 'Could not confirm submission. Please try again.'
      })
    return respond(200, { ok: true })
  } catch {
    return respond(503, {
      ok: false,
      error:
        'Sending is temporarily unavailable. Your choices are safe to retry.'
    })
  }
})
