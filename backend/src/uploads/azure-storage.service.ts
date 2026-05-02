import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

@Injectable()
export class AzureStorageService implements OnModuleInit {
  private readonly uploadsDir = join(process.cwd(), 'uploads');
  private readonly containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'uploads';

  onModuleInit() {
    // Ensure local uploads directory exists anyway as fallback
    if (!existsSync(this.uploadsDir)) {
      mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    try {
      if (!file.buffer) {
        throw new Error('File buffer is empty');
      }

      // 1. Always compress the image first
      const compressedBuffer = await sharp(file.buffer)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `${randomUUID()}.webp`;

      // 2. Decide where to upload
      if (connectionString && connectionString.startsWith('DefaultEndpointsProtocol')) {
        // AZURE UPLOAD
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(this.containerName);
        
        // Ensure container exists and is public
        await containerClient.createIfNotExists({ access: 'blob' });

        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        await blockBlobClient.uploadData(compressedBuffer, {
          blobHTTPHeaders: { blobContentType: 'image/webp' },
        });

        console.log(`Azure upload successful: ${blockBlobClient.url}`);
        return blockBlobClient.url;
      } else {
        // LOCAL UPLOAD (Fallback)
        const filePath = join(this.uploadsDir, fileName);
        writeFileSync(filePath, compressedBuffer);
        
        console.log(`Local upload fallback successful: ${fileName}`);
        return `uploads/${fileName}`;
      }
    } catch (error) {
      console.error('Upload Error:', error);
      throw new InternalServerErrorException(`Upload Failed: ${error.message}`);
    }
  }
}
