import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from './entities/transfer.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);
  constructor(@InjectRepository(Transfer) private repo: Repository<Transfer>) {}

  findAll() {
    return this.repo.find({
      relations: ['league'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number) {
    const transfer = await this.repo.findOne({
      where: { id },
      relations: ['league'],
    });
    if (!transfer) throw new NotFoundException('Transfer not found');
    return transfer;
  }

  create(dto: CreateTransferDto) {
    const { leagueId, ...rest } = dto;
    const transfer = this.repo.create({
      ...rest,
      league: { id: leagueId } as any,
    });
    return this.repo.save(transfer);
  }

  async update(id: number, dto: UpdateTransferDto) {
    const { leagueId, ...rest } = dto;
    const updateData: any = { ...rest };
    if (leagueId) {
      updateData.league = { id: leagueId };
    }
    await this.findOne(id);
    await this.repo.save({ id, ...updateData });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Transfer deleted' };
  }
}
