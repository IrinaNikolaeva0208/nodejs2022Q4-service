import { LoggerService } from '@nestjs/common';
import { logToFile } from './logToFile';

export class LoggingService implements LoggerService {
  log(message: any) {
    logToFile('\n' + message);
  }

  error(message: any) {
    logToFile('\nERROR:\n' + message);
  }

  warn(message: any) {
    logToFile('\nWARN:\n' + message);
  }

  debug?(message: any) {
    logToFile('\nDEBUG\n' + message);
  }

  verbose?(message: any) {
    logToFile('\nVERBOSE\n' + message);
  }
}
