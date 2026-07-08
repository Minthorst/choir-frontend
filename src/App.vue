<script setup lang="ts">

import TheHeader from "@/components/TheHeader.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
</script>

<template>
  <div class="app-container">
  <base-card class="header">
    <the-header #header @select="activeComponent = $event"/>
  </base-card>
  <router-view/>
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
