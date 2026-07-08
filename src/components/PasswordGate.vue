<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useAuth} from "@/composables/useAuth";
import {consumePendingRedirect} from "@/router/pendingRedirect";
import BaseCard from "@/components/ui/BaseCard.vue";

const router = useRouter()
const {login, hasRole} = useAuth()

const redirect = consumePendingRedirect()

const USERNAMES_BY_PRIORITY = ['admin', 'doorman', 'member']

const password = ref('')
const errorMessage = ref('')

async function submit() {
  errorMessage.value = ''
  for (const username of USERNAMES_BY_PRIORITY) {
    const ok = await login(username, password.value)
    if (ok) {
      if (hasRole('ADMIN')) {
        router.push('/admin')
      } else if (hasRole('DOORMAN')) {
        router.push('/doorman')
      } else {
        router.push(redirect)
      }
      return
    }
  }
  errorMessage.value = 'Incorrect password'
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
