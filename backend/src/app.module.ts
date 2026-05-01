import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ArticlesModule } from './articles/articles.module';
import { TransfersModule } from './transfers/transfers.module';
import { VideosModule } from './videos/videos.module';
import { UploadsModule } from './uploads/uploads.module';
import { BannersModule } from './banners/banners.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (c: ConfigService) => {
        const databaseUrl = c.get<string>('DATABASE_URL');
        const ssl = c.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false;

        return databaseUrl
          ? {
              type: 'postgres' as const,
              url: databaseUrl,
              ssl,
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: true,
            }
          : {
              type: 'postgres' as const,
              host: c.get('DB_HOST') || 'localhost',
              port: parseInt(c.get<string>('DB_PORT') || '5432', 10),
              username: c.get('DB_USERNAME') || 'postgres',
              password: c.get('DB_PASSWORD') || 'postgres',
              database: c.get('DB_NAME') || 'dunyafutbolu',
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: true,
            };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    ArticlesModule,
    TransfersModule,
    VideosModule,
    UploadsModule,
    BannersModule,
    NewsletterModule,
  ],
})
export class AppModule {}
