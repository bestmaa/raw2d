# Docs Mobile Viewport Check

This check protects the small-screen docs and Studio experience for `/doc`, `/readme`, and `/studio`.

## What It Verifies

- `/doc`, `/readme`, and `/studio` return browser-loadable HTML through Vite
- docs and readme layouts collapse to one column below `760px`
- sticky sidebars become normal document flow on mobile
- search input can shrink without overflowing
- code blocks use horizontal scrolling instead of breaking the page
- live example panels stack below the topic content
- Studio app panels collapse to one column, wrap topbar actions, and keep the artboard inside the viewport

## Run

```bash
npm run test:browser:mobile-docs
```

The check starts a local Vite server, opens the docs routes through HTTP, and audits the mobile CSS contracts that make the routes usable on a phone-width viewport.

## Manual Browser Check

Open DevTools device mode at `390px` width and check:

- sidebar appears above content and remains readable
- search input and button fit the width
- long code blocks scroll horizontally
- next/previous buttons stack cleanly
- live control panels do not overlap content
- Studio grid stacks and panels remain scrollable
