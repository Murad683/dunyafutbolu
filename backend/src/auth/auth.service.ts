import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { Admin } from './entities/admin.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!email || !password) return;

    // We ensure that the admin user in the DB always matches the ENV variables
    let admin = await this.adminRepo.findOne({ where: {} });
    const hashed = await bcrypt.hash(password, 12);

    if (!admin) {
      admin = this.adminRepo.create({ email, password: hashed });
      await this.adminRepo.save(admin);
      console.log('Admin seeded from config:', email);
    } else {
      // Update existing admin to match current config
      admin.email = email;
      admin.password = hashed;
      await this.adminRepo.save(admin);
      console.log('Admin credentials synchronized with config');
    }
  }

  async login(dto: LoginDto) {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: admin.id, email: admin.email });
    return { access_token: token, admin: { id: admin.id, email: admin.email } };
  }
}
