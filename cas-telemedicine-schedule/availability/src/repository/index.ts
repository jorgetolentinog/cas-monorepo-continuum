import { DynamoDBMedicapBookingRepository } from "./dynamodb/dynamodb-medicap-booking-repository";
import { DynamoDBMedicapPreBookingRepository } from "./dynamodb/dynamodb-medicap-pre-booking-repository";
import { DynamoDBMedicapReleaseRepository } from "./dynamodb/dynamodb-medicap-release-repository";
import { DynamoDBMedicapCalendarRepository } from "./dynamodb/dynamodb-medicap-calendar-repository";
import { DynamoDBMedicapExceptionRepository } from "./dynamodb/dynamodb-medicap-exception-repository";

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
