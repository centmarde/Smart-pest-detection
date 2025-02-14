<template>
  <v-footer height="40" class="transparent-footer">
    
  </v-footer>
</template>

<script setup lang="ts">

</script>

<style scoped lang="sass">
.transparent-footer
  background-color: transparent !important

.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>