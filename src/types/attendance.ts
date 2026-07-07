export interface Attendance {
    dateTime: string,
    status: 'PRESENT' | 'NO_SHOW'
}

export interface AttendanceResponse {
    attendedOn: string,
    status: 'PRESENT' | 'NO_SHOW'
}