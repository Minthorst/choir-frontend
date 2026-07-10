<script setup lang="ts">
import {Attendance} from "@/types/attendance";
import {computed, ref} from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";

const props = defineProps<{ attendance: Attendance[], isCheckedIn: boolean }>()

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
</script>

<template>
  <base-card :class="{checkedIn: isCheckedIn}">
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
        <td>{{ a.status }}</td>
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
.checkedIn {
  background-color: #15803d;
  border-color: #22c55e;
  color: #ffffff;
}

.checkedIn table {
  color: #ffffff;
}

.checkedIn td:first-child {
  color: rgba(255, 255, 255, 0.75);
}

.checkedIn th {
  color: rgba(255, 255, 255, 0.75);
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.checkedIn tbody tr:not(:last-child) td {
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.checkedIn .pagination span {
  color: rgba(255, 255, 255, 0.85);
}

.checkedIn p {
  color: rgba(255, 255, 255, 0.85);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  cursor: pointer;
  user-select: none;
  color: var(--muted);
  font-weight: 500;
  font-size: 0.85rem;
  padding: 0.5rem 0.4rem;
  border-bottom: 1px solid var(--row-active);
  white-space: nowrap;
}

tbody tr:not(:last-child) td {
  border-bottom: 1px solid var(--row-ghost);
}

td {
  padding: 0.6rem 0.4rem;
  font-size: 0.9rem;
}

td:first-child {
  color: var(--muted);
  width: 2rem;
}

p {
  color: var(--muted);
  text-align: center;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  color: var(--muted);
  font-size: 0.85rem;
}

@media (max-width: 480px) {
  th, td {
    font-size: 0.8rem;
    padding: 0.4rem 0.25rem;
  }
}
</style>