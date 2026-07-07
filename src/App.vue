<script setup lang="ts">
import {ref} from "vue";

import TheHeader from "@/components/TheHeader.vue";
</script>

<template>
<the-header @select="activeComponent = $event"/>
<router-view/>
</template>

<style scoped>

</style>
