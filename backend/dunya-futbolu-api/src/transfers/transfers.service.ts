import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from './entities/transfer.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(@InjectRepository(Transfer) private repo: Repository<Transfer>) {}

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
