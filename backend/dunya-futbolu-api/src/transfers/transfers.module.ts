import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { Transfer } from './entities/transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer])],
  providers: [TransfersService],
  controllers: [TransfersController],
})
export class TransfersModule {}
