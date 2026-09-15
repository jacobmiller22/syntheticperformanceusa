# Git Worktree Protocol with Worktrunk (`wt`)

## Mandatory Rule for New Tasks
Whenever the user requests a new development task, feature, bug fix, refactor, or investigation:
**NEVER make code changes directly on the primary working tree or default branch (`main`).**
Always spawn and switch to an isolated Git worktree using Worktrunk (`wt`).

## Workflow Protocol

1. **Generate a Descriptive Branch Name**:
   - Derive a concise, kebab-case branch name representing the task (e.g., `feat/<feature-name>`, `fix/<bug-name>`, or `<task-name>`).

2. **Spawn the Worktree using Worktrunk**:
   - Execute:
     ```bash
     wt switch --create <branch-name>
     ```
   - (If a worktree for the requested branch already exists, switch to it with `wt switch <branch-name>`).
   - Determine the worktree path from the command output or via `wt step eval '{{ worktree_path }}'`.

3. **Confine All Work to the Worktree**:
   - **Terminal Commands (`run_command`)**: Set `Cwd` to the absolute path of the worktree directory.
   - **File Operations (`view_file`, `write_to_file`, `replace_file_content`)**: Target absolute file paths located inside the worktree directory.
   - **Subagents & Background Tasks**: Ensure any spawned subagents use the worktree directory.

4. **Reporting & Handoff**:
   - At the beginning of the task, report the active branch name and worktree path.
   - Upon completing the task, remind the user of the worktree branch/path and note that they can review changes or integrate them with `wt merge`.
