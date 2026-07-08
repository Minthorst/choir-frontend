import {ref} from "vue";
import {getMe, login as apiLogin, logout as apiLogout} from "@/api/authApi";

const authenticated = ref(false)
const roles = ref<string[]>([])
const initialized = ref(false)

async function refresh() {
    const me = await getMe()
    authenticated.value = me.authenticated
    roles.value = me.roles
    initialized.value = true
}

function hasRole(role: string): boolean {
    return roles.value.includes('ROLE_' + role)
}

async function login(username: string, password: string): Promise<boolean> {
    const ok = await apiLogin(username, password)
    if (ok) {
        await refresh()
    }
    return ok
}

async function logout(): Promise<void> {
    await apiLogout()
    authenticated.value = false
    roles.value = []
}

export function useAuth() {
    return {authenticated, roles, initialized, refresh, hasRole, login, logout}
}
