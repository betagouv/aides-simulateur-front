import { expect, test } from '@playwright/test'

test.describe('Subsidy simulator form', () => {
  const simulateurId = 'demenagement-logement'

  /**
   * Navigate to simulator page before each test
   */
  test.beforeEach(async ({ page }) => {
    await page.goto(`/simulateurs/${simulateurId}`)
    await page.waitForSelector('#simulateur-title', { state: 'visible' })
  })

  /**
   * Scénario 4.1 : Affichage d'un formulaire de simulation
   */
  test('should display welcome screen and start a new simulation', async ({ page }) => {
    // Check if welcome screen is visible
    await expect(page.getByText('Un simulateur en construction')).toBeVisible()

    // Click the start button
    await page.getByRole('button', { name: 'Commencer la simulation' }).click()

    // Verify the first question is displayed
    await expect(page.locator('.question-actual-container')).toBeVisible()
  })

  /**
   * Scénario 4.2 : Completion d'un formulaire jusqu'à la page de résultats avec mock de l'API
   */
  test('should complete the form and reach results page with mocked API', async ({ page }) => {
    // Setup API interception before starting the simulation
    await page.route('**/calculate', async (route) => {
      // Mock OpenFisca calculation response
      const mockResponse = {
          "individus": {
            "usager": {
              "activite": {
                "2025-03": "etudiant"
              },
              "stagiaire": {
                "2025-03": "stage"
              },
              "sortie_academie": {
                "2025-03": true
              },
              "boursier": {
                "2025-03": true
              },
              "date_naissance": {
                "ETERNITY": "1980-12-13"
              },
              "handicap": {
                "2025-03": true
              },
              "statut_marital": {
                "2025-03": "celibataire"
              },
              "salaire_imposable": {
                "month:2024-03:12": 100
              },
              "locapass_eligibilite": {
                "2025-03": null
              },
              "aide_mobilite_master": {
                "2025-03": null
              },
              "aide_mobilite_parcoursup": {
                "2025-03": null
              },
              "nationalite": {
                "2025-03": "FR"
              },
              "annee_etude": {
                "2025-03": "terminale"
              }
            }
          },
          "menages": {
            "menage_usager": {
              "personne_de_reference": [
                "usager"
              ],
              "conjoint": [],
              "enfants": [],
              "depcom": {
                "2025-03": "81202"
              },
              "statut_occupation_logement": {
                "2025-03": "locataire_vide"
              },
              "logement_conventionne": {
                "2025-03": false
              },
              "coloc": {
                "2025-03": false
              },
              "loyer": {
                "2025-03": 100
              },
              "charges_locatives": {
                "2025-03": 100
              },
              "visale_eligibilite": {
                "2025-03": null
              },
              "visale_montant_max": {
                "2025-03": null
              },
              "date_entree_logement": {
                "2025-03": "2025-04"
              }
            }
          },
          "foyers_fiscaux": {
            "foyer_fiscal_usager": {
              "declarants": [
                "usager"
              ],
              "personnes_a_charge": []
            }
          },
          "familles": {
            "famille_usager": {
              "parents": [
                "usager"
              ],
              "enfants": [],
              "proprietaire_proche_famille": {
                "2025-03": true
              },
              "bourse_lycee": {
                "2025-03": 1
              },
              "apl": {
                "2025-03": null
              }
            }
          }
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      })
    })

    // Mock store-form-data API
    await page.route('**/api/store-form-data', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          filename: 'test-mock-filename.json'
        })
      })
    })

    // Mock commune autocomplete API
    await page.route('**/communes/autocomplete**', async (route) => {
      // Mock response for communes autocomplete
      const mockSuggestions = [
        {
          code: '75056',
          autocompletion: 'Paris (75001)',
          libelle: 'Paris',
          code_departement: '75',
          code_region: '11',
          population: 2165423,
          codesPostaux: ['75001', '75002', '75003', '75004', '75005']
        },
        {
          code: '13055',
          autocompletion: 'Marseille (13001)',
          libelle: 'Marseille',
          code_departement: '13',
          code_region: '93',
          population: 861635,
          codesPostaux: ['13001', '13002', '13003', '13004', '13005']
        },
        {
          code: '69123',
          autocompletion: 'Lyon (69001)',
          libelle: 'Lyon',
          code_departement: '69',
          code_region: '84',
          population: 513275,
          codesPostaux: ['69001', '69002', '69003', '69004', '69005']
        }
      ]

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ suggestions: mockSuggestions })
      })
    })

    // Start the simulation
    await page.getByRole('button', { name: 'Commencer la simulation' }).click()

    // Function to answer the current question based on its type
    async function answerCurrentQuestion () {
      // Wait for question container to be visible
      await page.waitForSelector('.question-container', { state: 'visible' })

      // Determine question type and answer accordingly
      if (await page.locator('input[type="radio"]').count() > 0) {
        /**
         * We click on the label instead of directly checking the input to match DSFR implementation
         */
        const radioLabel = page.locator('.fr-radio-group label').first()
        await radioLabel.click()
      }
      else if (await page.locator('input[type="checkbox"]').count() > 0) {
        /**
         * We click on the label instead of directly checking the input to match DSFR implementation
         */
        const checkboxLabel = page.locator('.fr-checkbox-group label').first()
        await checkboxLabel.click()
      }
      else if (await page.locator('input[type="number"]').count() > 0) {
        // Wait to ensure field is ready
        await page.waitForSelector('input[type="number"]', { state: 'visible' })
        await page.locator('input[type="number"]').fill('1000')
      }
      else if (await page.locator('input[type="date"]').count() > 0) {
        // Wait to ensure field is ready
        await page.waitForSelector('input[type="date"]', { state: 'visible' })
        await page.locator('input[type="date"]').fill('1980-01-01')
      }
      else if (await page.locator('input[type="text"]').count() > 0) {
        // Wait to ensure field is ready
        await page.waitForSelector('input[type="text"]', { state: 'visible' })

        // Check if this is a text field with autocomplete (commune selection)
        const isAutocompleteField = await page.locator('.autocomplete-container').count() > 0

        if (isAutocompleteField) {
          try {
            // This is a commune selection field with autocomplete
            // console.log('Found autocomplete field, handling it...')

            // Fill the text field to trigger autocomplete
            const textInput = page.locator('.autocomplete-container input[type="text"]')
            await textInput.fill('Paris')

            // Wait for suggestions to appear
            await page.waitForSelector('.suggestions-container', { state: 'visible', timeout: 1000 })

            // Click on the first suggestion
            await page.locator('.suggestion-item').first().click()

            // Verify a tag was selected
            await page.waitForSelector('.selected-tag-container', { state: 'visible' })
            // console.log('Successfully selected commune from autocomplete')
          } catch (error) {
            console.error('Error handling autocomplete:', error)
          }
        }
        else {
          // Regular text field
          await page.locator('input[type="text"]').fill('Test response')
        }
      }

      // Click next button to proceed to next question or results page
      const nextButton = page.getByRole('button', { name: /Suivant|Terminer/ })
      await nextButton.scrollIntoViewIfNeeded()
      // Make sure the button is visible and enabled
      await expect(nextButton).toBeVisible()
      await expect(nextButton).toBeEnabled()
      await nextButton.click({ force: true })
    }

    // Track the maximum number of questions to prevent infinite loops
    const maxQuestions = 30
    let questionCount = 0
    let isCompleted = false

    while (!isCompleted && questionCount < maxQuestions) {
      try {
        await answerCurrentQuestion()
        // console.log('Completed question', questionCount)
        // await page.screenshot({ path: `./tests/e2e/screenshots/question-${questionCount}.png` })
        questionCount++
        if (questionCount >= maxQuestions) {
          page.screenshot({ path: './tests/e2e/screenshots/max-questions-reached.png' })
          throw new Error('Exceeded maximum question count')
        }

        // Check if we've been redirected to results page
        if (page.url().includes('/resultats')) {
          console.log('Reached results page!')
          isCompleted = true
          console.log('Reached results page!')
          break
        }

        // Check if there's a loading state that indicates form submission
        const isLoading = await page.getByText('Estimation en cours...').isVisible()
        const hasLoaded = await page.getByText('Estimation terminée').isVisible()
        if (isLoading || hasLoaded) {
          // console.log('Found loading state, waiting for results page...')
          // Wait for redirect to results page
          await page.waitForURL(`**/simulateurs/${simulateurId}/resultats**`, { timeout: 10000 })
            .catch(err => console.log('Timeout waiting for results page:', err))

          isCompleted = true
          break
        }
      }
      catch (error) {
        console.error(`Error at question ${questionCount}:`, error)
      }
    }

    // take a screenshot of the results page
    await page.screenshot({ path: './tests/e2e/screenshots/simulation-results.png' })

    // Verify we've been redirected to results page
    await page.waitForURL(`**/simulateurs/${simulateurId}/resultats**`, { timeout: 10000 })
    expect(page.url()).toContain(`/simulateurs/${simulateurId}/resultats`)

    // We should then verify results page elements
  })
})
