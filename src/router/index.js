import {createRouter, createWebHistory} from "vue-router";
import MemberDash from "@/components/member/MemberDash.vue";
import AdminDash from "@/components/admin/AdminDash.vue";
import DoormanDash from "@/components/doorMan/DoormanDash.vue";
import MemberLogin from "@/components/member/MemberLogin.vue";

const routes = [
    { path: '/', redirect: '/member' },
    { path: '/member', name: 'member-login', component: MemberLogin },
    {path: '/member/:secretKey', name: 'member-dash', component: MemberDash},
    { path: '/admin', name: 'admin', component: AdminDash },
    { path: '/doorman', name: 'doorman', component: DoormanDash },
]

export default createRouter({
    history: createWebHistory(),
    routes
})