<script setup lang="ts">
import { Crisp } from 'crisp-sdk-web'

const CRISP_WEBSITE_ID = 'b50374f8-3b29-4704-8022-7640e7e73fc3'
Crisp.configure(CRISP_WEBSITE_ID, {
  autoload: false
})

const isChatOpened = ref(import.meta.client && Crisp.chat.isChatOpened())
function toggleChat () {
  if (isChatOpened.value) {
    Crisp.chat.close()
  }
  else {
    Crisp.chat.open()
  }
  isChatOpened.value = !isChatOpened.value
}
onMounted(() => {
  Crisp.chat.onChatOpened(() => {
    isChatOpened.value = true
  })
  Crisp.chat.onChatClosed(() => {
    isChatOpened.value = false
  })
})
</script>

<template>
  <DsfrButton
    icon-only
    :label="!isChatOpened ? 'Ouvrir la discussion Crisp' : 'Fermer la discussion Crisp'"
    :icon="{
      name: !isChatOpened ? 'ri:questionnaire-fill' : 'ri:close-fill',
      ssr: true,
    }"
    @click="() => {
      toggleChat()
    }"
  />
</template>

<style>
#crisp-chatbox>div>a[role='button'] {
  display: none !important;
}
</style>
