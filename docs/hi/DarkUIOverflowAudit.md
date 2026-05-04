# Dark UI Overflow Audit

Ye audit Raw2D docs aur examples ke dark UI surfaces ko layout overflow se protect karta hai.

## Run

```bash
npm run test:browser:dark-overflow
```

Script Vite start karta hai, critical routes check karta hai, aur CSS contracts audit karta hai jo dark panels me content clipping rokta hai.

## Routes

- `/doc`
- `/readme`
- `/benchmark`
- `/examples/showcase/`
- `/examples/canvas-basic/`

## Manual Check Me Kya Dekhna Hai

- dark backgrounds consistent rahein
- code blocks horizontally scroll hon
- side panels aur live controls scroll kar saken
- canvases aur media parent width ke andar rahein
- buttons aur labels overlap na karein
