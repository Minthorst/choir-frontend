const API_BASE = 'http://localhost:8080'

export interface MeResponse {
    authenticated: boolean
    roles: string[]
}

export async function login(username: string, password: string): Promise<boolean> {
    const body = new URLSearchParams()
    body.set('username', username)
    body.set('password', password)

    const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body
    })
    return response.ok
}

export async function logout(): Promise<void> {
    await fetch(`${API_BASE}/api/logout`, {
        method: 'POST',
        credentials: 'include'
    })
}

export async function getMe(): Promise<MeResponse> {
    const response = await fetch(`${API_BASE}/api/me`, {
        credentials: 'include'
    })
    return response.json()
}
