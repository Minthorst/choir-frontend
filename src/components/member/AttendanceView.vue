<script setup lang="ts">
import {Attendance} from "@/types/attendance";
import {computed, ref} from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";

const props = defineProps<{ attendance: Attendance[] }>()

const currentPage = ref(1)
const pageSize = 5

const sortKey = ref<'dateTime' | 'status'>('dateTime')
const sortDir = ref<'asc' | 'desc'>('desc')

function sortBy(key: 'dateTime' | 'status') {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = key === 'dateTime' ? 'desc' : 'asc'
  }
  currentPage.value = 1
}

const chronological = computed(() =>
    [...props.attendance].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()))

function attendanceNumber(item: Attendance) {
  return chronological.value.findIndex((a) => a.dateTime === item.dateTime) + 1
}

const sorted = computed(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...props.attendance].sort((a, b) => {
    let av: any = a[sortKey.value]
    let bv: any = b[sortKey.value]
    if (sortKey.value === 'dateTime') {
      av = new Date(av).getTime()
      bv = new Date(bv).getTime()
    }
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize)))
const pageItems = computed(() => sorted.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function pageForward() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function pageBack() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function formatDatetime(iso: string) {
  return new Intl.DateTimeFormat('de-DE', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(iso))
}

const STATUS_LABEL: Record<string, string> = {
  PRESENT: '✅ Present',
  NO_SHOW: '🎟️ No-show (ticket charged)'
}

function statusLabel(status: string) {
  return STATUS_LABEL[status] ?? status
}
</script>

<template>
  <base-card>
    <table v-if="attendance && attendance.length > 0">
      <thead>
      <tr>
        <th>#</th>
        <th @click="sortBy('dateTime')">Date {{ sortKey === 'dateTime' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}</th>
        <th @click="sortBy('status')">Status {{ sortKey === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="a in pageItems" :key="a.dateTime">
        <td>{{ attendanceNumber(a) }}.</td>
        <td>{{ formatDatetime(a.dateTime) }}</td>
        <td>{{ statusLabel(a.status) }}</td>
      </tr>
      </tbody>
    </table>
    <p v-else>No Attendance Record found</p>

    <div class="pagination" v-if="totalPages > 1">
      <base-button @click="pageBack">&lt;</base-button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <base-button @click="pageForward">&gt;</base-button>
    </div>
  </base-card>
</template>

<style scoped>
tbody tr:not(:last-child) td {
  border-bottom: 1px solid var(--row-ghost);
}

td:first-child {
  color: var(--muted);
  width: 2rem;
}

p {
  color: var(--muted);
  text-align: center;
}
</style>