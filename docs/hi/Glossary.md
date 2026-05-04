# Glossary

Raw2D ke common words ka short meaning.

## Scene

`Scene` un objects ko store karta hai jinhe render ke liye consider karna hai. Scene khud draw nahi karta.

## Renderer

Renderer scene ko camera ke through draw karta hai. `Canvas` complete reference renderer hai. `WebGLRenderer2D` batch-first renderer hai.

## RenderList

`RenderList` scene se bana flat, sorted visible render items list hai. Isme render order, culling result aur matrix snapshots explicit rehte hain.

## Batch

Batch compatible objects ka group hai jise WebGL fewer state changes ke saath draw kar sakta hai. Fewer batches usually fewer draw calls dete hain.

## Buffer

Buffer typed numeric data hota hai jo GPU upload ke liye ready hota hai.

## Shader

Shader GPU code hota hai jisse WebGL geometry draw karta hai. Raw2D shaders ko WebGL package ke andar rakhta hai.

## Draw Call

Draw call GPU ko current batch draw karne ke liye bolta hai. Raw2D draw-call stats expose karta hai.

## Atlas

Texture atlas ek texture me multiple sprite frames pack karta hai. Isse WebGL texture binds kam ho sakte hain.

## Bounds

Bounds object ka rectangle describe karte hain. Culling, picking, selection aur resize tools me bounds use hote hain.

## Hit Testing

Hit testing check karta hai ki pointer point object ke andar ya paas hai ya nahi.

## Picking

Picking hit testing aur scene order use karke pointer ke neeche topmost object return karta hai.

## Culling

Culling camera viewport ke bahar objects ko drawing se pehle skip karta hai.
