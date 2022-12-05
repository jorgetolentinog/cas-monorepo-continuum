import { DynamoDBMedicapBookingRepository } from "./dynamodb-medicap-booking-repository";
import { DynamoDBMedicapPreBookingRepository } from "./dynamodb-medicap-pre-booking-repository";
import { DynamoDBMedicapReleaseRepository } from "./dynamodb-medicap-release-repository";
import { DynamoDBMedicapCalendarRepository } from "./dynamodb-medicap-calendar-repository";
import { DynamoDBMedicapExceptionRepository } from "./dynamodb-medicap-exception-repository";

const medicapBookingRepository = new DynamoDBMedicapBookingRepository();
const medicapPreBookingRepository = new DynamoDBMedicapPreBookingRepository();
const medicapReleaseRepository = new DynamoDBMedicapReleaseRepository();
const medicapCalendarRepository = new DynamoDBMedicapCalendarRepository();
const medicapExceptionRepository = new DynamoDBMedicapExceptionRepository();

export {
  medicapBookingRepository,
  medicapPreBookingRepository,
  medicapReleaseRepository,
  medicapCalendarRepository,
  medicapExceptionRepository,
};
