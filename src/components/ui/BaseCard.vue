<template>
  <div class="base-card">
    <header v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </header>

    <main class="card-body">
      <slot></slot>
    </main>

    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </footer>
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