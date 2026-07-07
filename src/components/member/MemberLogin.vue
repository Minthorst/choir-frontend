<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

const secretKey = ref('')
const router = useRouter()
function login(){
  router.push({ name: 'member-dash', params: { secretKey: secretKey.value } })
}
</script>

<template>
<form @submit.prevent="login">
  <input type="text" v-model="secretKey"/>
  <button>Login</button>
</form>
</template>

<style scoped>

</style>