import {apiFetch} from "@/api/http";

export interface MeResponse {
    authenticated: boolean
    roles: string[]
}

export async function login(username: string, password: string): Promise<boolean> {
    const body = new URLSearchParams()
    body.set('username', username)
    body.set('password', password)

    try {
        await apiFetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body
        }, {handleUnauthorized: false})
        return true
    } catch {
        return false
    }
}

export async function logout(): Promise<void> {
    await apiFetch('/api/logout', {method: 'POST'}, {handleUnauthorized: false})
        .catch(() => {})
}

export async function getMe(): Promise<MeResponse> {
    const response = await apiFetch('/api/me', {}, {handleUnauthorized: false})
    return response.json()
}
