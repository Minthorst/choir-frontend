<script setup lang="ts">
import {ref} from "vue";
import {useRoute} from "vue-router";
import Modal from "@/components/ui/Modal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import {sendFeedback} from "@/api/contactApi";

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()

const name = ref('')
const email = ref('')
const message = ref('')
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

function resetForm() {
  name.value = ''
  email.value = ''
  message.value = ''
  status.value = 'idle'
}

function close() {
  emit('close')
  if (status.value === 'success') {
    resetForm()
  }
}

async function submit() {
  status.value = 'sending'
  try {
    await sendFeedback({
      name: name.value,
      email: email.value,
      message: message.value,
      page: window.location.href,
      memberKey: typeof route.params.secretKey === 'string' ? route.params.secretKey : undefined,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      clientTimestamp: new Date().toISOString()
    })
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <modal :is-open="isOpen" @close="close">
    <h3>Feedback / Bug melden</h3>
    <form v-if="status !== 'success'" @submit.prevent="submit">
      <label>Name</label>
      <input type="text" v-model="name" required/>
      <label>E-Mail</label>
      <input type="email" v-model="email" required/>
      <label>Nachricht</label>
      <textarea v-model="message" rows="4" required></textarea>
      <base-button type="submit" :disabled="status === 'sending'">
        {{ status === 'sending' ? 'Wird gesendet…' : 'Senden' }}
      </base-button>
      <p v-if="status === 'error'" class="error">Konnte nicht gesendet werden. Bitte versuch es später erneut.</p>
    </form>
    <p v-else class="success">Danke für dein Feedback!</p>
  </modal>
</template>

<style scoped>
h3 {
  margin: 0 0 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

input,
textarea {
  width: 100%;
  font-family: inherit;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.error {
  color: #ef4444;
  margin-top: 0.5rem;
  text-align: center;
}

.success {
  margin: 0;
}
</style>
