import {createRouter, createWebHistory} from "vue-router";
import MemberDash from "@/components/member/MemberDash.vue";
import AdminDash from "@/components/admin/AdminDash.vue";
import DoormanDash from "@/components/doorMan/DoormanDash.vue";
import MemberLogin from "@/components/member/MemberLogin.vue";
import PasswordGate from "@/components/PasswordGate.vue";
import {useAuth} from "@/composables/useAuth";
import {setPendingRedirect} from "@/router/pendingRedirect";

const routes = [
    { path: '/', redirect: '/member' },
    { path: '/member', name: 'member-login', component: MemberLogin },
    {path: '/member/:secretKey', name: 'member-dash', component: MemberDash},
    { path: '/admin', name: 'admin', component: AdminDash },
    { path: '/doorman', name: 'doorman', component: DoormanDash },
    { path: '/login', name: 'login', component: PasswordGate },
]

export const ROUTE_ROLE = {
    'member-login': 'MEMBER',
    'member-dash': 'MEMBER',
    'doorman': 'DOORMAN',
    'admin': 'ADMIN',
}

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to) => {
    const requiredRole = ROUTE_ROLE[to.name]
    if (!requiredRole) return true

    const {initialized, authenticated, hasRole, refresh} = useAuth()
    if (!initialized.value) {
        await refresh()
    }
    if (authenticated.value && hasRole(requiredRole)) {
        return true
    }
    setPendingRedirect(to.fullPath)
    return {name: 'login'}
})

export default router