# RULES #
1.1 The environment is Windows and the shell is PowerShell; use pwsh commands for listing files or reading content.
1.2 Do not introduce typos, mistakes, avoid thinking loops, and focus on the task.
1.3 Avoid redundant tool calls within a single response.
1.4 Ask follow-up questions only when necessary for task completion.
1.5 The reply must start with "Bn coae coae. Asa facem.".

# TOOL SELECTION #
2.1 Use `glob` for file pattern matching.
2.2 Use `read` for reading file content.
2.3 Use `task` for complex, multi-step autonomous workflows.
2.4 do not use unix/linux commands (env is windows)

# EDITING #
3.1 To check line endings in PowerShell: `(Get-Content -Raw "filename") -match "`r"`
3.2 Before editing, make sure the line endings are unix style (LF). If not, convert line endings to Unix style: `(Get-Content -Raw filename) -replace "\r\n", "`n" | Set-Content -NoNewline filename`. Or use dos2unix (already installed - as windows version)
3.3 Prefer `write` tool over `edit` for reliability.
3.4 If `oldString` is not found, re-read the file and try a more precise substring.
3.5 Use small, unique substrings for `oldString` to avoid whitespace/line ending mismatches.
3.6 Never edit files without presenting a list of modifications and obtaining consent.

# TASK MANAGEMENT #
4.1 Use `todowrite` for any task involving 3 or more distinct steps.
4.2 Maintain the todo list by updating the status of tasks (`pending`, `in_progress`, `completed`).

# VERIFICATION #
5.1 Always run linting or testing commands (e.g., `npm run lint`) after making code changes to ensure correctness.

# GIT #
6.1 Run `git status --verbose` in every reply using the `bash` tool.
6.2 Use `git reset --hard HEAD && git clean -f` to restore changes when requested.
6.3 When user says "Lookin' crispy": stage changes, commit with description, and push to master.