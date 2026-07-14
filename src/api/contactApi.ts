import {apiFetch} from "@/api/http";

export interface ContactRequest {
    name: string
    email: string
    message: string
    page?: string
    memberKey?: string
    userAgent?: string
    viewport?: string
    clientTimestamp?: string
}

export async function sendFeedback(request: ContactRequest): Promise<void> {
    await apiFetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(request)
    })
}
