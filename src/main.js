
import { createApp } from 'vue'
import App from './App.vue'
import {ref} from "vue";
import router from "@/router/index.js";
import "@/assets/theme.css";

createApp(App).use(router).mount('#app')
