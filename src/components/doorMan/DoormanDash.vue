<script setup lang="ts">

import {QrcodeStream} from "vue-qrcode-reader";
import {computed, onMounted, ref} from "vue";
import {checkInMember, getMemberData} from "@/api/memberApi";
import {checkInMemberById, getCheckedInMemberNames, getMemberNames, MemberNameResponse} from "@/api/doormanApi";
import Modal from "@/components/ui/Modal.vue";
import ResultModal from "@/components/ui/ResultModal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";

const scannerOn = ref(false)
const checkInResponse = ref('')
const checkInSuccess = ref('pending')

const members = ref<MemberNameResponse[]>([])
const checkedInMembers = ref<MemberNameResponse[]>([])
const searchText = ref('')
const selectedMemberId = ref<number | null>(null)
const showDropdown = ref(false)

function fetchCheckedInMembers() {
  getCheckedInMemberNames().then((list) => {
    checkedInMembers.value = list
  })
}

onMounted(() => {
  getMemberNames().then((list) => {
    members.value = list
  })
  fetchCheckedInMembers()
})

const filteredMembers = computed(() => {
  const query = searchText.value.trim().toLowerCase()
  if (!query) return members.value
  return members.value.filter((m) => m.name.toLowerCase().includes(query))
})

function selectMember(member: MemberNameResponse) {
  selectedMemberId.value = member.id
  searchText.value = member.name
  showDropdown.value = false
}

function onSearchInput() {
  selectedMemberId.value = null
  showDropdown.value = true
}

function resetSelection() {
  selectedMemberId.value = null
  searchText.value = ''
}

function checkInSelectedMember() {
  if (!selectedMemberId.value) return
  checkInMemberById(selectedMemberId.value)
      .then((result) => {
        const verb = result.checkedIn ? 'is already checked in' : 'checked in successfully'
        checkInResponse.value = result.name + ' ' + verb + ' with ' + result.regularTickets + ' Regular and ' + result.commitTickets + ' Commit Tickets remaining'
        checkInSuccess.value = 'success'
        resetSelection()
        fetchCheckedInMembers()
      })
      .catch((e) => {
        checkInResponse.value = e.message
        checkInSuccess.value = 'fail'
        resetSelection()
      })
}

function toggleScanner() {
  scannerOn.value = !scannerOn.value
}

function constructQRScannerResponse(secretKey: string) {
  getMemberData(secretKey).then((member) => {
    checkInResponse.value = member.name + ' checked in successfully with ' + member.regularTickets + ' Regular and ' + member.commitTickets + ' Commit Tickets remaining'
  })
}

function onDetect(detectedCodes: any) {
  toggleScanner()
  let secretKey: string
  try {
    secretKey = extractSecretKeyFromUrl(detectedCodes[0].rawValue)
  } catch {
    checkInResponse.value = 'This is not a valid member QR code'
    checkInSuccess.value = 'fail'
    return
  }
  checkInMember(secretKey).then(() => {
    constructQRScannerResponse(secretKey)
    checkInSuccess.value = 'success'
    fetchCheckedInMembers()
  }).catch((e) => {
    if (e.message.startsWith("Member is already checked in to current Session")) {
      constructQRScannerResponse(secretKey)
      checkInSuccess.value = 'success'
      fetchCheckedInMembers()
    } else {
      checkInResponse.value = e.message
      checkInSuccess.value = 'fail'
    }
  })
}

function extractSecretKeyFromUrl(rawUrl: string): string {
  const key = new URL(rawUrl).pathname.split('/').filter(Boolean).pop()
  if (!key) throw new Error('QR code contains no secret key')
  return key
}

function onCameraError(error: Error) {
  scannerOn.value = false
  checkInResponse.value = 'Camera error: ' + error.message
  checkInSuccess.value = 'fail'
}
</script>

<template>
  <base-card>
    <template #header>
      <h3>📷 QR-CheckIn</h3>
    </template>
    <base-button @click="toggleScanner">scan QR-Code</base-button>
  </base-card>
  <base-card>
    <template #header>
      <h3>✍️ Manual CheckIn by name</h3>
    </template>
    <div class="manual-checkin">
      <div class="member-select">
        <input
            type="text"
            v-model="searchText"
            placeholder="Type a member name..."
            @input="onSearchInput"
            @focus="showDropdown = true"
            @blur="showDropdown = false"
        />
        <ul v-if="showDropdown && filteredMembers.length" class="dropdown">
          <li v-for="m in filteredMembers" :key="m.id" @mousedown.prevent="selectMember(m)">
            {{ m.name }}
          </li>
        </ul>
      </div>
      <base-button :disabled="!selectedMemberId" @click="checkInSelectedMember">Check In</base-button>
    </div>
  </base-card>
  <modal :is-open="scannerOn" @close="toggleScanner">
    <qrcode-stream @detect="onDetect" @error="onCameraError"></qrcode-stream>
  </modal>
  <base-card>
    <template #header>
      <h3>👥 Currently Checked In</h3>
    </template>
    <p v-if="!checkedInMembers.length" class="empty-state">no one is checked in yet</p>
    <ul v-else class="checked-in-list">
      <li v-for="m in checkedInMembers" :key="m.id">{{ m.name }}</li>
    </ul>
  </base-card>
  <result-modal :status="checkInSuccess" :message="checkInResponse" @close="checkInSuccess = 'pending'"/>
</template>

<style scoped>
:deep(video) {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

.manual-checkin {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  width: 100%;
}

.member-select {
  position: relative;
  flex: 1;
}

.member-select input {
  width: 100%;
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  background-color: var(--row);
  border: 1px solid var(--row-ghost);
  border-radius: var(--radius-sm);
  max-height: 220px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0.25rem 0;
  z-index: 10;
}

.dropdown li {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: var(--row-ghost);
}

.checked-in-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checked-in-list li {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  background-color: var(--row);
}
</style>