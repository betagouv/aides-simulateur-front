import { expect, test } from '@playwright/test'

/**
 * Scénario 1 : Page d'accueil accessible avec lien vers "Déménagement & logement"
 */
test('homepage loads successfully with link to housing simulator', async ({ page }) => {
  // Check that the page loads with 200 status
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)

  // Check that there's a clickable link to "Déménagement & logement" simulator
  const demenagementLink = page.getByRole('link', { name: 'Déménagement & logement' })
  await expect(demenagementLink).toBeVisible()
  await expect(demenagementLink).toBeEnabled()

  // Verify the href attribute points to the correct simulator
  const href = await demenagementLink.getAttribute('href')
  expect(href).toContain('/simulateurs/demenagement-logement')
})

/**
 * Scénario 2 : Vérification du menu, footer et liens vers pages statiques
 */
test('homepage displays menu, footer and links to static pages', async ({ page }) => {

  await page.goto('/')

  // Check that the header title is correct
  await expect(page.locator('.fr-header__service-title').first()).toHaveText('aides simplifiées')

  // Get the current viewport width
  const viewportWidth = await page.evaluate(() => window.innerWidth)
  const navMenu = page.locator('[aria-label="Menu principal"]')

  // Determine if we're on mobile viewport (below 768px is mobile in DSFR)
  if (viewportWidth >= 768) {
    // On desktop, the navigation should be visible by default
    await expect(navMenu).toBeVisible()
  } else {
    // On mobile, the navigation menu is hidden by default
    await expect(navMenu).not.toBeVisible()

    // Click the nav toggler button to show the menu
    const navToggler = page.locator('[data-testid="open-menu-btn"]')
    await expect(navToggler).toBeVisible()
    await navToggler.click()

    /**
     * THIS DOESN'T WORK
     */
    await page.waitForTimeout(300)
    page.screenshot({ path: 'tests/e2e/screenshots/menu-should-be-open.png' })
    await expect(navMenu).toBeVisible()

    navToggler.click()
    await page.waitForTimeout(300)
    await expect(navMenu).not.toBeVisible()
  }

  // Check footer exists
  const footer = page.locator('.fr-footer')
  await expect(footer).toBeVisible()

  // Check that footer contains links to static pages
  const footerLinks = [
    { name: 'Accessibilité', url: '/content/accessibilite' },
    { name: 'Mentions légales', url: '/content/mentions-legales' },
    { name: 'Données personnelles', url: '/content/donnees-personnelles' },
    { name: 'Gestion des cookies', url: '/content/gestion-cookies' },
  ]

  for (const link of footerLinks) {
    const footerLink = page.getByRole('link', { name: link.name }).first()
    await expect(footerLink).toBeVisible()
  }

  // Test the contact page specifically
  const contactLink = page.getByRole('link', { name: 'Contact' }).first()
  await contactLink.click()
  await page.waitForURL('**/contact')
  await expect(page).toHaveURL(/.*\/contact/)
  await expect(page.locator('h1')).toContainText('Contact')
})

/**
 * Scénario 3 : Accessibilité des pages /notions, /aides et leurs sous-pages
 */
test('notions and aides pages are accessible and navigable', async ({ page }) => {
  // Test /notions page
  await page.goto('/notions')
  await expect(page).toHaveURL('/notions')
  await expect(page.locator('h1')).toContainText('Notions')

  // Get the first notion link and navigate to it
  const firstNotionLink = page.locator('.fr-card a').first()
  const notionTitle = await firstNotionLink.textContent()
  await firstNotionLink.click()

  // Check we're on a notion detail page
  expect(page.url()).toContain('/notions')
  await expect(page.locator('h1')).toContainText(notionTitle || '')

  // Test /aides page
  await page.goto('/aides')
  await expect(page).toHaveURL('/aides')
  await expect(page.locator('h1')).toContainText('Aides')

  // Get the first aide link and navigate to it
  const firstAideLink = page.locator('.fr-card a').first()
  const aideTitle = await firstAideLink.textContent()
  await firstAideLink.click()

  // Check we're on an aide detail page
  expect(page.url()).toContain('/aides')
  await expect(page.locator('h1')).toContainText(aideTitle || '')
})
