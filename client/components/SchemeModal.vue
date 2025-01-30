<script setup lang="ts">
import type { Preferences, UseSchemeResult } from '@gouvminint/vue-dsfr'
import darkThemeSvg from '@gouvfr/dsfr/dist/artwork/pictograms/environment/moon.svg'
import lightThemeSvg from '@gouvfr/dsfr/dist/artwork/pictograms/environment/sun.svg'
import systemThemeSvg from '@gouvfr/dsfr/dist/artwork/pictograms/system/system.svg'

const { isThemeModalOpen } = useDsfrScheme()

const preferences: Preferences = reactive({
  theme: 'light',
  scheme: 'light',
})

onMounted(() => {
  const { theme, scheme, setScheme } = useScheme() as UseSchemeResult
  preferences.scheme = scheme.value as 'light' | 'dark' | 'system'

  watchEffect(() => { preferences.theme = theme.value as 'light' | 'dark' })

  watchEffect(() => setScheme(preferences.scheme))
})

const options = [
  {
    label: 'Thème clair',
    value: 'light',
    svgPath: lightThemeSvg,
  },
  {
    label: 'Thème sombre',
    value: 'dark',
    svgPath: darkThemeSvg,
  },
  {
    label: 'Thème système',
    value: 'system',
    hint: 'Utilise les paramètres système',
    svgPath: systemThemeSvg,
  },
]
</script>

<template>
  <div class="fr-container fr-my-2v">
    <DsfrModal
      :opened="isThemeModalOpen"
      title="Changer le thème"
      @close="isThemeModalOpen = false"
    >
      <DsfrRadioButtonSet
        v-model="preferences.scheme"
        :options="options"
        name="theme-selector"
        legend="Choisissez un thème pour personnaliser l’apparence du site."
      />
    </DsfrModal>
  </div>
</template>
