<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="closeModal">

    <div class="modal-content">
      <button class="close-btn" @click="closeModal">&times;</button>

      <slot></slot>
    </div>

  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background: var(--row);
  color: var(--fg);
  padding: 2rem;
  border-radius: var(--radius-md);
  position: relative;
  width: min(360px, 100%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--muted);
  line-height: 1;
}
.close-btn:hover {
  color: var(--fg);
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1.5rem;
  }
}
</style>