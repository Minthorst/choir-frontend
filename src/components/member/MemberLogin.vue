<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import BaseCard from "@/components/ui/BaseCard.vue";

const secretKey = ref('')
const router = useRouter()

function login() {
  router.push({name: 'member-dash', params: {secretKey: secretKey.value}})
}
</script>

<template>
  <base-card>
    <form @submit.prevent="login">
      <label>Your Secret Key:</label>
      <br>
      <input type="text" v-model="secretKey"/>
      <button>Login</button>
    </form>
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

br {
  display: none;
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
</style>