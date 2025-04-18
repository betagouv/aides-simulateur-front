<template>
  <main
    id="content"
    role="main"
    tabindex="-1"
    class="main-iframe"
  >
    <slot />
    <CrispButton class="crisp-button" />
  </main>
</template>

<style>
#crisp-chatbox>div>div {
  top: 56px !important;
  right: 8px !important;
  bottom: none !important;
}
</style>

<style scoped lang="scss">
.main-iframe {
  min-height: 600px;
  padding: 8px; // make sure focus outline is visible
}

.crisp-button {
  position: fixed;
  top: .5rem;
  right: .5rem;
  z-index: 9999;
}
</style>
