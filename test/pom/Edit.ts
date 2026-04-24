import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly root: Locator;
  readonly slides: Locator;
  readonly addSlideBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.tce-carousel');
    this.slides = this.root.locator('.carousel-item');
    this.addSlideBtn = this.editor.getByRole('button', { name: 'Add Slide' });
  }

  slideAt(index: number): Locator {
    return this.slides.nth(index);
  }

  slideHeader(index: number): Locator {
    return this.slideAt(index).locator('.v-toolbar');
  }

  deleteBtn(slideIndex: number): Locator {
    return this.slideHeader(slideIndex).getByRole('button', {
      name: 'Delete slide',
      exact: true,
    });
  }

  addEmbedBtn(slideIndex: number): Locator {
    return this.slideAt(slideIndex).getByRole('button', { name: 'Add content' });
  }
}
