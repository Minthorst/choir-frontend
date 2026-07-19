import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import TicketLogView from './TicketLogView.vue'
import type {TicketLogEntry} from '@/types/ticketLog'

const entries: TicketLogEntry[] = [
    {timestamp: '2026-07-01T20:00:00', regularDelta: 1, commitDelta: 1, type: 'INITIAL_BALANCE'},
    {timestamp: '2026-07-10T19:30:00', regularDelta: 0, commitDelta: -1, type: 'CHECK_IN'},
    {timestamp: '2026-07-15T10:00:00', regularDelta: 5, commitDelta: 2, type: 'ADMIN_ADJUSTMENT'},
]

function mountView(logEntries: TicketLogEntry[] = entries) {
    return mount(TicketLogView, {
        props: {entries: logEntries},
        global: {stubs: {BaseButton: {template: '<button><slot/></button>'}}},
    })
}

describe('TicketLogView', () => {
    it('shows entries newest first with readable labels', () => {
        const wrapper = mountView()

        const reasons = wrapper.findAll('tbody tr').map((row) => row.findAll('td')[1].text())
        expect(reasons).toEqual(['Admin', 'Check-in', 'Init'])
    })

    it('renders signed amounts per ticket type and skips zero deltas', () => {
        const wrapper = mountView()

        const rows = wrapper.findAll('tbody tr')
        expect(rows[0].findAll('.delta').map((d) => d.text())).toEqual(['+5 Regular', '+2 Commit'])
        expect(rows[1].findAll('.delta').map((d) => d.text())).toEqual(['-1 Commit'])
    })

    it('colors additions green and deductions red', () => {
        const wrapper = mountView()

        const rows = wrapper.findAll('tbody tr')
        expect(rows[0].find('.delta').classes()).toContain('delta-positive')
        expect(rows[1].find('.delta').classes()).toContain('delta-negative')
    })

    it('shows an empty state when there are no entries', () => {
        const wrapper = mountView([])

        expect(wrapper.find('.empty-state').text()).toBe('No ticket activity yet')
        expect(wrapper.find('table').exists()).toBe(false)
    })

    it('paginates entries beyond the page size', async () => {
        const many: TicketLogEntry[] = Array.from({length: 7}, (_, i) => ({
            timestamp: `2026-07-${String(i + 1).padStart(2, '0')}T12:00:00`,
            regularDelta: 1,
            commitDelta: 0,
            type: 'ADMIN_ADJUSTMENT',
        }))
        const wrapper = mountView(many)

        expect(wrapper.findAll('tbody tr')).toHaveLength(5)
        expect(wrapper.find('.pagination span').text()).toBe('1 / 2')

        await wrapper.findAll('.pagination button')[1].trigger('click')

        expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    })
})
