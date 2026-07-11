<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import MemberView from "@/components/member/MemberView.vue";
import {Member} from "@/types/member";
import {AttendanceResponse} from "@/types/attendance";
import {checkInMember, getMemberData} from "@/api/memberApi";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import QrCodeViewer from "@/components/member/QrCodeViewer.vue";
import ScheduleCalendar from "@/components/member/ScheduleCalendar.vue";
import Modal from "@/components/ui/Modal.vue";
import ResultModal from "@/components/ui/ResultModal.vue";

const router = useRouter()
const route = useRoute()
const secretKey = Array.isArray(route.params.secretKey) ? route.params.secretKey[0] : route.params.secretKey
const loading = ref(true)
const memberData = ref<Member | null>(null)
const showQRCode = ref(false)
const showCheckInConfirm = ref(false)
const resultMessage = ref('')
const resultStatus = ref('pending')

function showError(message: string) {
  resultMessage.value = message
  resultStatus.value = 'fail'
}

function showSuccess(message: string) {
  resultMessage.value = message
  resultStatus.value = 'success'
}

function closeResultModal() {
  resultStatus.value = 'pending'
  if (!memberData.value) {
    router.push({name: 'member-login'})
  }
}

function confirmCheckIn() {
  showCheckInConfirm.value = false
  checkInAndFetchMember()
}

function toggleQRCode() {
  showQRCode.value = !showQRCode.value
}

const TICKET_PRICE: Record<string, string> = {
  flex: '15',
  ten: '120',
  commit: '50'
}

function buyTicket(type: string) {
  const url = 'https://www.paypal.com/paypalme/idijod/' + TICKET_PRICE[type]
  if (url) {
    window.open(url, '')
  }
}

const memberCheckedIn = computed(() =>
    memberData?.value?.checkedIn === true)

function checkInAndFetchMember() {
  loading.value = true
  checkInMember(secretKey)
      .then(() => {
        getMemberInfo()
        showSuccess('You have been checked in successfully!')
      })
      .catch((error) => {
        loading.value = false
        showError(error.message)
      })
  loading.value = false
}

function getMemberInfo() {
  loading.value = true
  getMemberData(secretKey)
      .then((m) => {
        memberData.value = {
          name: m.name,
          regularTickets: m.regularTickets,
          commitTickets: m.commitTickets,
          pastAttendance: (m.pastAttendances || []).map((a: AttendanceResponse) => ({
            dateTime: a.attendedOn,
            status: a.status
          })),
          checkedIn: m.checkedIn
        }
        loading.value = false
      }).catch((error) => {
    loading.value = false
    showError("could not login member with key: " + secretKey)
  })
}

onMounted(async () => {
  try {
    getMemberInfo()
  } catch (e) {

  } finally {
    loading.value = false
  }
})
</script>

<template>
  <base-card collapsible :default-open="false">
    <template #header><h3>Check In</h3></template>
    <div class="vertical-button-group">
      <base-button :class="{'checkin-not-possible': memberCheckedIn}" :disabled="memberCheckedIn"
                   @click="showCheckInConfirm = true">CHECK IN
      </base-button>
      <BaseButton @click="toggleQRCode()">QR-CODE</BaseButton>
      <modal :is-open="showQRCode" @close="toggleQRCode">
        <qr-code-viewer :secret-key="secretKey"></qr-code-viewer>
      </modal>
      <modal :is-open="showCheckInConfirm" @close="showCheckInConfirm = false">
        <h3>Confirm Check In</h3>
        <p>Are you sure you want to check in?</p>
        <div class="confirm-actions">
          <base-button variant="secondary" @click="showCheckInConfirm = false">Cancel</base-button>
          <base-button @click="confirmCheckIn">Yes, Check In</base-button>
        </div>
      </modal>
    </div>
  </base-card>
  <member-view v-if="memberData" :member-data="memberData" :secret-key="secretKey"></member-view>
  <p v-else>loading...</p>
  <base-card collapsible :default-open="false">
    <template #header><h3>Schedule</h3></template>
    <schedule-calendar></schedule-calendar>
  </base-card>

  <base-card collapsible :default-open="false">
    <template #header><h3>Buy Tickets</h3></template>
    <div>
      <p>Bitte gib bei der Paypal Zahlung deinen Namen und das gewünschte Ticket mit an</p>
    </div>
    <div class="ticket-options">
      <div class="ticket-option">
        <base-button @click="buyTicket('flex')">Flex-Ticket</base-button>
        <p>Einzel Ticket für volle Flexibilität, <strong>15 EUR</strong></p>
      </div>
      <div class="ticket-option">
        <base-button @click="buyTicket('ten')">10er-Ticket</base-button>
        <p>Prepaid 10er "Stempelkarte <strong>120 EUR</strong>"</p>
      </div>
      <div class="ticket-option">
        <base-button @click="buyTicket('commit')">Commit 5er-Ticket</base-button>
        <p>Tickets für die 5 nächsten Proben in Folge (Ticket wird auch abgebucht, wenn du nicht erscheinst) <strong>50
          EUR</strong></p>
      </div>
    </div>
    <p class="ticket-note">*Cash vor Ort und Banküberweisung auch möglich :)</p>
  </base-card>

  <result-modal :status="resultStatus" :message="resultMessage" @close="closeResultModal"/>
</template>

<style scoped>
.checkin-not-possible {
  cursor: not-allowed;
  background-color: grey;
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.base-button:disabled:hover {
  background-color: #cbd5e1;
  box-shadow: none;
  transform: none;
  cursor: not-allowed;
}

.vertical-button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.vertical-button-group :deep(.base-button) {
  width: 100%;
}

.ticket-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.ticket-option {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
}

.ticket-option :deep(.base-button) {
  width: 100%;
}

.ticket-option p {
  color: var(--muted);
  font-size: 0.85rem;
  margin: 0;
}

.ticket-note {
  color: var(--muted);
  font-size: 0.8rem;
  text-align: center;
  margin: 1rem 0 0;
}
</style>