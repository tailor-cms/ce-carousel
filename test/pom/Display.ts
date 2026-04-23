import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly root: Locator;
  readonly carousel: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.tce-carousel-root');
    this.carousel = this.root.locator('.v-carousel');
    this.items = this.carousel.locator('.v-window-item');
  }
}
