import { Router } from "./router";
import { BookingRoute } from "./booking-route";
import { PreBookingRoute } from "./pre-booking-route";
import { ReleaseRoute } from "./release-route";
import { CalendarRoute } from "./calendar-route";
import { ExceptionRoute } from "./exception-route";
import { syncBooking } from "../app/booking/usecase/sync-booking";
import { syncPreBooking } from "../app/pre-booking/usecase/sync-pre-booking";
import { syncRelease } from "../app/release/usecase/sync-release";
import { syncCalendar } from "../app/calendar/usecase/sync-calendar";
import { syncException } from "../app/exception/usecase/sync-exception";

export const router = new Router(
  new BookingRoute(syncBooking),
  new PreBookingRoute(syncPreBooking),
  new ReleaseRoute(syncRelease),
  new CalendarRoute(syncCalendar),
  new ExceptionRoute(syncException)
);
