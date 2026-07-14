<script setup lang="ts">

import {ref} from "vue";
import TheHeader from "@/components/TheHeader.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import FeedbackModal from "@/components/FeedbackModal.vue";
import {useAuth} from "@/composables/useAuth";

const {authenticated} = useAuth()
const showFeedback = ref(false)
</script>

<template>
  <div class="app-container">
  <base-card class="header">
    <the-header #header/>
  </base-card>
  <router-view/>
  <footer class="legal-footer">
    <router-link to="/impressum">Impressum</router-link>
    <span>·</span>
    <router-link to="/datenschutz">Datenschutz</router-link>
    <template v-if="authenticated">
      <span>·</span>
      <a href="#" @click.prevent="showFeedback = true">Feedback</a>
    </template>
  </footer>
  <feedback-modal :is-open="showFeedback" @close="showFeedback = false"/>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  padding: 1.5rem 1rem;
  gap: 1.5rem;
}

.legal-footer {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.legal-footer a,
.legal-footer span {
  color: var(--muted);
}

.legal-footer a:hover {
  color: var(--accent);
}

.header {
  width: 100%;
  max-width: 480px;
}

@media (max-width: 480px) {
  .app-container {
    padding: 1rem 0.75rem;
    gap: 1rem;
  }
}
</style>
