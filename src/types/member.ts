import {Attendance, AttendanceResponse} from "./attendance";

export interface Member {
    name: string,
    commitTickets: number,
    regularTickets: number,
    pastAttendance: Attendance[]
}

export interface MemberResponse {
    name: string,
    regularTickets: number,
    commitTickets: number,
    pastAttendances: AttendanceResponse[]
}
