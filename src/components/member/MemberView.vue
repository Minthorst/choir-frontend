<script setup lang="ts">
import {Member} from "@/types/member";

const props = defineProps<{ memberData: Member}>()
</script>

<template>
  <ul>
    <li>Name: {{ memberData.name }}</li>
    <li>Regular Tickets: {{ memberData.regularTickets }}</li>
    <li>Commit Tickets: {{ memberData.commitTickets }}</li>
  </ul>
  <ul v-for="attendance in memberData.pastAttendance">
    <li>{{ attendance.dateTime }}</li>
    <li>{{ attendance.status }}</li>
  </ul>
</template>

<style scoped>

</style>