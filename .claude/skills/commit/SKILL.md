---
name: commit
description: Prepare and create a commit only after the user validates its exact files and message.
---

When committing code:

1. Inspect `git status`, the relevant diff, and recent commit history.
2. Ask for the Jira ID if the project requires one and none is known.
3. Stage only the intended files. Never use `git add .`.
4. Follow Conventional Commits and project conventions, including the Jira key.
5. Show the user the exact staged files and proposed commit message.
6. Wait for explicit validation of that exact commit.
7. Run `git commit` only after validation.

Never amend, retry a failed commit, or create another commit without a new validation. Never push unless the user explicitly asks.
