import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import Modal from './Modal.vue'

describe('Modal', () => {
    it('renders slot content when open', () => {
        const wrapper = mount(Modal, {
            props: {isOpen: true},
            slots: {default: '<p>Hello</p>'},
        })

        expect(wrapper.text()).toContain('Hello')
    })

    it('renders nothing when closed', () => {
        const wrapper = mount(Modal, {props: {isOpen: false}})

        expect(wrapper.find('.modal-backdrop').exists()).toBe(false)
    })

    it('emits close when the backdrop or close button is clicked', async () => {
        const wrapper = mount(Modal, {props: {isOpen: true}})

        await wrapper.find('.modal-backdrop').trigger('click')
        await wrapper.find('.close-btn').trigger('click')

        expect(wrapper.emitted('close')).toHaveLength(2)
    })

    it('does not emit close when clicking inside the content', async () => {
        const wrapper = mount(Modal, {props: {isOpen: true}})

        await wrapper.find('.modal-content').trigger('click')

        expect(wrapper.emitted('close')).toBeUndefined()
    })
})
