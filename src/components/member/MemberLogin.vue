<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

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
      <base-button type="submit">Login</base-button>
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

br {
  display: none;
}

input {
  width: 100%;
}
</style>