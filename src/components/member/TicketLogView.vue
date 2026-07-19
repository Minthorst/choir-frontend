<script setup lang="ts">
import {computed, ref} from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import {TicketLogEntry} from "@/types/ticketLog";

const props = defineProps<{ entries: TicketLogEntry[] }>()

const currentPage = ref(1)
const pageSize = 5

const TYPE_LABELS: Record<string, string> = {
  INITIAL_BALANCE: 'Init',
  ADMIN_ADJUSTMENT: 'Admin',
  CHECK_IN: 'Check-in',
  NO_SHOW_CHARGE: 'Commit',
  FREE_SESSION_REFUND: 'Free session refund',
}

const sorted = computed(() =>
    [...props.entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))

const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize)))
const pageItems = computed(() =>
    sorted.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function pageForward() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function pageBack() {
  if (currentPage.value > 1) currentPage.value--
}

function typeLabel(entry: TicketLogEntry) {
  return TYPE_LABELS[entry.type] ?? entry.type
}

function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat('de-DE', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(timestamp))
}

interface DeltaPart {
  text: string
  positive: boolean
}

function deltaParts(entry: TicketLogEntry): DeltaPart[] {
  const parts: DeltaPart[] = []
  if (entry.regularDelta !== 0) {
    parts.push({
      text: `${entry.regularDelta > 0 ? '+' : ''}${entry.regularDelta} Regular`,
      positive: entry.regularDelta > 0
    })
  }
  if (entry.commitDelta !== 0) {
    parts.push({
      text: `${entry.commitDelta > 0 ? '+' : ''}${entry.commitDelta} Commit`,
      positive: entry.commitDelta > 0
    })
  }
  return parts
}
</script>

<template>
  <div class="table-scroll" v-if="pageItems.length > 0">
    <table class="ticket-log-table">
      <thead>
      <tr>
        <th>Date</th>
        <th>Reason</th>
        <th>Tickets</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="entry in pageItems" :key="entry.timestamp + entry.type + entry.regularDelta + entry.commitDelta">
        <td>{{ formatDate(entry.timestamp) }}</td>
        <td>{{ typeLabel(entry) }}</td>
        <td>
          <span
              v-for="part in deltaParts(entry)"
              :key="part.text"
              class="delta"
              :class="part.positive ? 'delta-positive' : 'delta-negative'"
          >{{ part.text }}</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <p v-else class="empty-state">No ticket activity yet</p>

  <div class="pagination" v-if="totalPages > 1">
    <base-button :disabled="currentPage === 1" @click="pageBack">&lt;</base-button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <base-button :disabled="currentPage === totalPages" @click="pageForward">&gt;</base-button>
  </div>
</template>

<style scoped>
.table-scroll {
  overflow-x: auto;
}

.ticket-log-table {
  width: 100%;
  border-collapse: collapse;
}

.ticket-log-table th,
.ticket-log-table td {
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid var(--row-ghost);
  font-size: 0.9rem;
  text-align: left;
  white-space: nowrap;
}

.ticket-log-table tr:last-child td {
  border-bottom: none;
}

.delta {
  display: inline-block;
  font-weight: 600;
  white-space: nowrap;
}

.delta + .delta {
  margin-left: 0.5rem;
}

.delta-positive {
  color: var(--success);
}

.delta-negative {
  color: var(--danger);
}

.empty-state {
  color: var(--muted);
  text-align: center;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

@media (max-width: 480px) {
  .ticket-log-table th,
  .ticket-log-table td {
    font-size: 0.8rem;
    padding: 0.5rem 0.25rem;
  }
}
</style>
