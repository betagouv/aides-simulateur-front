import collections from '@/icon-collections'

import { addCollection } from '@iconify/vue'

export default defineNuxtPlugin(() => {
  for (const collection of collections) {
    addCollection(collection)
  }
})
