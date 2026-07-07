<script setup lang="ts">
import {ref} from "vue";

const emit = defineEmits(['select'])
</script>

<template>
  <router-link to="/member">Member-Login</router-link>
  <router-link to="/doorman">Doorman</router-link>
  <router-link to="/admin">Admin</router-link>
</template>

<style scoped>

</style>