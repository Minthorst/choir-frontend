import {apiFetch} from "@/api/http";

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

export interface CreateMemberResponse {
    secretKey: string
}

export async function getAllSessions(): Promise<SessionResponse[]> {
    const response = await apiFetch('/admin/sessions')
    return response.json()
}

export async function getAttendingMembers(sessionId: number): Promise<AdminMemberInfoResponse[]> {
    const response = await apiFetch(`/admin/sessions/members/${sessionId}`)
    return response.json()
}

export async function finalizeSession(sessionId: number, sessionType: string): Promise<EndSessionResponse> {
    const response = await apiFetch('/admin/finalizeSession', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({sessionId, sessionType})
    })
    return response.json()
}

export async function getAllMembers(): Promise<AdminMemberInfoResponse[]> {
    const response = await apiFetch('/admin/members')
    return response.json()
}

export async function addTickets(memberId: number, regularTickets: number, commitTickets: number): Promise<void> {
    await apiFetch('/admin/tickets', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({memberId, regularTickets, commitTickets})
    })
}

export async function createMember(name: string, regularTickets: number, commitTickets: number): Promise<CreateMemberResponse> {
    const response = await apiFetch('/admin/member', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, regularTickets, commitTickets})
    })
    return response.json()
}
