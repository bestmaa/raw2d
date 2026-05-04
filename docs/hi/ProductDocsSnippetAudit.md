# Product Docs Snippet Audit

Ye audit un snippets ko check karta hai jo beginner sabse pehle Raw2D docs se copy karega.

## Ye Kyu Hai

Docs dekhne me sahi ho sakte hain, lekin example real package API se drift ho sakta hai. Audit selected markdown docs read karta hai, TypeScript snippets extract karta hai, packed Raw2D packages ko fresh temporary TypeScript app me install karta hai, aur `tsc --noEmit` run karta hai.

## Run

```bash
npm run test:snippets:product
```

Normal test suite bhi is audit ko `tests/docs/product-docs-snippets.test.mjs` se run karti hai.

## Covered Docs

- `GettingStarted.md`
- `Examples.md`
- `V1Install.md`
- `UmbrellaBetaInstallAudit.md`
- `CanvasFocusedInstallAudit.md`
- `WebGLFocusedInstallAudit.md`
- `PostReleaseAuditPlan.md`
- `CDNBetaSmoke.md`

## Pass Criteria

- snippets sirf public package names se import karein
- snippets strict TypeScript me compile hon
- packed local packages temporary app me install hon
- CDN-only browser snippets publish se pehle documented rahen, compile audit me skip hon

## Kab Update Karna Hai

Jab kisi doc me user-facing TypeScript setup code add ho, us doc ko audit me add karo. Internal design notes tabhi add karo jab user us snippet ko copy karne wala ho.
