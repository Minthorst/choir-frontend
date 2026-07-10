<script setup lang="ts">
import Modal from "@/components/ui/Modal.vue";

defineProps<{ status: string, message: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <modal
      :class="status === 'success' ? 'success-modal' : 'fail-modal'"
      :is-open="status !== 'pending'"
      @close="emit('close')"
  >
    <p>{{ message }}</p>
  </modal>
</template>
