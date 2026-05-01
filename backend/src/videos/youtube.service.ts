import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface YouTubeMeta {
  youtubeId: string;
  title: string;
  views: string;
  thumbnailUrl: string;
}

@Injectable()
export class YoutubeService {
  private readonly apiKey: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('YOUTUBE_API_KEY') || '';
  }

  extractVideoId(url: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    throw new BadRequestException('Invalid YouTube URL format');
  }

  formatViewCount(count: string): string {
    const num = parseInt(count, 10);
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return String(num);
  }

  async fetchMeta(url: string): Promise<YouTubeMeta> {
    const youtubeId = this.extractVideoId(url);
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${youtubeId}&key=${this.apiKey}`;

    const response = await axios.get(apiUrl);
    const items = response.data.items;

    if (!items || items.length === 0) {
      throw new BadRequestException('YouTube video not found or is private');
    }

    const snippet = items[0].snippet;
    const stats = items[0].statistics;
    const thumbnails = snippet.thumbnails;
    const thumbnailUrl =
      thumbnails?.maxres?.url ||
      thumbnails?.standard?.url ||
      thumbnails?.high?.url ||
      thumbnails?.medium?.url ||
      thumbnails?.default?.url ||
      '';

    return {
      youtubeId,
      title: snippet.title,
      views: this.formatViewCount(stats.viewCount || '0'),
      thumbnailUrl,
    };
  }
}
