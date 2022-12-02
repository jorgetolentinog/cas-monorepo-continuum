import { Booking } from '../../entity/Booking'

export interface BookingRepository {
  create: (booking: Booking) => Promise<void>
  update: (booking: Booking) => Promise<void>
  findById: (bookingId: string) => Promise<Booking | null>
}
