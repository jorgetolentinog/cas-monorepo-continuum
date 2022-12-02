import { container } from "tsyringe";
import { MedicapBookingRepository } from "@/domain/ports/persistence/MedicapBookingRepository";
import { MedicapPreBookingRepository } from "@/domain/ports/persistence/MedicapPreBookingRepository";
import { MedicapReleaseRepository } from "@/domain/ports/persistence/MedicapReleaseRepository";
import { MedicapCalendarRepository } from "@/domain/ports/persistence/MedicapCalendarRepository";
import { MedicapExceptionRepository } from "@/domain/ports/persistence/MedicapExceptionRepository";
import { DynamoDBMedicapBookingRepository } from "@/infrastructure/adapter/persistence/DynamoDBMedicapBookingRepository";
import { DynamoDBMedicapPreBookingRepository } from "@/infrastructure/adapter/persistence/DynamoDBMedicapPreBookingRepository";
import { DynamoDBMedicapCalendarRepository } from "@/infrastructure/adapter/persistence/DynamoDBMedicapCalendarRepository";
import { DynamoDBMedicapExceptionRepository } from "@/infrastructure/adapter/persistence/DynamoDBMedicapExceptionRepository";
import { DynamoDBMedicapReleaseRepository } from "@/infrastructure/adapter/persistence/DynamoDBMedicapReleaseRepository";
import { Logger } from "@/domain/ports/Logger";
import { SimpleLogger } from "../adapter/logger/SimpleLogger";
import { StructuredLogger } from "../adapter/logger/StructuredLogger";

container.register<MedicapBookingRepository>(
  "MedicapBookingRepository",
  DynamoDBMedicapBookingRepository
);

container.register<MedicapPreBookingRepository>(
  "MedicapPreBookingRepository",
  DynamoDBMedicapPreBookingRepository
);

container.register<MedicapReleaseRepository>(
  "MedicapReleaseRepository",
  DynamoDBMedicapReleaseRepository
);

container.register<MedicapCalendarRepository>(
  "MedicapCalendarRepository",
  DynamoDBMedicapCalendarRepository
);

container.register<MedicapExceptionRepository>(
  "MedicapExceptionRepository",
  DynamoDBMedicapExceptionRepository
);

if (process.env.IS_OFFLINE) {
  container.register<Logger>('Logger', SimpleLogger)
} else {
  container.register<Logger>('Logger', StructuredLogger)
}

export { container };
