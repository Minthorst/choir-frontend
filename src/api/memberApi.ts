import {MemberResponse} from "@/types/member";
import {API_BASE, apiFetch} from "@/api/http";

export async function checkInMember(secretKey: string): Promise<void> {
    await apiFetch(`/member/checkin/${secretKey}`, {method: 'POST'})
}

export function getScheduleIcsUrl(): string {
    return `${API_BASE}/member/schedule/ics`
}

export async function getMemberData(secretKey: string): Promise<MemberResponse> {
    const response = await apiFetch(`/member/${secretKey}`)
    return response.json()
}
