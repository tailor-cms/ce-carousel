import baseManifest from '@tailor-cms/ce-carousel-manifest';
import type { ElementManifest } from '@tailor-cms/ce-carousel-manifest';

import Display from './components/Display.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Display,
};

export default manifest;
export { Display };
