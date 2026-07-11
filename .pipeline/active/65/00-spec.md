# Spec: Global Cross-Device Leaderboard via GitHub Actions Workflow Dispatch

## Overview
Replace localStorage-only score storage with a global leaderboard accessible across devices, sessions, and users — using only GitHub infrastructure (no third-party services).

## Architecture

### Two-Token Security Model
1. **Token 1 (exposed in game.js)**: Fine-grained PAT on throwaway account's scores repo, `admin:workflow` permission only. Can trigger workflows, cannot read/write files directly.
2. **Token 2 (hidden as GitHub Actions secret)**: Stored in scores repo secrets. Used by the workflow to commit changes to `scores.json`.

### Two-Repo Setup
- **Main repo** (`SynapseScribe/Negruta-Website`): Game code, embedded trigger-only PAT
- **Scores repo** (throwaway account, e.g., `negruta-scores/negruta-scores`): Contains only `scores.json` + one GitHub Actions workflow

### Data Flow
```
Game over → save to localStorage (instant) → POST workflow_dispatch with {name, score, date} using Token 1 →
Workflow triggers (1-3 min delay) → uses Token 2 (secret) to read scores.json, append entry, sort descending by score, trim to top 50, commit →
Next page load fetches updated scores.json from raw.githubusercontent.com (no auth needed)
```

### Score Data Format
Each entry in `scores.json`:
```json
{ "name": "<playerName>", "score": <number>, "date": "<ISO-8601 date>" }
```

Example: `{ "name": "Negruta", "score": 500, "date": "2025-07-12" }`

## Implementation Details

### scores repo structure
```
scores.json              — Global leaderboard data (JSON array)
.github/workflows/       — Workflow for score submission
  update-score.yml       — Triggered by workflow_dispatch, commits new scores
README.md               — Minimal description
```

### Workflow (`update-score.yml`)
- Trigger: `workflow_dispatch` with inputs: `name` (string), `score` (number), `date` (string)
- Steps:
  1. Checkout repo
  2. Read current `scores.json`
  3. Append new entry `{name, score, date}`
  4. Sort array descending by `score`
  5. Trim to top 50 entries
  6. Write back to `scores.json`
  7. Commit if changed (using Actions secret for auth)

### game.js changes
- **On page load**: Fetch global scores from `https://raw.githubusercontent.com/{owner}/{repo}/main/scores.json`, merge with localStorage scores, display unified leaderboard
- **On game over**: Save to localStorage (instant local feedback) + POST to GitHub workflow_dispatch API using Token 1 (async, for global sync)
- Display: Unified list showing top N entries from merged local+global scores

### Configuration
- Max global scores: **50** (same as current localStorage cap)
- Date format: **ISO 8601** (`YYYY-MM-DD`)
- Default seed entry: `{ "name": "Negruta", "score": 500, "date": "<today>" }`

## Security Considerations
- Throwaway account provides full isolation from main GitHub account
- Exposed token (Token 1) has `admin:workflow` only — cannot read/write files directly
- Real write token (Token 2) stored as Actions secret — never exposed in source code
- Scores repo contains no secrets other than the writer PAT
- GitHub Actions runners are sandboxed; even if attacker creates malicious workflow, cannot escape runner or access other repos

## Files To Modify/Create
- **Create**: Throwaway account + scores repo (user handles)
- **Create**: `scores.json` in scores repo (initial seed data)
- **Create**: `.github/workflows/update-score.yml` in scores repo
- **Modify**: `js/game.js` — add global score fetch on load, workflow dispatch on game over
- **Modify**: `index.html` — potentially update leaderboard display for unified local+global view
- **Modify**: `.pipeline/issues.txt` — add issue #65

## Edge Cases
- Network failure on page load: fall back to localStorage scores only
- Workflow trigger fails: score saved locally, retry on next game over
- Corrupted `scores.json`: parse error → fall back to localStorage only
- Rate limits: GitHub API allows ~10K authenticated requests/hour — sufficient for low-traffic game
