<script setup lang="ts">
import {ref} from "vue";

const props = withDefaults(defineProps<{ collapsible?: boolean, defaultOpen?: boolean }>(), {
  collapsible: false,
  defaultOpen: true
})

const open = ref(props.defaultOpen)

function toggle() {
  if (props.collapsible) open.value = !open.value
}
</script>

<template>
  <div class="base-card">
    <header v-if="$slots.header" class="card-header" :class="{collapsible}" @click="toggle">
      <slot name="header"></slot>
      <span v-if="collapsible" class="chevron" :class="{open}">▾</span>
    </header>

    <div class="collapse-wrapper" :class="{open: !collapsible || open}">
      <div class="collapse-inner">
        <main class="card-body">
          <slot></slot>
        </main>

        <footer v-if="$slots.footer" class="card-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-card {
  color: var(--fg);
  border: 1px solid var(--row-ghost);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  padding: 1.25rem 1.5rem;
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: var(--row);
}

.base-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.32);
}

.card-header {
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
}

.card-header.collapsible {
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.chevron {
  display: inline-block;
  margin-left: 0.5rem;
  color: var(--muted);
  transition: transform 0.25s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.collapse-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.collapse-wrapper.open {
  grid-template-rows: 1fr;
}

.collapse-inner {
  overflow: hidden;
}

.card-body {
  font-size: 0.95rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card-footer {
  margin-top: 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 480px) {
  .base-card {
    padding: 1rem;
    border-radius: 10px;
  }
}
</style>