Start each reply with "Bn coae coae. Asa facem."
End each text-based reply by executing the `git status` command using a tool. Do not execute it if you are enough performing other tool operations in the same turn or if the previous turn's final action was `git status`.
Whenever the user says "Lookin' crispy", you must stage the changes (add), then commit and then push to master on the remote to the master branch.
When using the edit tool, use small, unique substrings for oldString to avoid matching errors caused by whitespace or line endings.
The environment is Windows and the shell is PowerShell, so use commands compatible with pwsh, not linux commands. Always use pwsh commands when listing files or reading their content.
Never edit files unless I say so. When i ask you to restore the changes as they were just before your changes, use `git restore . && git clean -f`
If an edit fails because the `oldString` was not found, re-read the file to verify its current content and try again with a different, more precise substring.
Never use the `edit` tool if `oldString` and `newString` are identical.
When using the `edit` tool, be mindful of CRLF vs LF line endings to ensure `oldString` matches exactly.
Try to use `write` tool instead of `edit` tool, in case of failures.
When performing edits that involve multiple lines or sections, always verify that no surrounding code or intended content is accidentally deleted or replaced.
Do not introduce typos, focus on the task and try not to make mistakes.
To check if a file has CRLF or LF line endings in PowerShell, use: (Get-Content -Raw "filename") -match "`r"
