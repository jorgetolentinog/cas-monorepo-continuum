import { PreBooking } from "../entity/pre-booking";

export interface PreBookingRepository {
  create: (preBooking: PreBooking) => Promise<void>;
  update: (preBooking: PreBooking) => Promise<void>;
  findById: (preBookingId: string) => Promise<PreBooking | null>;
}
