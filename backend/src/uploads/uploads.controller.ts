import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`File type ${ext} is not allowed`), false);
        }
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    return { url: `/uploads/${file.filename}` };
  }
}
