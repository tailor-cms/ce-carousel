import { OpenAISchema } from '@tailor-cms/cek-common';
import { v4 as uuid } from 'uuid';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

const id1 = uuid();
const id2 = uuid();

// Element unique id within the target system (e.g. Tailor)
export const type = 'CAROUSEL';

// Display name (e.g. shown to the author)
export const name = 'Carousel';

// Function which inits element state (data property on the Content Element
// entity)
export const initState: DataInitializer = (): ElementData => ({
  embeds: {},
  items: {
    [id1]: {
      id: id1,
      body: {},
      position: 1,
    },
    [id2]: {
      id: id2,
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

export const ai = {
  Schema: {
    type: 'json_schema',
    name: 'ce_carousel',
    schema: {
      type: 'object',
      properties: {
        slides: { type: 'array', items: { type: 'string', minItems: 2 } },
      },
      required: ['slides'],
      additionalProperties: false,
    },
  } as OpenAISchema,
  getPrompt: () => `
    Generate a carousel content element as an object with the following
    properties: { "slides": [] }
    where:
      - 'slides' is an array of slides in the carousel. Each array element
        contains text to be displayed in the slide. Each slide should have a few
        paragraphs about the topic.
  `,
  processResponse: (val: any) => {
    const slides = val.slides.reduce(
      (acc: Record<string, any>, content: string, index: number) => {
        const embedId = uuid();
        const itemId = uuid();
        acc.embeds[embedId] = {
          id: embedId,
          data: { content },
          embedded: true,
          position: 1,
          type: 'TIPTAP_HTML',
        };
        acc.items[itemId] = {
          id: itemId,
          body: { [embedId]: true },
          position: index + 1,
        };
        return acc;
      },
      { items: {}, embeds: {} },
    );
    return {
      ...slides,
      height: 350,
    };
  },
};

const manifest: ElementManifest = {
  type,
  version: '1.0',
  name,
  isComposite: true,
  ssr: false,
  initState,
  ui,
  ai,
};

export default manifest;
export * from './interfaces';
