import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './uploads.controller';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const uploadsDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      dest: uploadsDir,
    }),
  ],
  controllers: [UploadsController],
})
export class UploadsModule {}
