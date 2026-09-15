# Project Agent Rules: Brandon AMSOIL Platform

## Git Worktree Protocol with Worktrunk (`wt`)
Whenever the user requests a new development task, feature, bug fix, refactor, or investigation in this repository:
**NEVER make code changes directly on the primary working tree or default branch (`main`).**
Always spawn and switch to an isolated Git worktree using Worktrunk (`wt`).

### Operational Guidelines:
1. **Derive Branch Name**: Choose a concise, descriptive kebab-case branch name representing the task (e.g., `feat/<feature-name>`, `fix/<bug-name>`, or `<task-name>`).
2. **Spawn Worktree**: Run `wt switch --create <branch-name>` (or `wt switch <branch-name>` if the worktree already exists).
3. **Confine Work to Worktree**:
   - For all terminal commands (`run_command`), set `Cwd` to the absolute path of the newly created worktree (`../brandonamsoil.<branch-name>`).
   - For all file operations (`view_file`, `write_to_file`, `replace_file_content`), target files inside the worktree path.
   - For subagents and background tasks, set their workspace context to the worktree directory.
4. **Report to User**: Clearly state the spawned branch and worktree directory when starting, and remind the user of `wt merge` upon task completion.

### Exceptions:
- Read-only informational queries or codebase exploration requests do not require a worktree.
- If the user explicitly instructs otherwise, follow the user's explicit preference.
