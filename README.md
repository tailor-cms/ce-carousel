# Carousel

Composite carousel content element that groups embedded content elements into
sortable slides.

**Type:** `CAROUSEL`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `items` | `Record<string, CarouselItem>` | Slides, keyed by id |
| `embeds` | `Record<string, any>` | Embedded elements referenced by slides |
| `height` | `number` | Carousel height in pixels (200-3000) |

Each `CarouselItem` has `{ id, body, position }`, where `body` maps embed ids
to `true` and `position` drives the slide order.

## Edit

- Draggable list of slides with per-slide embedded content container
- Delete slide action (disabled when only one slide remains)
- Add Slide button appends a new empty slide
- Height field in the top toolbar (with validation)

## Display

- Renders slides in a Vuetify carousel at the configured height
- Each slide renders its embedded elements; shows an info alert when empty

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```
