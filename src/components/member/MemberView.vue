<script setup lang="ts">
import {Member} from "@/types/member";
import AttendanceView from "@/components/member/AttendanceView.vue";
import {computed} from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";

const props = defineProps<{ memberData: Member, secretKey: string }>()

const checkedIn = computed(() => {
      if (props.memberData.checkedIn) {
        return "Hell Yeah"
      } else {
        return "nope"
      }
    }
)

const checkInDateTime = computed(() => {
  if (!props.memberData.checkedIn || props.memberData.pastAttendance.length === 0) {
    return null
  }
  const latest = props.memberData.pastAttendance.reduce((a, b) =>
      new Date(a.dateTime).getTime() >= new Date(b.dateTime).getTime() ? a : b)
  return new Intl.DateTimeFormat('de-DE', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(latest.dateTime))
})
</script>

<template>
  <base-card collapsible :default-open="false" :class="{checkedIn: memberData.checkedIn}">
    <template #header>
      <div class="header-row">
        <h3>👤 {{ memberData.name }}</h3>
        <h4 v-if="checkInDateTime">Checked in: {{ checkInDateTime }}</h4>
      </div>
    </template>
    <table>
      <tbody>
      <tr>
        <td>Regular Tickets:</td>
        <td>{{ memberData.regularTickets }}</td>
      </tr>
      <tr>
        <td>Commit Tickets:</td>
        <td>{{ memberData.commitTickets }}</td>
      </tr>
      <tr>
        <td>Secret-Key:</td>
        <td>{{ secretKey }}</td>
      </tr>
      <tr>
        <td>Currently checked in:</td>
        <td>{{ checkedIn }}</td>
      </tr>
      </tbody>
    </table>
  </base-card>
  <base-card collapsible :default-open="false">
    <template #header>
      <h3>📋 Attendance Log</h3>
    </template>
    <attendance-view :attendance="memberData.pastAttendance"></attendance-view>
  </base-card>

</template>

<style scoped>
td {
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid var(--row-ghost);
  font-size: 0.95rem;
}

tr:last-child td {
  border-bottom: none;
}

td:first-child {
  color: var(--muted);
  font-weight: 500;
  white-space: nowrap;
  padding-right: 1rem;
}

td:last-child {
  text-align: right;
  font-weight: 500;
  word-break: break-word;
}

@media (max-width: 480px) {
  td {
    font-size: 0.85rem;
    padding: 0.5rem 0.25rem;
  }
}

.header-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.header-row h3,
.header-row h4 {
  margin: 0;
}

.header-row h4 {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

.checkedIn {
  background-color: #15803d;
  border-color: #22c55e;
  color: #ffffff;
}

.checkedIn td {
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.checkedIn td:first-child {
  color: rgba(255, 255, 255, 0.75);
}

.checkedIn td:last-child {
  color: #ffffff;
}
</style>
