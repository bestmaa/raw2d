# v1.0 Release Checklist

Raw2D ko v1 stable bolne se pehle ye checklist complete karo.

## API Freeze

- Package export maps root-only aur stable hain.
- Runtime exports audited snapshots se match karte hain.
- Constructor option names stable hain.
- Renderer lifecycle methods stable hain.
- Deprecated aliases removal se pehle documented hain.

## Renderer Stability

- CanvasRenderer complete reference renderer hai.
- WebGLRenderer2D supported objects aur fallback behavior document karta hai.
- WebGL diagnostics field names stable hain.
- Bundle size audit pass hai.

## Docs And Examples

- `/doc`, `/readme`, `/benchmark`, aur `/visual-test` browser me open hote hain.
- Har example route console error ke bina open hota hai.
- Search kaam karta hai.
- Hinglish mode kaam karta hai.
- Small aur full examples feature se match karte hain.

## Package Metadata

- Har package README, LICENSE, NOTICE, aur TRADEMARKS include karta hai.
- Har package me repository, issue, homepage, aur keyword metadata hai.
- `npm pack --workspaces --dry-run` expected package files dikhata hai.

## Publish Verification

- Release notes me version hai.
- Git tag push hua hai.
- GitHub Actions CI aur Publish pass hain.
- npm versions visible hain.
- jsDelivr URLs 200 return karte hain.
- `https://raw2d.com/doc` 200 return karta hai.
