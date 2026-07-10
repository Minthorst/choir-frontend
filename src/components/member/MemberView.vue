<script setup lang="ts">
import {Member} from "@/types/member";
import AttendanceView from "@/components/member/AttendanceView.vue";
import QrCodeViewer from "@/components/member/QrCodeViewer.vue";
import {computed, ref} from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import Modal from "@/components/ui/Modal.vue";

const props = defineProps<{ memberData: Member, secretKey: string }>()

const checkedIn = computed(() => {
      if (props.memberData.checkedIn) {
        return "Hell Yeah"
      } else {
        return "nope"
      }
    }
)
</script>

<template>
  <base-card collapsible :default-open="false" :class="{checkedIn: memberData.checkedIn}">
    <template #header>
      <h3>{{ memberData.name }}</h3>
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
      <h3>Attendances</h3>
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