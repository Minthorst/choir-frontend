<script setup lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useAuth} from "@/composables/useAuth";
import BaseCard from "@/components/ui/BaseCard.vue";

const route = useRoute()
const router = useRouter()
const {login} = useAuth()

const tier = (route.query.tier as string) || 'MEMBER'
const redirect = (route.query.redirect as string) || '/'

const usernameForTier: Record<string, string> = {
  MEMBER: 'member',
  DOORMAN: 'doorman',
  ADMIN: 'admin'
}

const password = ref('')
const errorMessage = ref('')

async function submit() {
  errorMessage.value = ''
  const username = usernameForTier[tier] || 'member'
  const ok = await login(username, password.value)
  if (ok) {
    router.push(redirect)
  } else {
    errorMessage.value = 'Incorrect password'
  }
}
</script>

<template>
  <base-card>
    <template #header><h3>Password required</h3></template>
    <form @submit.prevent="submit">
      <label>Password:</label>
      <input type="password" v-model="password" autofocus/>
      <button>Unlock</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </base-card>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

label {
  font-size: 0.9rem;
  color: var(--muted);
}

input {
  background-color: var(--bg);
  border: 1px solid var(--row-active);
  border-radius: var(--radius-sm);
  color: var(--fg);
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: var(--accent);
}

button {
  background-color: var(--accent);
  color: var(--fg);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  min-height: 2.75rem;
}

button:hover {
  background-color: var(--accent-hover);
}

.error {
  color: #ef4444;
  margin-top: 0.75rem;
  text-align: center;
}
</style>
