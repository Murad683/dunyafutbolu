import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getAll() {
    return this.settingsService.getAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async update(@Body() body: { key: string; value: string }) {
    await this.settingsService.set(body.key, body.value);
    return { success: true };
  }
}
