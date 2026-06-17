# RULES #
1.0 All rules in this file are absolute. Treat them seriously and keep them in mind.
1.1 The environment is Windows and the shell is PowerShell; use pwsh commands for listing files or reading content.
1.2 Do not use unix/linux commands (env is windows), such as: grep, ripgrep.
1.3 Do not introduce typos, mistakes, avoid thinking loops, and focus on the task.
1.4 Avoid redundant tool calls within a single response.
1.5 Ask follow-up questions only when necessary for task completion.
1.6 The reply must always start with "Bn coae coae. Let's roll.", only once per reply.


# TOOL SELECTION #
2.1 Use `Get-ChildItem` instead of `glob` for file pattern matching.
2.2 Use `read` for file content.
2.3 When verifying syntax of structural elements (e.g., HTML tags), use `Get-Content` via the `bash` tool, because `read` output appears ambiguous or potentially truncated. You can also use for example: Select-String.
2.4 Use `webfetch` and `websearch` tools when required to access the Internet for online resources, documentation, search results.
2.5 Use `question` tool for asking follow-up questions, but only if really required.

# EDITING #
3.1 To check line endings in PowerShell: `(Get-Content -Raw "filename") -match "`r"`
3.2 Before editing, make sure the line endings are unix style (LF). If not, convert line endings to Unix style: `(Get-Content -Raw filename) -replace "\r\n", "`n" | Set-Content -NoNewline filename`. Or use dos2unix (already installed - as windows version)
3.3 Prefer `write` tool over `edit` for reliability.
3.4 When using edit tool, If `oldString` is not found, re-read the file and try a more precise substring.
3.5 When using edit tool, always use small, unique substrings for `oldString` to avoid whitespace/line ending mismatches. If too large or has tab/space issues, break into smaller matches.
3.6 Never edit files without presenting a list of modifications and obtaining consent.
3.7 For indentation, always use spaces, instead of tabs.

# TASK MANAGEMENT #
4.1 Use `todowrite` for any task involving multiple steps.
4.2 Maintain the todo list by updating the status of tasks (`pending`, `in_progress`, `completed`).

# VERIFICATION #
5.1 Always run linting or testing commands (e.g., `npm run lint`) after making code changes to ensure correctness.

# GIT #
6.1 Run `git status --verbose` in every reply using the `bash` tool, only once per reply.
6.2 Use `git reset --hard HEAD && git clean -f` to restore changes when requested.
6.3 Never attempt to push to master unless I specifically say "lookin crispy" which will require to: stage changes, commit with description of changes, and push to master. If on a feature branch, merge into master first (`git checkout master && git merge <branch>`). Keep branches as historic.
6.4 Never pull changes, unless you ask first and get confirmation.


# PIPELINE SYSTEM #
7.1 Trigger: User says "issue: [task]" → start pipeline workflow.
7.2 Capture details: ask user for specifics (scope, behavior, edge cases, design preferences). Write to `<#>/00-spec.md`, where `<#>` is the number of the issue. Use `question` tool for this.
7.3 Create GitHub issue via `gh issue create` (title: "[Pipeline] <task>", body: contents of 00-spec.md, label: "pipeline").
7.4 Store issue # in `.pipeline/active/<#>/`. Stages: investigate → plan → build → verify → close.
7.5 Each stage writes to `<#>/NN-stage.md`. Comment on issue per stage.
7.6 Investigate: check affected HTML/CSS/JS files, browser compatibility, responsive impact.
7.7 Plan: list exact files, changes, visual impact, mobile/desktop considerations.
7.8 Build: branch `pipeline/<#>-<slug>`, implement, commit with clear messages.
7.9 Verify: run lint, check HTML validity, test responsive breakpoints, verify no broken links/images.
7.10 On completion: move to `.pipeline/done/<#>/`, close issue with summary (files changed, screenshots if UI change).
7.11 "pipeline abort #<n>" → close issue, move to `.pipeline/aborted/`.

# SELF-IMPROVEMENT RULES #
8.1 review existing rules in this file, keep them in memory during discussion.
8.2 create/update knowledge in the # SELF-IMPROVEMENT # section below. This is the only section where you (the AI model) are allowed to modify/create lines in this file (AGENTS.md). Start the lines with 9.x, where x is incremented.
8.3 apply new/edited rules for the following replies

# SELF-IMPROVEMENT #


