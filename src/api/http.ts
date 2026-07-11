export const API_BASE: string = import.meta.env.VITE_API_BASE_URL ?? `${import.meta.env.BASE_URL}api`

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

function readCsrfToken(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : null
}

export async function apiFetch(
    path: string,
    init: RequestInit = {},
    options: { handleUnauthorized?: boolean } = {}
): Promise<Response> {
    const method = (init.method ?? 'GET').toUpperCase()
    const headers = new Headers(init.headers)
    if (method !== 'GET' && method !== 'HEAD') {
        const csrfToken = readCsrfToken()
        if (csrfToken) {
            headers.set('X-XSRF-TOKEN', csrfToken)
        }
    }
    const response = await fetch(`${API_BASE}${path}`, {credentials: 'include', ...init, headers})
    if (!response.ok) {
        if (response.status === 401 && options.handleUnauthorized !== false) {
            unauthorizedHandler?.()
        }
        throw new ApiError(await response.text(), response.status)
    }
    return response
}
