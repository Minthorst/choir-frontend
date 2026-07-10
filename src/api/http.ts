const API_BASE: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

type UnauthorizedHandler = () => void
let unauthorizedHandler: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
    unauthorizedHandler = handler
}

export async function apiFetch(
    path: string,
    init: RequestInit = {},
    options: { handleUnauthorized?: boolean } = {}
): Promise<Response> {
    const response = await fetch(`${API_BASE}${path}`, {credentials: 'include', ...init})
    if (!response.ok) {
        if (response.status === 401 && options.handleUnauthorized !== false) {
            unauthorizedHandler?.()
        }
        throw new ApiError(await response.text(), response.status)
    }
    return response
}
