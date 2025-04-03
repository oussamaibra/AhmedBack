import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScraperService {
  async scrapeInstagramPost(url: string): Promise<any> {
    try {
      const browser = await puppeteer.launch({
        headless: 'new', // Runs Puppeteer in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for some hosting providers
      });

      //   in vps
      // const browser = await puppeteer.launch({
      //     executablePath: "/usr/bin/chromium", // Use system-installed Chromium
      //     args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for non-root users
      //   });

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Extract post details
      const data = await page.evaluate(() => {
        const imageElement = document.querySelector(
          "meta[property='og:image']",
        );
        const titleElement = document.querySelector(
          "meta[property='og:title']",
        );
        const descriptionElement = document.querySelector(
          "meta[property='og:description']",
        );

        // Match likes
        const likesMatch = descriptionElement
          .getAttribute('content')
          .match(/([0-9.,]+[KM]?) likes/);
        // Match comments
        const commentsMatch = descriptionElement
          .getAttribute('content')
          .match(/([0-9.,]+[KM]?) comments/);

        return {
          imageUrl: imageElement ? imageElement.getAttribute('content') : null,
          title: titleElement ? titleElement.getAttribute('content') : null,
          likes: likesMatch ? likesMatch[1] : null,
          comments: commentsMatch ? commentsMatch[1] : null,
          description: descriptionElement
            ? descriptionElement.getAttribute('content')
            : null,
        };
      });

      await browser.close();
      return data;
    } catch (error) {
      console.error('Error scraping Instagram post:', error);
      return { error: 'Failed to scrape the Instagram post' };
    }
  }
}
