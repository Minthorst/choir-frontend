<template>
  <component
      :is="componentType"
      :to="to"
      class="base-button"
      :class="[variant]"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: [String, Object],
    default: null
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  }
})

const componentType = computed(() => {
  return props.to ? 'router-link' : 'button'
})
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: clamp(0.68rem, 3vw, 0.875rem);
  font-weight: 500;
  padding: 0.5rem clamp(0.4rem, 3vw, 1rem);
  min-height: 2.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.15s ease-in-out;
  box-sizing: border-box;
}

.base-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.base-button:active {
  transform: translateY(0);
  box-shadow: none;
}

.base-button:disabled {
  background-color: grey;
  border-color: transparent;
  cursor: not-allowed;
}

.base-button:disabled:hover {
  background-color: grey;
  transform: none;
  box-shadow: none;
}

.primary {
  background-color: var(--accent);
  color: var(--fg);
}
.primary:hover {
  background-color: var(--accent-hover);
}

.secondary {
  background-color: transparent;
  border-color: var(--row-active);
  color: var(--fg);
}
.secondary:hover {
  background-color: var(--row-ghost);
}

.danger {
  background-color: var(--danger);
  color: #ffffff;
}
.danger:hover {
  background-color: var(--danger-hover);
}

.base-button.router-link-exact-active {
  background-color: var(--row-active);
}

.base-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>