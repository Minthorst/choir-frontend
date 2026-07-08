<script setup lang="ts">
import {computed, shallowRef} from "vue";
import { useQRCode } from '@vueuse/integrations/useQRCode'



const props = defineProps<{ secretKey: string }>()
const url = computed(() => `${window.location.origin}/member/${props.secretKey}`)
const text = shallowRef(url)
const qrcode = useQRCode(text.value)

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