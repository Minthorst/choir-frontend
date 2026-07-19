export type TicketLogEntryType =
    | 'INITIAL_BALANCE'
    | 'ADMIN_ADJUSTMENT'
    | 'CHECK_IN'
    | 'NO_SHOW_CHARGE'
    | 'FREE_SESSION_REFUND'

export interface TicketLogEntry {
    timestamp: string
    regularDelta: number
    commitDelta: number
    type: TicketLogEntryType
}
