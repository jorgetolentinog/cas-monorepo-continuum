import { AvailabilityProfessional } from "./availability-professional";
import {
  medicapCalendarRepository,
  medicapExceptionRepository,
  medicapBookingRepository,
  medicapPreBookingRepository,
} from "../../repository";

export const availabilityProfessional = new AvailabilityProfessional(
  medicapCalendarRepository,
  medicapExceptionRepository,
  medicapBookingRepository,
  medicapPreBookingRepository
);
