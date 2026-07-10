const API_BASE = 'http://localhost:8080'

export interface MemberNameResponse {
    id: number
    name: string
}

export interface DoormanCheckInResponse {
    name: string
    regularTickets: number
    commitTickets: number
    checkedIn: boolean
}

export async function getMemberNames(): Promise<MemberNameResponse[]> {
    const response = await fetch(`${API_BASE}/doorman/members`, {credentials: 'include'})
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export async function getCheckedInMemberNames(): Promise<MemberNameResponse[]> {
    const response = await fetch(`${API_BASE}/doorman/checkedin`, {credentials: 'include'})
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

export async function checkInMemberById(id: number): Promise<DoormanCheckInResponse> {
    const response = await fetch(`${API_BASE}/doorman/checkin/${id}`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}
