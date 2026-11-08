import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname } from 'node:path'
import assert from 'node:assert/strict'
import { chromium, expect } from '@playwright/test'

const root = resolve('.output/public')
const base = process.env.NUXT_APP_BASE_URL || '/Invitation/'
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
}
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname
    )
    if (!pathname.startsWith(base)) {
      res.writeHead(404).end()
      return
    }
    let file = resolve(root, pathname.slice(base.length) || '.')
    if (file !== root && !file.startsWith(root + '/')) {
      res.writeHead(403).end()
      return
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html')
    res.setHeader(
      'Content-Type',
      types[extname(file)] || 'application/octet-stream'
    )
    res.end(await readFile(file))
  } catch {
    res.writeHead(404).end()
  }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`
let browser
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  let submissions = 0
  // Never send static verification data to a configured backend.
  await page.route('**/functions/v1/submit-invitation', async (route) => {
    submissions++
    assert.equal(
      route.request().postDataJSON().selected_itinerary_id,
      'option-b'
    )
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"ok":true}'
    })
  })
  await page.addInitScript(() =>
    localStorage.setItem(
      'little-date-v1',
      JSON.stringify({
        version: 1,
        sessionId: '12345678-1234-4234-8234-123456789012',
        accepted: true,
        dates: ['2026-11-14'],
        multiple: false,
        dateChoice: true,
        pickup: '11:00',
        dropoff: '21:00',
        itinerary: 'option-b',
        submitted: false
      })
    )
  )
  for (const path of ['', 'dates', 'itinerary', 'review', 'thank-you']) {
    const response = await page.goto(`${origin}${base}${path}`)
    assert.equal(response.status(), 200, `${path || '/'} static entry exists`)
    await page.locator('h1').waitFor({ state: 'visible' })
    assert.equal(new URL(page.url()).pathname, `${base}${path}`)
    assert.ok(
      await page.locator('h1').innerText(),
      'page renders after hydration'
    )
  }
  await page.goto(`${origin}${base}itinerary`)
  await page.locator('summary').first().click()
  const image = page.locator('.stop-card img').first()
  await image.waitFor({ state: 'visible' })
  const cover = page.locator('.option-cover').first()
  for (const photo of [image, cover]) {
    await expect(photo).toHaveAttribute(
      'src',
      `${base}images/itinerary/venues/pavilion.webp`
    )
    await expect
      .poll(() => photo.evaluate((img) => img.naturalWidth))
      .toBeGreaterThan(0)
  }
  // Exercise a real failed request so both covers and stops must recover.
  await page.route('**/images/itinerary/venues/pavilion.webp', (route) =>
    route.abort()
  )
  await page.reload()
  await page.locator('summary').first().click()
  for (const fallback of [image, cover]) {
    await expect(fallback).toHaveAttribute(
      'src',
      `${base}illustrations/lunch-fallback.svg`
    )
    await expect
      .poll(() => fallback.evaluate((img) => img.naturalWidth))
      .toBeGreaterThan(0)
  }
  await page.goto(`${origin}${base}review`)
  await page.getByRole('button', { name: 'Submit my preferences' }).click()
  await expect
    .poll(async () => {
      if (new URL(page.url()).pathname === `${base}thank-you`)
        return 'confirmed'
      const alert = page.getByRole('alert')
      return (await alert.count()) ? await alert.innerText() : ''
    })
    .toMatch(/confirmed|Sending is not set up/)
  if (submissions) {
    assert.equal(submissions, 1)
    await expect(
      page.locator('.confirmation-receipt')
    ).toBeVisible()
  } else {
    await expect(page.getByRole('alert')).toContainText('Sending is not set up')
  }
  assert.deepEqual(errors, [])
  console.log(
    'Static subpath checks passed: all six direct routes, local recovery, photo fallbacks, and submission handling (remote requests mocked).'
  )
} finally {
  await browser?.close()
  await new Promise((resolve) => server.close(resolve))
}
