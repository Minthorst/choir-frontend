<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import listPlugin from "@fullcalendar/list";
import iCalendarPlugin from "@fullcalendar/icalendar";
import {getScheduleIcsUrl} from "@/api/memberApi";

const calendarOptions = {
  plugins: [listPlugin, iCalendarPlugin],
  initialView: 'listMonth',
  headerToolbar: {
    left: 'title',
    center: '',
    right: 'today prev,next'
  },
  height: 'auto',
  events: {
    url: getScheduleIcsUrl(),
    format: 'ics'
  },
  eventClick(info: {jsEvent: MouseEvent}) {
    info.jsEvent.preventDefault()
  }
}
</script>

<template>
  <div class="schedule-calendar">
    <full-calendar :options="calendarOptions"/>
  </div>
</template>

<style scoped>
.schedule-calendar {
  width: 100%;
}

.schedule-calendar :deep(.fc) {
  --fc-border-color: var(--row-ghost);
  --fc-page-bg-color: transparent;
  --fc-neutral-bg-color: var(--row-ghost);
  --fc-neutral-text-color: var(--muted);
  --fc-today-bg-color: var(--row-active);
  --fc-event-bg-color: var(--accent);
  --fc-event-border-color: var(--accent);
  --fc-event-text-color: #ffffff;
  --fc-list-event-hover-bg-color: var(--row-active);
  --fc-button-text-color: var(--fg);
  --fc-button-bg-color: var(--accent);
  --fc-button-border-color: var(--accent);
  --fc-button-hover-bg-color: var(--accent-hover);
  --fc-button-hover-border-color: var(--accent-hover);
  --fc-button-active-bg-color: var(--row-active);
  --fc-button-active-border-color: var(--row-active);
  color: var(--fg);
}

/* the ICS feed assigns its own per-event colors (the green/yellow); force a
   single consistent accent color instead since those inline styles win over
   the --fc-event-* custom properties above */
.schedule-calendar :deep(.fc-event),
.schedule-calendar :deep(.fc-list-event-dot) {
  background-color: var(--accent) !important;
  border-color: var(--accent) !important;
  color: #ffffff !important;
}

.schedule-calendar :deep(.fc-event),
.schedule-calendar :deep(.fc-event a) {
  cursor: default;
}

.schedule-calendar :deep(.fc-daygrid-day-number),
.schedule-calendar :deep(.fc-list-day-text),
.schedule-calendar :deep(.fc-list-day-side-text) {
  color: var(--fg);
}
</style>
