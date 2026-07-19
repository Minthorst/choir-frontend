import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {ApiError, apiFetch, setUnauthorizedHandler} from './http'

function clearCookies() {
    document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0].trim()
        if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    })
}

describe('apiFetch', () => {
    const fetchMock = vi.fn()

    beforeEach(() => {
        vi.stubGlobal('fetch', fetchMock)
        fetchMock.mockReset()
        clearCookies()
        setUnauthorizedHandler(null as never)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('sends the CSRF token from the cookie on POST requests', async () => {
        document.cookie = 'XSRF-TOKEN=token-123'
        fetchMock.mockResolvedValue(new Response('ok', {status: 200}))

        await apiFetch('/admin/tickets', {method: 'POST'})

        const [, init] = fetchMock.mock.calls[0]
        expect((init.headers as Headers).get('X-XSRF-TOKEN')).toBe('token-123')
    })

    it('does not attach a CSRF token to GET requests', async () => {
        document.cookie = 'XSRF-TOKEN=token-123'
        fetchMock.mockResolvedValue(new Response('ok', {status: 200}))

        await apiFetch('/admin/members')

        const [, init] = fetchMock.mock.calls[0]
        expect((init.headers as Headers).get('X-XSRF-TOKEN')).toBeNull()
    })

    it('includes credentials and prefixes the API base path', async () => {
        fetchMock.mockResolvedValue(new Response('ok', {status: 200}))

        await apiFetch('/admin/members')

        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe('/api/admin/members')
        expect(init.credentials).toBe('include')
    })

    it('throws an ApiError with status and body text for error responses', async () => {
        fetchMock.mockResolvedValue(new Response('member not found', {status: 404}))

        const error = await apiFetch('/member/nope').catch((e) => e)

        expect(error).toBeInstanceOf(ApiError)
        expect(error.status).toBe(404)
        expect(error.message).toBe('member not found')
    })

    it('notifies the unauthorized handler on 401 responses', async () => {
        const handler = vi.fn()
        setUnauthorizedHandler(handler)
        fetchMock.mockResolvedValue(new Response('', {status: 401}))

        await apiFetch('/admin/members').catch(() => undefined)

        expect(handler).toHaveBeenCalledOnce()
    })

    it('skips the unauthorized handler when handleUnauthorized is false', async () => {
        const handler = vi.fn()
        setUnauthorizedHandler(handler)
        fetchMock.mockResolvedValue(new Response('', {status: 401}))

        await apiFetch('/api/me', {}, {handleUnauthorized: false}).catch(() => undefined)

        expect(handler).not.toHaveBeenCalled()
    })
})
