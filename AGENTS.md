- RULES
  1.0 All rules in this file are absolute. Treat them seriously and keep them in mind.
  1.1 The environment is Windows and the shell is PowerShell; use pwsh commands for listing files or reading content.
  1.2 Do not use unix/linux commands (env is windows), such as: grep, ripgrep. But can use other tools that are compatible and already installed: gh, git, playwright-cli, other pwsh tools. gh is already authenticated.
  1.3 Do not introduce typos, mistakes, avoid thinking loops, and focus on the task.
  1.4 Avoid redundant tool calls within a single response.
  1.5 Ask follow-up questions only when necessary for task completion.
  1.6 The reply must always start with "Bn coae coae. Let's roll.", only once per reply (it's just my preffered appellative)

- TOOL SELECTION
  2.1 You may also use `Get-ChildItem` for file pattern matching.
  2.2 Use `Read` for file content.
  2.3 When verifying syntax of structural elements (e.g., HTML tags), use `Get-Content`, because `Read` output appears ambiguous or potentially truncated. You can also use for example: Select-String.
  2.4 Use `webfetch` and `websearch` tools when required to access the Internet for online resources, documentation, search results.
  2.5 Use `question` tool for asking follow-up questions, but only if really required.

- EDITING
  3.1 To check line endings in PowerShell: `(Get-Content -Raw "filename") -match "`r"`3.2 Before editing, make sure the line endings are unix style (LF). If not, convert line endings to Unix style:`(Get-Content -Raw filename) -replace "\r\n", "`n" | Set-Content -NoNewline filename`. Or use dos2unix (already installed - as windows version)
  3.3 When using edit tool, If `oldString` is not found, re-Read the file and try a more precise substring.
  3.4 When using edit tool, always use small, unique substrings for `oldString` to avoid whitespace/line ending mismatches. If too large or has tab/space issues, break into smaller matches.
  3.5 Present a summary of planned changes at the start of a task, then proceed; ask again only if the scope changes unexpectedly.
  3.6 For indentation, always use spaces, instead of tabs. If you find any file using tabs, fix it to use spaces.

- TASK MANAGEMENT
  4.1 Use `todowrite` for any task involving multiple steps.
  4.2 Maintain the todo list by updating the status of tasks (`pending`, `in_progress`, `completed`).

- VERIFICATION
  5.1 Always run linting or testing commands (e.g., `npm run lint`) after making code changes to ensure correctness.
  5.2 Use playwright (already installed) to test UI/UX from user's perspective directly on the live published page, when asked to do so. For example: `playwright-cli open --headed --persistent --browser firefox https://synapsescribe.github.io/Negruta-Website/#meow-translator` (using playwright-cli) or `node js/playwright-test-game.js` (using npm playwright module)

- GIT
  6.1 Run `git status --verbose`, when making meaningful code changes.
  6.2 Use `git reset --hard HEAD && git clean -fd` to restore changes when requested.
  6.3 Never attempt to push to master unless I specifically say `lookin crispy` (exact phrase) which will authorize you to: stage changes, commit with description of changes, and push to master (eg. `git add . ; git commit -am "fix for bug" ; git push"`. When working on a branch, see 7.11.
  6.4 Never pull changes, unless you ask first and get confirmation.

- PIPELINE SYSTEM
  7.1 Trigger: User asks to create a github issue(s) for some task(s) → start pipeline workflow. Eg. user asks "create a gh issue for adding a new button".
  7.2 Create the GitHub issue(s) via `gh issue create` (title: "[Pipeline] <task>", label: "pipeline" (already existing label)).
  7.3 Capture details: ask user for specifics (scope, behavior, edge cases, design preferences). Write to `<#>/00-spec.md`, where `<#>` is the next number of the issue that will be created in github. Use `question` tool for this.
  7.4 Store issue # in `.pipeline/active/<#>/`. Stages: investigate → plan → build → verify → close.
  7.5 Add the contents of 00-spec.md to the github issue as its body. Each stage will write to `<#>/NN-stage.md` as a comment in gh issue (01-investigate.md, 02-plan.md, 03-build.md, 04-verify.md) upon PR approval. If multiple issues are going to be created, create them one by one, making sure each github issue is initialized with the info from "00-spec.md" file.
  7.6 Investigate: check affected HTML/CSS/JS files, browser compatibility, responsive impact.
  7.7 Plan: list exact files, changes, visual impact, mobile/desktop considerations.
  7.8 Build: create branch `pipeline/<#>-<issue_short_title>`, checkout to it, implement, commit with clear messages. The md files must be also committed as part of the branch.
  7.9 Verify: run lint (with eslint), beautify (with prettier), check HTML validity, test responsive breakpoints, verify no broken links/images. On failure, attempt to fix and update the corresponding .md files accordingly.
  7.10 If verification is completed successfully, open a pull request with the commits related to the issue and add a reference to the issue in the PR (eg. "Fixes #123"), so that the issue is also correlated with the PR and the issue is closed automatically because of the keyword "Fixes".
  7.11 When I (the user), approve the PR, I will eventually tell you `lookin crispy`, so that you can proceed on completion: move from active to `.pipeline/done/<#>/` -> merge into master (`git checkout master && git merge <branch>`). Keep branches as historic (no delete). -> add one comment for each stage in the gh issue (each `<#>/NN-stage.md` file) + an extra comment with the summary of what files changed.
  7.12 I will also test before approving the PR, and if the PR does not fix the issue, I will provide you the details and then you resume the work on it (go through pipeline again investigate->plan->build->verify). In this case, don't close the issue yet, but instead update the .md files with your new changes and add the new commits to the same PR (one PR per issue) after verification successful. Afterwards, I will recheck and let you know if you can complete the issue (`PR lookin crispy`)
  7.13 "delete issue <#>" → delete issue on github, and delete from `.pipeline/active`.
  7.14 "abort issue <#>. reason: <xyz>" -> close issue on gh, adding a comment with the reason <xyz>.
  7.15 When asked to work on issue <#> (eg. issue #10), check the files inside `.pipeline/active/<#>/` instead of reading the github issue itself (which holds the same information). We store the initial issue details and the stages comments in files to query them more easilly locally instead of checking github issue itself every time.

- SELF-IMPROVEMENT RULES
  8.1 review existing rules in this file, keep them in memory during discussion.
  8.2 create/update knowledge in the SELF-TOUGHT section below, whenever you learned something out of the ordinary that could help in the future (eg. how to use a specific tool after failing multiple times). This is the only section where you (the AI model) are allowed to modify/create lines in this file (AGENTS.md). Start the lines with 9.x, where x is incremented.
  8.3 apply new/edited rules for the following replies

- SELF-TOUGHT
  9.0
