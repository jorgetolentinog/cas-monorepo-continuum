import { Calendar } from '../../entity/Calendar'

export interface CalendarRepository {
  create: (calendar: Calendar) => Promise<void>
  update: (calendar: Calendar) => Promise<void>
  findById: (calendarId: string) => Promise<Calendar | null>
}
