import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Module({
  imports: [LoggingService],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggerModule {}
