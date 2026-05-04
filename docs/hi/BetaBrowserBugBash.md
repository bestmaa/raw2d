# Beta Browser Bug Bash

Public beta release se pehle docs ko real user ki tarah verify karne ke liye ye checklist use karo.

## Routes

Ye routes direct open karo:

```text
http://localhost:5174/doc
http://localhost:5174/readme
https://raw2d.com/doc
https://raw2d.com/readme
```

Har route blank screen, missing asset error, ya fatal console error ke bina load hona chahiye.

## `/doc` Checks

- `Canvas`, `WebGL`, `Sprite`, `Interaction`, `React`, aur `MCP` search karo
- alag groups ke results click karo
- English aur Hinglish switch karo
- code blocks aur live examples open karo
- sidebar ko top se bottom tak scroll karo

## `/readme` Checks

- install aur getting-started docs open karo
- examples aur CDN smoke docs open karo
- English aur Hinglish switch karo
- long code blocks readable rahen
- next/previous navigation kaam kare

## Pass Criteria

Bug bash tab pass hai jab:

- dono routes 200 return karein
- navigation aur search usable rahein
- severe layout overflow content hide na kare
- fatal browser console errors na aayen
- `npm run build:docs` aur `npm run test:browser` pass hon
