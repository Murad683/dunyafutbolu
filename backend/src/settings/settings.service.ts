import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async onModuleInit() {
    // Initialize default settings if they don't exist
    const rotation = await this.get('ad_rotation');
    if (rotation === null) {
      await this.set('ad_rotation', 'false');
    }
  }

  async get(key: string): Promise<string | null> {
    const setting = await this.settingRepository.findOneBy({ key });
    return setting ? setting.value : null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.settingRepository.save({ key, value });
  }

  async getAll(): Promise<Record<string, string>> {
    const all = await this.settingRepository.find();
    return all.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  }
}
