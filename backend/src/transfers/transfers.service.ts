import { Injectable, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from './entities/transfer.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransfersService implements OnModuleInit {
  private readonly logger = new Logger(TransfersService.name);
  constructor(@InjectRepository(Transfer) private repo: Repository<Transfer>) {}

  async onModuleInit() {
    this.logger.log('Updating PostgreSQL Enum type values...');
    try {
      // PostgreSQL-in daxili Enum tipinə yeni dəyərləri rəsmən əlavə edirik
      // Bu komanda transaction daxilində işləməyə bilər, ona görə ayrı-ayrı göndəririk
      await this.repo.query(`ALTER TYPE "transfers_type_enum" ADD VALUE IF NOT EXISTS 'Daimi Transfer'`);
      await this.repo.query(`ALTER TYPE "transfers_type_enum" ADD VALUE IF NOT EXISTS 'İcarə'`);
      await this.repo.query(`ALTER TYPE "transfers_type_enum" ADD VALUE IF NOT EXISTS 'Mübadilə'`);
      await this.repo.query(`ALTER TYPE "transfers_type_enum" ADD VALUE IF NOT EXISTS 'Digər'`);
      
      this.logger.log('PostgreSQL Enum values updated successfully.');
    } catch (err) {
      this.logger.warn('Enum update note (might already exist): ' + err.message);
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
