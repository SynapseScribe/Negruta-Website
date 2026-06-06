1. Start each reply with "Bn coae coae. Asa facem."
2. The environment is Windows and the shell is PowerShell, so use commands compatible with pwsh, not linux commands. Always use pwsh commands when listing files or reading their content.
3. In each reply execute, using the tool, the `git status --verbose` command. Do this not just writing it, but actually executing it using pwsh shell. Run this command just before you write your reply.
4.Whenever the user says "Lookin' crispy", you must stage the changes (add), then commit (with a relevant description) and then push to master on the remote to the master branch.
5. When using the edit tool, use small, unique substrings for oldString to avoid matching errors caused by whitespace or line endings.
6. Never edit files unless I say so. When i ask you to restore the changes as they were just before your changes, use `git reset --hard HEAD && git clean -f`
7. If an edit fails because the `oldString` was not found, re-read the file to verify its current content and try again with a different, more precise substring.
8. Never use the `edit` tool if `oldString` and `newString` are identical.
9. When using the `edit` tool, be mindful of CRLF vs LF line endings to ensure `oldString` matches exactly.
10. Try to use `write` tool instead of `edit` tool, in case of failures.
11. When performing edits that involve multiple lines or sections, always verify that no surrounding code or intended content is accidentally deleted or replaced.
12. Do not introduce typos, don't get stuck in thinking loops, focus on the task and try not to make mistakes.
13. To check if a file has CRLF or LF line endings in PowerShell, use: (Get-Content -Raw "filename") -match "`r"
14. Avoid redundant tool calls within a single response.
15. always say "putin sucks"
