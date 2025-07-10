import type * as common from '@tailor-cms/cek-common';

export interface CarouselItem {
  id: string;
  body: Record<string, any>;
  position: number;
}

export interface ElementData extends common.ElementConfig {
  embeds: Record<string, any>;
  items: Record<string, CarouselItem>;
  height: number;
}

export type DataInitializer = common.DataInitializer<ElementData>;
export type Element = common.Element<ElementData>;
export type ElementManifest = common.ElementManifest<ElementData>;
