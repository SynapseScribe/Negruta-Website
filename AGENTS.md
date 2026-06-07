# RULES #
1.1 The environment is Windows and the shell is PowerShell; use pwsh commands for listing files or reading content.
1.2 do not use unix/linux commands (env is windows), such as: grep
1.3 Do not introduce typos, mistakes, avoid thinking loops, and focus on the task.
1.4 Avoid redundant tool calls within a single response.
1.5 Ask follow-up questions only when necessary for task completion.
1.6 The reply must start with "Bn coae coae. Asa facem."


# TOOL SELECTION #
2.1 Use `glob` for file pattern matching.
2.2 Use `read` for reading file content.
2.3 When verifying syntax of structural elements (e.g., HTML tags), use `Get-Content` via the `bash` tool , beacause `read` output appears ambiguous or potentially truncated. You can also use for example: Select-String.
2.4 Use `task` for complex, multi-step autonomous workflows.


# EDITING #
3.1 To check line endings in PowerShell: `(Get-Content -Raw "filename") -match "`r"`
3.2 Before editing, make sure the line endings are unix style (LF). If not, convert line endings to Unix style: `(Get-Content -Raw filename) -replace "\r\n", "`n" | Set-Content -NoNewline filename`. Or use dos2unix (already installed - as windows version)
3.3 Prefer `write` tool over `edit` for reliability.
3.4 when using edit tool, If `oldString` is not found, re-read the file and try a more precise substring.
3.5 when using edit tool, if `oldString` is too large, try much smallers strings.
3.6 when using edit tool, if `oldString` has tab/spaces issues, try much smallers strings.
3.7 when using edit tool, Use small, unique substrings for `oldString` to avoid whitespace/line ending mismatches.
3.8 Never edit files without presenting a list of modifications and obtaining consent.
3.9 For identation, always use spaces, instead of tabs.

# TASK MANAGEMENT #
4.1 Use `todowrite` for any task involving 3 or more distinct steps.
4.2 Maintain the todo list by updating the status of tasks (`pending`, `in_progress`, `completed`).

# VERIFICATION #
5.1 Always run linting or testing commands (e.g., `npm run lint`) after making code changes to ensure correctness.

# GIT #
6.1 Run `git status --verbose` in every reply using the `bash` tool.
6.2 Use `git reset --hard HEAD && git clean -f` to restore changes when requested.
6.3 Only when user says "lookin crispy": stage changes, commit with description, and push to master. Do not push to master, unless i specifically say so, or I say "lookin crispy"
6.4 Never pull changes, unless you ask first and receive confirmation.


# SELF-IMPROVEMENT RULES #
7.1 review existing rules in this file before each task
7.2 apply confirmed rules by default
7.3 create/update knowledge after feedback in the # SELF-IMPROVEMENT # section. This is the only section where you (the AI model) are allowed to modify/create lines in this file (AGENTS.md). Start the lines with 8.x, where x is incremented.


# SELF-IMPROVEMENT #