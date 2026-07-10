import {MemberResponse} from "@/types/member";
import {apiFetch} from "@/api/http";

export async function checkInMember(secretKey: string): Promise<void> {
    await apiFetch(`/member/checkin/${secretKey}`, {method: 'POST'})
}

export async function getMemberData(secretKey: string): Promise<MemberResponse> {
    const response = await apiFetch(`/member/${secretKey}`)
    return response.json()
}
