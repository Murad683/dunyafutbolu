import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Transfer } from './entities/transfer.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransfersService implements OnModuleInit {
  private readonly logger = new Logger(TransfersService.name);
  constructor(@InjectRepository(Transfer) private repo: Repository<Transfer>) {}

  async onModuleInit() {
    this.logger.log('Force migrating transfer table to bypass enum constraints...');
    
    try {
      // 1. Force the column to be varchar using Raw SQL (this bypasses enum checks)
      await this.repo.query('ALTER TABLE "transfers" ALTER COLUMN "type" TYPE varchar');
      
      // 2. Now perform the data migration
      // Migrate 'giriş' and 'çıxış' to 'Daimi Transfer'
      const legacyToDaimi = await this.repo.update(
        { type: In(['giriş', 'çıxış']) as any },
        { type: 'Daimi Transfer' }
      );
      if (legacyToDaimi.affected) {
        this.logger.log(`Migrated ${legacyToDaimi.affected} transfers to "Daimi Transfer"`);
      }

      // Migrate 'icarə' (lowercase) to 'İcarə' (Capitalized)
      const legacyToIcare = await this.repo.update(
        { type: 'icarə' as any },
        { type: 'İcarə' }
      );
      if (legacyToIcare.affected) {
        this.logger.log(`Migrated ${legacyToIcare.affected} transfers to "İcarə"`);
      }

      this.logger.log('Transfer migration check complete.');
    } catch (err) {
      this.logger.error('Migration failed:', err.message);
    }
  }

  findAll() {
    return this.repo.find({ order: { date: 'DESC' } });
  }

  async findOne(id: number) {
    const transfer = await this.repo.findOne({ where: { id } });
    if (!transfer) throw new NotFoundException('Transfer not found');
    return transfer;
  }

  create(dto: CreateTransferDto) {
    return this.repo.save(dto);
  }

  async update(id: number, dto: UpdateTransferDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Transfer deleted' };
  }
}
