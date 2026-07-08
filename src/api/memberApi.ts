import {MemberResponse} from "@/types/member";

export async function checkInMember(secretKey: string) {
    const checkinUrl = 'http://localhost:8080/member/checkin/' + secretKey
    const response = await fetchCheckin(checkinUrl)
    if (!response.ok) {
        const message = await response.text()
        throw new Error(message)
    }
}

export async function getMemberData(secretKey: string): Promise<MemberResponse> {
    const memberUrl = 'http://localhost:8080/member/' + secretKey
    const response = await fetch(memberUrl);
    if (response.status === 404) {
        //TODO add custom exception
        const error = new Error();
        ((error as any).status = 404);
        throw error;
    }
    return await response.json();
}


function fetchCheckin(url: string) {
    return fetch(url, {
        method: 'POST'
    })
    //TODO add exception handling
}