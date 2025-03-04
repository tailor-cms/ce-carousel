import { v4 as uuid } from 'uuid';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

const id = uuid();

// Element unique id within the target system (e.g. Tailor)
export const type = 'CAROUSEL';

// Display name (e.g. shown to the author)
export const name = 'Carousel';

// Function which inits element state (data property on the Content Element
// entity)
export const initState: DataInitializer = (): ElementData => ({
  embeds: {},
  items: {
    [id]: {
      id,
      body: {},
      position: 1,
    },
  },
  height: 500,
});

// Can be loaded from package.json
export const version = '1.0';

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-view-carousel',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

const manifest: ElementManifest = {
  type,
  version: '1.0',
  name,
  isComposite: true,
  ssr: false,
  initState,
  ui,
};

export default manifest;
export * from './interfaces';
