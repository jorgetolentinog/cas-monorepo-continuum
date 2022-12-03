import { SimpleLogger } from "./simple-logger";
import { StructuredLogger } from "./structured-logger";

export const logger = process.env.IS_OFFLINE
  ? new SimpleLogger()
  : new StructuredLogger();
