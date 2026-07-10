const API_BASE = 'http://localhost:8080'

export interface SessionResponse {
    id: number
    startTime: string
    isOpen: boolean
    sessionType: 'REGULAR_ONLY' | 'COMMIT' | 'NONE' | 'AUTO_CLOSE'
    amountOfAttendees: number
}

export interface AdminMemberInfoResponse {
    id: number
    name: string
    regularTickets: number
    commitTickets: number
    secretKey: string
    checkedIn: boolean
}

export interface EndSessionResponse {
    presentMembers: number
    absentCommitMembers: number
}

export async function getAllSessions(): Promise<SessionResponse[]> {
    const response = await fetch(`${API_BASE}/admin/sessions`, {credentials: 'include'})
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export async function getAttendingMembers(sessionId: number): Promise<AdminMemberInfoResponse[]> {
    const response = await fetch(`${API_BASE}/admin/sessions/members/${sessionId}`, {credentials: 'include'})
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export async function finalizeSession(sessionId: number, sessionType: string): Promise<EndSessionResponse> {
    const response = await fetch(`${API_BASE}/admin/finalizeSession`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({sessionId, sessionType})
    })
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export async function getAllMembers(): Promise<AdminMemberInfoResponse[]> {
    const response = await fetch(`${API_BASE}/admin/members`, {credentials: 'include'})
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export async function addTickets(memberId: number, regularTickets: number, commitTickets: number): Promise<void> {
    const response = await fetch(`${API_BASE}/admin/tickets`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({memberId, regularTickets, commitTickets})
    })
    if (!response.ok) {
        throw new Error(await response.text())
    }
}

export interface CreateMemberResponse {
    secretKey: string
}

export async function createMember(name: string, regularTickets: number, commitTickets: number): Promise<CreateMemberResponse> {
    const response = await fetch(`${API_BASE}/admin/member`, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, regularTickets, commitTickets})
    })
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}
