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
import Modal from "@/components/ui/Modal.vue";

const router = useRouter()
const route = useRoute()
const secretKey = Array.isArray(route.params.secretKey) ? route.params.secretKey[0] : route.params.secretKey
const loading = ref(true)
const memberData = ref<Member | null>(null)
const showQRCode = ref(false)

function toggleQRCode() {
  showQRCode.value = !showQRCode.value
}

const memberCheckedIn = computed(() =>
    memberData?.value?.checkedIn === true)

const qrButtonText = computed(() => {
  if (showQRCode.value) {
    return "hide QR-Code"
  } else {
    return "generate QR-Code"
  }
})

function checkInAndFetchMember() {
  loading.value = true
  checkInMember(secretKey)
      .then(() => getMemberInfo())
      .catch((error) => {
        loading.value = false
        alert(error.message)
      })
  //TODO add exception handling}
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
          pastAttendance: m.pastAttendances.map((a: AttendanceResponse) => ({
            dateTime: a.attendedOn,
            status: a.status
          })),
          checkedIn: m.checkedIn
        }
        loading.value = false
      }).catch((error) => {
    //TODO add error handling/alterts
    alert("could not login member with key: " + secretKey)
    loading.value = false
    router.push({name: 'member-login'})
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
  <member-view v-if="memberData" :member-data="memberData" :secret-key="secretKey"></member-view>
  <p v-else>loading...</p>
  <base-card>
    <template #header><h3>Check In</h3></template>
    <div class="vertical-button-group">
      <base-button :class="{'checkin-not-possible': memberCheckedIn}" :disabled="memberCheckedIn"
                   @click="checkInAndFetchMember">CHECK IN</base-button>
      <BaseButton @click="toggleQRCode()">{{ qrButtonText }}</BaseButton>
      <modal :is-open="showQRCode" @close="toggleQRCode">
        <qr-code-viewer :secret-key="secretKey"></qr-code-viewer>
      </modal>
    </div>
  </base-card>
  <!--  TODO add paypal links-->
</template>

<style scoped>
.checkin-not-possible {
  cursor: not-allowed;
  background-color: grey;
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
</style>