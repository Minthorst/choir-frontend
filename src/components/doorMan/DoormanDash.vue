<script setup lang="ts">

import {QrcodeStream} from "vue-qrcode-reader";
import {ref} from "vue";
import {checkInMember, getMemberData} from "@/api/memberApi";
import Modal from "@/components/ui/Modal.vue";

const scannerOn = ref(false)
const qrScannerResponse = ref('')
const checkInSuccess = ref('pending')

function toggleScanner() {
  scannerOn.value = !scannerOn.value
}

function constructQRScannerResponse(secretKey: string) {
  getMemberData(secretKey).then((member) => {
    qrScannerResponse.value = member.name + ' checked in successfully with ' + member.regularTickets + ' Regular and ' + member.commitTickets + ' Commit Tickets remaining'
  })
}

function onDetect(detectedCodes: any) {
  toggleScanner()
  //TODO exception when unexpected QR
  const secretKey = extractSecretKeyFromUrl(detectedCodes[0].rawValue)
  checkInMember(extractSecretKeyFromUrl(detectedCodes[0].rawValue)).then(() => {
    constructQRScannerResponse(secretKey)
    checkInSuccess.value = 'success'
  }).catch((e) => {
    if (e.message.startsWith("Member is already checked in to current Session")) {
      constructQRScannerResponse(secretKey)
      checkInSuccess.value = 'success'
    } else {
      qrScannerResponse.value = e.message
      checkInSuccess.value = 'fail'
    }
  })
}

function extractSecretKeyFromUrl(rawUrl: string) {
  return new URL(rawUrl).pathname.split('/').filter(Boolean).pop()!
}
</script>

<template>
  <button @click="toggleScanner">scan QR-Code</button>
  <modal :is-open="scannerOn" @close="toggleScanner">
    <qrcode-stream @detect="onDetect"></qrcode-stream>
  </modal>
  <modal class="success-modal" :is-open="checkInSuccess === 'success'" @close="checkInSuccess='pending'">
    <p>{{ qrScannerResponse }}</p>
  </modal>
  <modal class="fail-modal" :is-open="checkInSuccess === 'fail'" @close="checkInSuccess='pending'">
    <p>{{ qrScannerResponse }}</p>
  </modal>

</template>

<style scoped>
.success-modal :deep(.modal-content) {
  background-color: #15803d;
  color: #ffffff;
}

.fail-modal :deep(.modal-content) {
  background-color: #b91c1c;
  color: #ffffff;
}

button {
  display: block;
  margin: 2rem auto;
  background-color: var(--accent);
  color: var(--fg);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.6rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  min-height: 2.75rem;
}

button:hover {
  background-color: var(--accent-hover);
}

:deep(video) {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}
</style>