# Docs Mobile Viewport Check

Ye check `/doc` aur `/readme` ke small-screen docs experience ko protect karta hai.

## Kya Verify Hota Hai

- `/doc` aur `/readme` Vite ke through browser-loadable HTML return karein
- docs aur readme layouts `760px` ke neeche one column ho jayein
- sticky sidebars mobile par normal document flow me aa jayein
- search input overflow ke bina shrink ho sake
- code blocks page todne ke bajay horizontal scroll use karein
- live example panels topic content ke neeche stack hon

## Run

```bash
npm run test:browser:mobile-docs
```

Check local Vite server start karta hai, docs routes ko HTTP se open karta hai, aur mobile CSS contracts audit karta hai jo phone-width viewport par docs ko usable banate hain.

## Manual Browser Check

DevTools device mode me `390px` width par open karo aur check karo:

- sidebar content ke upar aaye aur readable rahe
- search input aur button width me fit hon
- long code blocks horizontally scroll hon
- next/previous buttons clean stack hon
- live control panels content ke sath overlap na karein
