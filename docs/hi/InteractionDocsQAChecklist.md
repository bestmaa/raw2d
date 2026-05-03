# Interaction Docs Visual QA Checklist

Interaction docs ya example change accept karne se pehle ye checklist follow karo.

## Routes

- `/doc#interaction-controller` open karo.
- `/doc#selection-manager` open karo.
- `/doc#keyboard-controller` open karo.
- `/doc#camera-controls` open karo.
- `/examples/interaction-basic/` open karo.

## Pointer Check

- Object par click karo aur confirm karo ki selected ho raha hai.
- Selected object drag karo aur confirm karo ki x/y change ho rahe hain.
- Rect resize handle drag karo aur confirm karo ki width/height change ho rahe hain.
- Empty canvas par click karo aur confirm karo ki selection clear ho raha hai.

## Keyboard Check

- Arrow keys selected objects ko move karein.
- Shift plus arrow fast move step use kare.
- Escape selection clear kare.
- Delete enabled ho to selected objects remove kare.

## Camera Check

Pan ya zoom ke baad selection, drag, resize, aur hit testing pointer position se
match hona chahiye. Handles selected Rect ke saath aligned rehne chahiye.
