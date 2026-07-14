<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const secretKey = ref('')
const showKey = ref(false)
const router = useRouter()

function login() {
  router.push({name: 'member-dash', params: {secretKey: secretKey.value}})
}
</script>

<template>
  <base-card>
    <form @submit.prevent="login">
      <label for="secret-key">Your Secret Key:</label>
      <!-- hidden username gives the password manager a full credential pair to save -->
      <input
          type="text"
          name="username"
          autocomplete="username"
          value="member"
          class="hidden-username"
          tabindex="-1"
          aria-hidden="true"
      />
      <div class="key-field">
        <input
            id="secret-key"
            :type="showKey ? 'text' : 'password'"
            name="password"
            autocomplete="current-password"
            v-model="secretKey"
        />
        <button type="button" class="toggle-visibility" @click="showKey = !showKey"
                :aria-label="showKey ? 'Hide key' : 'Show key'">
          {{ showKey ? '🙈' : '👁' }}
        </button>
      </div>
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

.hidden-username {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.key-field {
  position: relative;
  width: 100%;
}

.key-field input {
  width: 100%;
  padding-right: 2.75rem;
}

.toggle-visibility {
  position: absolute;
  top: 50%;
  right: 0.25rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.5rem;
  line-height: 1;
}
</style>
