import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('instagram')
  async getInstagramPost(@Query('url') url: string) {
    if (!url) return { error: 'URL is required' };
    return await this.scraperService.scrapeInstagramPost(url);
  }
}
