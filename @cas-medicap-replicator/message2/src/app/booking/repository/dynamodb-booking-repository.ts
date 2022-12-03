import { Booking } from "../../booking/entity/booking";
import { BookingRepository } from "./booking-repository";

export class DynamoDBBookingRepository implements BookingRepository {
  async create(booking: Booking): Promise<void> {}
  async update(booking: Booking): Promise<void> {}
  async findById(bookingId: string): Promise<Booking | null> {
    return null;
  }
}
