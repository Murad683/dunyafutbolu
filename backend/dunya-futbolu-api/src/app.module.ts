import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ArticlesModule } from './articles/articles.module';
import { TransfersModule } from './transfers/transfers.module';
import { VideosModule } from './videos/videos.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (c: ConfigService) => ({
        type: 'postgres',
        host: c.get('DB_HOST'),
        port: parseInt(c.get<string>('DB_PORT') || '5432', 10),
        username: c.get('DB_USERNAME'),
        password: c.get('DB_PASSWORD'),
        database: c.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    ArticlesModule,
    TransfersModule,
    VideosModule,
    UploadsModule,
  ],
})
export class AppModule {}
