import {apiFetch} from "@/api/http";

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
    const response = await apiFetch('/doorman/members')
    return response.json()
}

export async function getCheckedInMemberNames(): Promise<MemberNameResponse[]> {
    const response = await apiFetch('/doorman/checkedin')
    return response.json()
}

export async function checkInMemberById(id: number): Promise<DoormanCheckInResponse> {
    const response = await apiFetch(`/doorman/checkin/${id}`, {method: 'POST'})
    return response.json()
}
