import {beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import AdminDash from './AdminDash.vue'
import type {AdminMemberInfoResponse} from '@/api/adminApi'
import {getAllMembers, getAllSessions} from '@/api/adminApi'

vi.mock('@/api/adminApi', () => ({
    getAllSessions: vi.fn(),
    getAttendingMembers: vi.fn(),
    finalizeSession: vi.fn(),
    getAllMembers: vi.fn(),
    addTickets: vi.fn(),
    setMemberArchived: vi.fn(),
    createMember: vi.fn(),
}))

function member(partial: Partial<AdminMemberInfoResponse> & { id: number; name: string }): AdminMemberInfoResponse {
    return {
        regularTickets: 0,
        commitTickets: 0,
        secretKey: `key-${partial.id}`,
        checkedIn: false,
        archived: false,
        ...partial,
    }
}

const members = [
    member({id: 1, name: 'Zoe', regularTickets: 3}),
    member({id: 2, name: 'Anna', regularTickets: 2, commitTickets: 1}),
    member({id: 3, name: 'Mia', regularTickets: -1, commitTickets: 5}),
    member({id: 4, name: 'Ben', commitTickets: -2}),
    member({id: 5, name: 'Old Member', regularTickets: 1, archived: true}),
]

// BaseCard collapses its content by default; render the slots unconditionally in tests.
const stubs = {
    BaseCard: {template: '<div><slot name="header"/><slot/><slot name="footer"/></div>'},
    BaseButton: {template: '<button><slot/></button>'},
    Modal: true,
    ResultModal: true,
}

async function mountDash(): Promise<VueWrapper> {
    const wrapper = mount(AdminDash, {global: {stubs}})
    await flushPromises()
    return wrapper
}

function memberRows(wrapper: VueWrapper) {
    return wrapper.findAll('.members-table tbody tr')
}

function memberNames(wrapper: VueWrapper) {
    return memberRows(wrapper).map((row) => row.find('td').text())
}

describe('AdminDash member list', () => {
    beforeEach(() => {
        vi.mocked(getAllSessions).mockResolvedValue([])
        vi.mocked(getAllMembers).mockResolvedValue(members)
    })

    it('shows members with negative tickets first, then the rest alphabetically', async () => {
        const wrapper = await mountDash()

        expect(memberNames(wrapper)).toEqual(['Ben', 'Mia', 'Anna', 'Zoe'])
    })

    it('marks a member as negative if either ticket type is below zero', async () => {
        const wrapper = await mountDash()

        const rows = memberRows(wrapper)
        const classesByName = Object.fromEntries(
            rows.map((row) => [row.find('td').text(), row.find('td').classes()]))
        // Mia has a positive ticket sum (-1 + 5) but a negative regular balance
        expect(classesByName['Mia']).toContain('negative-tickets')
        expect(classesByName['Ben']).toContain('negative-tickets')
        expect(classesByName['Anna']).not.toContain('negative-tickets')
        expect(classesByName['Zoe']).not.toContain('negative-tickets')
    })

    it('keeps negative members first when the name sort is reversed', async () => {
        const wrapper = await mountDash()

        await wrapper.find('.members-table thead th').trigger('click')

        expect(memberNames(wrapper)).toEqual(['Mia', 'Ben', 'Zoe', 'Anna'])
    })

    it('hides archived members until the toggle is enabled', async () => {
        const wrapper = await mountDash()

        expect(memberNames(wrapper)).not.toContain('Old Member · archiviert')

        await wrapper.find('.show-archived input').setValue(true)

        expect(memberNames(wrapper)).toContain('Old Member · archiviert')
    })

    it('filters members by search input', async () => {
        const wrapper = await mountDash()

        await wrapper.find('.member-search').setValue('zo')

        expect(memberNames(wrapper)).toEqual(['Zoe'])
    })
})
