<script setup lang="ts">
import {computed} from "vue";
import {useRouter} from "vue-router";
import { useQRCode } from '@vueuse/integrations/useQRCode'

const props = defineProps<{ secretKey: string }>()
const router = useRouter()
const url = computed(() =>
    window.location.origin + router.resolve({name: 'member-dash', params: {secretKey: props.secretKey}}).href)
const qrcode = useQRCode(url)
</script>

<template>
  <img :src="qrcode" alt="QR Code" />
</template>

<style scoped>
img {
  display: block;
  width: 100%;
  max-width: 240px;
  height: auto;
  margin: 0 auto;
  border-radius: var(--radius-md);
  background: #ffffff;
  padding: 0.75rem;
  box-sizing: border-box;
}
</style>