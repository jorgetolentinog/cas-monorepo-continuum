import { Calendar } from '../entity/calendar'

export interface CalendarRepository {
  create: (calendar: Calendar) => Promise<void>
  update: (calendar: Calendar) => Promise<void>
  findById: (calendarId: string) => Promise<Calendar | null>
}
