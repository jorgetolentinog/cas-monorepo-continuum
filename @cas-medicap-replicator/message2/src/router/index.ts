import { Router } from "./router";
import { BookingRoute } from "./booking-route";
import { syncBooking } from "../app/booking/usecase/sync-booking";

export const router = new Router(new BookingRoute(syncBooking));
