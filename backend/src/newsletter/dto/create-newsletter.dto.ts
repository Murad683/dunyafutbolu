import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsletterDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
