<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useAuth} from "@/composables/useAuth";
import {consumePendingRedirect} from "@/router/pendingRedirect";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

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
      <base-button type="submit">Unlock</base-button>
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

input {
  width: 100%;
}

.error {
  color: #ef4444;
  margin-top: 0.75rem;
  text-align: center;
}
</style>
