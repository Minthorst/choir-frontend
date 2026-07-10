<script setup lang="ts">
import BaseButton from "@/components/ui/BaseButton.vue";
import {useAuth} from "@/composables/useAuth";
import {useRouter} from "vue-router";
import {onMounted} from "vue";

const {authenticated, initialized, logout, refresh} = useAuth()
const router = useRouter()

onMounted(() => {
  if (!initialized.value) {
    refresh()
  }
})

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<template>
  <div class="button-group">
    <base-button to="/member">Member</base-button>
    <base-button to="/doorman">Doorman</base-button>
    <base-button to="/admin">Admin</base-button>
    <base-button v-if="authenticated" variant="secondary" @click="handleLogout">Logout</base-button>
  </div>
</template>


<style scoped>
.button-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

@media (max-width: 400px) {
  .button-group {
    flex-direction: column;
  }

  .button-group :deep(.base-button) {
    width: 100%;
  }
}
</style>