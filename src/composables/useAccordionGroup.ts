import {InjectionKey, Ref, ref, provide} from "vue";

export interface AccordionGroup {
    activeId: Ref<number | null>
    toggle: (id: number) => void
    setActive: (id: number) => void
}

export const accordionGroupKey: InjectionKey<AccordionGroup> = Symbol("accordionGroup")

export function provideAccordionGroup(): AccordionGroup {
    const activeId = ref<number | null>(null)
    const group: AccordionGroup = {
        activeId,
        toggle(id: number) {
            activeId.value = activeId.value === id ? null : id
        },
        setActive(id: number) {
            activeId.value = id
        }
    }
    provide(accordionGroupKey, group)
    return group
}

let nextCardId = 0

export function nextAccordionCardId(): number {
    return ++nextCardId
}
