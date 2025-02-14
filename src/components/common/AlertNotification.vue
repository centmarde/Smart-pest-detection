<script lang="ts" setup>
const props = defineProps({
  formSuccessMessage: {
    type: String,
    default: ''
  },
  formErrorMessage: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <!-- Success Alert -->
  <template v-if="props.formSuccessMessage">
    <v-alert
      :text="props.formSuccessMessage"
      title="Success!"
      type="success"
      variant="tonal"
      density="compact"
      border="start"
      closable
    />
  </template>

  <!-- Error Alert -->
  <template v-if="props.formErrorMessage">
    <v-alert
      :text="props.formErrorMessage"
      title="Oops!"
      type="error"
      variant="tonal"
      density="compact"
      border="start"
      closable
    />
  </template>
</template>