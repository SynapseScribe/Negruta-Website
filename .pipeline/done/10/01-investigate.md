# Investigate - Issue #10

## State Variables Audit (js/game.js lines 52-64)

| Variable | Line | Reset in resetGame() | Method |
|---|---|---|---|
| `gameRunning` | 52 | No | Set to `true` in `startGame()` after `resetGame()` |
| `playerName` | 53 | No | Set in `startGame()` before `resetGame()` |
| `jumpCount` | 54 | **No** | **BUG** - not reset |
| `celestialObjects` | 55 | Yes | Via `initCelestial()` |
| `score` | 56 | Yes | `score = 0` |
| `CAT_Y` | 57 | Yes | Reset to initial position |
| `velocityY` | 58 | Yes | `velocityY = 0` |
| `obstacles` | 59 | Yes | `obstacles = []` |
| `collectibles` | 60 | Yes | `collectibles = []` |
| `frameCount` | 61 | Yes | `frameCount = 0` |
| `nextObstacleFrame` | 62 | Yes | `nextObstacleFrame = 100` |
| `currentSpeed` | 63 | Yes | `currentSpeed = INITIAL_SPEED` |
| `grassItems` | 64 | Yes | Via `initGrass()` |

## Finding
Only `jumpCount` is missing from `resetGame()`. All other state variables are properly reset.
