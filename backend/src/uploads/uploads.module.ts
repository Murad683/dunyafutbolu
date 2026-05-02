import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { AzureStorageService } from './azure-storage.service';

@Module({
  controllers: [UploadsController],
  providers: [AzureStorageService],
})
export class UploadsModule {}
