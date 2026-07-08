<script setup lang="ts">
import {Attendance} from "@/types/attendance";
import {computed, ref} from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";

const props = defineProps<{ attendance: Attendance[], isCheckedIn: boolean }>()

const currentPage = ref(1)
const pageSize = 5

const sorted = computed(() =>
    [...props.attendance].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()))
const totalPages = computed(() => Math.ceil(sorted.value.length / pageSize))
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

function calculateAttendanceIndex(i: number) {
  return props.attendance.length - (i + (currentPage.value - 1) * pageSize)
}
</script>

<template>
  <base-card :class="{checkedIn: isCheckedIn}">
    <table v-if="attendance && attendance.length > 0">
      <tbody>
      <tr v-for="(a,i) in pageItems" :key="a.dateTime">
        <td>{{ calculateAttendanceIndex(i) }}.</td>
        <td>{{ formatDatetime(a.dateTime) }}</td>
        <td>{{ a.status }}</td>
      </tr>
      <tr>
        <td>
          <base-button @click="pageForward">></base-button>
        </td>
        <td>{{ currentPage }} / {{ totalPages }}</td>
        <td>
          <base-button @click="pageBack()"><</base-button>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else>No Attendance Record found</p>
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

.checkedIn tbody tr:not(:last-child) td {
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.checkedIn tr:last-child td:nth-child(2) {
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

td:last-child {
  text-align: right;
}

tr:last-child td {
  padding-top: 1rem;
  border-bottom: none;
}

tr:last-child td:nth-child(2) {
  text-align: center;
  color: var(--muted);
  font-size: 0.85rem;
}

tr:last-child :deep(.base-button) {
  padding: 0.35rem 0.75rem;
  min-height: 2.25rem;
  min-width: 2.5rem;
}

p {
  color: var(--muted);
  text-align: center;
}

@media (max-width: 480px) {
  td {
    font-size: 0.8rem;
    padding: 0.5rem 0.25rem;
  }
}
</style>