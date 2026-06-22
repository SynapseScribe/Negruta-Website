# Build - Issue #11

## Branch

`pipeline/11-fix-dead-code-obstacle-spacing`

## Commits

- `4a9ef03` - fix: correct minGap calculation so obstacle spacing decreases with score
- `a85f9b1` - tune: soften minGap curve so game stays playable past score 150

## Change

`js/game.js:400` - replaced `Math.max(680, 180 - score)` with `Math.max(60, 680 - score)`
