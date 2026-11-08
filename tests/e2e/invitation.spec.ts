import { test, expect } from '@playwright/test'
async function fillFlow(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByRole('button', { name: "Yes, I'd love to" }).click()
  await page.getByRole('button', { name: 'Saturday, 14 November 2026' }).click()
  await page.getByRole('button', { name: 'Sunday, 27 December 2026' }).click()
  await page.getByRole('link', { name: "Let's choose a plan" }).click()
  await page.getByText('Explore the day').first().click()
  await expect(
    page.getByRole('heading', {
      name: 'Kenny Hills Bakers On The Park',
      exact: true
    })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Choose Option B' }).click()
  await page.getByRole('link', { name: 'Review my choice' }).click()
  await expect(page).toHaveURL(/review/)
  await expect(
    page.getByRole('button', { name: 'Submit my preferences' })
  ).toBeVisible()
}
test('No shrinks and Yes grows within usable limits', async ({ page }) => {
  await page.goto('/')
  const yes = page.getByRole('button', { name: "Yes, I'd love to" })
  const no = page.getByRole('button', { name: 'No, thank you' })
  const initialYes = await yes.boundingBox()
  const initialNo = await no.boundingBox()
  for (let i = 0; i < 5; i++) await no.click()
  await expect(yes).toHaveCSS('min-height', '79px')
  await expect(no).toHaveCSS('min-height', '44px')
  await expect(yes).toHaveCSS('font-size', '19px')
  await expect(no).toHaveCSS('font-size', '11px')
  for (let i = 0; i < 8; i++) await no.click()
  await expect(yes).toHaveCSS('min-height', '79px')
  await expect(no).toHaveCSS('min-height', '44px')
  const finalYes = await yes.boundingBox()
  const finalNo = await no.boundingBox()
  expect(finalYes!.height).toBeGreaterThan(initialYes!.height)
  expect(finalNo!.height).toBeLessThan(initialNo!.height)
  expect(finalNo!.height).toBeGreaterThanOrEqual(44)
  for (const box of [finalYes!, finalNo!]) {
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width)
  }
  expect(
    await page.evaluate(() => localStorage.getItem('little-date-v1'))
  ).toBeNull()
  await yes.click()
  await expect(page).toHaveURL(/dates$/)
})
test('mobile flow recovers choices and handles failed submission', async ({
  page
}) => {
  await page.route('**/functions/v1/submit-invitation', (route) =>
    route.abort()
  )
  await fillFlow(page)
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Made Together' })
  ).toBeVisible()
  await expect(page.getByText('Saturday, 14 November 2026')).toBeVisible()
  await expect(page.getByText('Sunday, 27 December 2026')).toBeVisible()
  await page.getByRole('button', { name: 'Submit my preferences' }).click()
  await expect(page.getByRole('alert')).toContainText('could not be sent')
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
})
test('direct incomplete routes redirect safely', async ({ page }) => {
  await page.goto('/review')
  await expect(page).toHaveURL(/\/$/)
  await page.goto('/thank-you')
  await expect(page.getByText('No submitted response')).toBeVisible()
})

test('submission retries recover and rapid clicks send only once', async ({
  page
}) => {
  let attempts = 0
  await page.route('**/functions/v1/submit-invitation', async (route) => {
    attempts++
    if (attempts === 1) return route.abort()
    await new Promise((resolve) => setTimeout(resolve, 350))
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true })
    })
  })
  await fillFlow(page)
  await page.getByRole('button', { name: 'Submit my preferences' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await page
    .getByRole('button', { name: 'Submit my preferences' })
    .evaluate((button: HTMLButtonElement) => {
      button.click()
      button.click()
      button.click()
    })
  await expect(page).toHaveURL(/thank-you/)
  expect(attempts).toBe(2)
  await page.reload()
  await expect(page.locator('.confirmation-receipt')).toBeVisible()
})
test('venue images load and recover with local fallbacks', async ({ page }) => {
  await fillFlow(page)
  await page.getByRole('link', { name: 'Edit selected itinerary' }).click()
  await page.getByText('Explore the day').first().click()
  const card = page.locator('.option-card').first()
  const photos = [
    {
      image: card.locator('.stop-card img').first(),
      file: /kenny-trx.jpg$/,
      fallback: /lunch-fallback.svg$/
    },
    {
      image: card.locator('.option-cover'),
      file: /aurum.webp$/,
      fallback: /activity-fallback.svg$/
    }
  ]
  for (const { image, file } of photos) {
    await expect(image).toHaveAttribute('src', file)
    await expect
      .poll(() =>
        image.evaluate((img) => (img as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0)
  }
  await page.route(
    '**/images/itinerary/venues/{kenny-trx.jpg,aurum.webp}',
    (route) => route.abort()
  )
  await page.reload()
  await page.getByText('Explore the day').first().click()
  for (const { image, fallback } of photos) {
    await expect(image).toHaveAttribute('src', fallback)
    await expect
      .poll(() =>
        image.evaluate((img) => (img as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0)
  }
  await expect(card.getByRole('link', { name: /Photo: GSC/ })).toHaveCount(0)
})

test('pending submission blocks edits and saves the acknowledged choices', async ({
  page
}) => {
  let acknowledge!: () => void
  const response = new Promise<void>((resolve) => {
    acknowledge = resolve
  })
  let sent: Record<string, unknown> | undefined
  await page.route('**/functions/v1/submit-invitation', async (route) => {
    sent = route.request().postDataJSON()
    await response
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"ok":true}'
    })
  })
  await fillFlow(page)
  await page.getByRole('button', { name: 'Submit my preferences' }).click()
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'true')
  const edit = page.locator('a[aria-label="Edit selected itinerary"]')
  expect(await edit.evaluate((link) => Boolean(link.closest('[inert]')))).toBe(
    true
  )
  // Programmatic clicks bypass inert; middleware must still prevent navigation.
  await edit.evaluate((link: HTMLAnchorElement) => link.click())
  await page
    .locator('.wordmark')
    .evaluate((link: HTMLAnchorElement) => link.click())
  await expect(page).toHaveURL(/review$/)
  acknowledge()
  await expect(page).toHaveURL(/thank-you$/)
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('little-date-v1')!)
  )
  expect(saved.submitted).toBe(true)
  expect(saved.itinerary).toBe(sent?.selected_itinerary_id)
  expect(saved.dates).toEqual(sent?.preferred_dates)
  expect(sent?.pickup_time).toBe('11:00')
  expect(sent?.dropoff_time).toBe('22:00')
  expect(saved.pickup).toBe(sent?.pickup_time)
  expect(saved.dropoff).toBe(sent?.dropoff_time)
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
})
test('responsive layout fits desktop and small phones', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: /Would you like/ })
  ).toBeVisible()
  await page.screenshot({ path: '/tmp/invitation-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: '/tmp/invitation-mobile.png', fullPage: true })
  await page.getByRole('button', { name: "Yes, I'd love to" }).click()
  await page.setViewportSize({ width: 320, height: 740 })
  await expect(
    page.getByRole('button', { name: 'Saturday, 14 November 2026' })
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  await page.screenshot({
    path: '/tmp/invitation-dates-small.png',
    fullPage: true
  })
  expect(errors).toEqual([])
})

test('date selection skips timing and old timing links open the plans', async ({
  page
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: "Yes, I'd love to" }).click()
  await page.getByRole('button', { name: 'Saturday, 14 November 2026' }).click()
  await page.getByRole('link', { name: "Let's choose a plan" }).click()
  await expect(page).toHaveURL(/itinerary$/)
  await expect(
    page.getByRole('navigation', { name: 'Invitation progress' }).locator('li')
  ).toHaveCount(3)
  await page.goto('/times')
  await expect(page).toHaveURL(/itinerary$/)
  await page.getByRole('button', { name: 'Choose Option B' }).click()
  await page.getByRole('link', { name: 'Review my choice' }).click()
  await expect(
    page.getByRole('link', { name: 'Edit preferred times' })
  ).toHaveCount(0)
  await expect(
    page.getByText('Suggested pickup: 11:00 AM', { exact: false })
  ).toBeVisible()
})

test('decide together is a valid alternative and preserves dates', async ({
  page
}) => {
  await page.route('**/functions/v1/submit-invitation', async (route) => {
    expect(route.request().postDataJSON().selected_itinerary_id).toBe(
      'decide-together'
    )
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"ok":true}'
    })
  })
  await fillFlow(page)
  await page.getByRole('link', { name: 'Edit selected itinerary' }).click()
  await page.getByRole('button', { name: /Let’s decide together/ }).click()
  await page.reload()
  await expect(
    page.getByRole('button', { name: /Let’s decide together/ })
  ).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('link', { name: 'Review my choice' }).click()
  await expect(
    page.getByRole('heading', { name: 'We’ll decide together' })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Submit my preferences' }).click()
  await expect(page).toHaveURL(/thank-you$/)
  await expect(page.getByText('Saturday, 14 November 2026')).toBeVisible()
})

test('December 19–31 is available while December 18 stays unavailable', async ({
  page
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: "Yes, I'd love to" }).click()
  await expect(
    page.getByRole('button', {
      name: 'Thursday, 17 December 2026',
      exact: true
    })
  ).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Friday, 18 December 2026', exact: true })
  ).toBeDisabled()
  await expect(
    page.getByRole('button', {
      name: 'Saturday, 19 December 2026',
      exact: true
    })
  ).toBeEnabled()
  const lastDay = page.getByRole('button', {
    name: 'Thursday, 31 December 2026',
    exact: true
  })
  await lastDay.click()
  await expect(lastDay).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(lastDay).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('link', { name: "Let's choose a plan" }).click()
  await expect(page).toHaveURL(/itinerary$/)
})

test('plan comparison keeps selection and review reachable on mobile and desktop', async ({
  page
}) => {
  await fillFlow(page)
  await page.getByRole('link', { name: 'Edit selected itinerary' }).click()
  await expect(
    page.getByRole('heading', { name: /A few possibilities/ })
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Choose Option A' })
  ).toBeVisible()
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.screenshot({
      path: `/tmp/invitation-plans-${width}.png`,
      fullPage: true,
      animations: 'disabled'
    })
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByText('Explore the day').first().click()
  await expect(
    page.getByRole('button', { name: 'Choose Option A' })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Choose Option A' }).click()
  await expect(
    page.getByRole('link', { name: 'Review my choice' })
  ).toBeInViewport()
  await page.getByRole('link', { name: 'Review my choice' }).click()
  await expect(page.getByText('View the day’s schedule')).toBeVisible()
})
