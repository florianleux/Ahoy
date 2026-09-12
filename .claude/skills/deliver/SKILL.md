---
name: deliver
description: "Full implementation harness: GitHub issue to merged PR, with a gate after every phase. Use when the user wants to take an issue end-to-end through implementation."
---

# Deliver

This harness orchestrates the pipeline from a GitHub issue to a merged PR. Each phase ends in a **gate** — a binary barrier that opens only when the user confirms. A closed gate blocks every phase after it.

## Prerequisites

Before starting any work, create a git worktree branched from the latest `main`:

```bash
git fetch origin main
git worktree add ../Ahoy-<issue-number> origin/main -b <type>/<issue-number>-<description>
```

All implementation, commits, and PR creation happen inside this worktree. This keeps the main checkout clean and avoids interference from uncommitted changes on the issuing branch.

## Process

### 1. Fetch the issue

Use `gh issue view <number> --comments` to fetch the GitHub issue the user pointed at. Include description, labels, and comments.

If the issue references a spec, read that too. This repo has **no `specs/` directory yet** — the standing domain reference is [`CLAUDE.md`](CLAUDE.md) (architecture, conventions, pitfalls), plus `REFACTORING_SUMMARY.md` and `REMAINING_AUDIT_ISSUES.md` for known debt. Create `specs/` only when a multi-session build actually needs one.

Summarize:
- What the issue asks for (1-3 sentences)
- Any linked spec file, or the relevant section of `CLAUDE.md`
- Acceptance criteria (if present)

**Gate 1**: Issue fetched, all comments reviewed, all acceptance criteria listed — present for confirmation.

### 2. Grill the approach

Load and follow the `grilling` skill. Key areas to cover:

- Which layers does this touch? (`src/classes/` game logic, `src/views/`, `src/components/`, `src/router/`, `src/locales/`, `public/` assets)
- Which domain terms are involved — `Character`, `Player`, `Enemy`, `Fleet`, `Boat`, `Map`, `Power`, `mood`, `round`, `level`. A term that doesn't exist yet gets named before it gets coded
- Does this touch game state? It lives on `$game` (`Vue.prototype.$game`), **not** Vuex — see [`CLAUDE.md`](CLAUDE.md)
- Are there existing patterns to follow? (find a similar enemy, view or component and reuse its shape)
- What are the TDD seams? The classes under `src/classes/` are plain JS with no Vue dependency — test those directly. Components need `@vue/test-utils` and are rarely worth it here
- Does this add or change i18n keys? `src/locales/fr.json` **and** `en.json` must stay in sync
- New enemy? Follow the 7-step checklist in [`CLAUDE.md`](CLAUDE.md) — steps 4 and 6 are the easy ones to forget
- Any design decisions that need the user's call?

**Gate 2**: Every key area above resolved with a decision — present the consolidated approach for approval.

### 3. Plan

Break the work into implementation steps. Each step should be:
- A vertical slice (cuts through all layers touched: schema, API route, composable, component, tests)
- Sized to fit in one focused session
- Ordered by dependency

Present the plan as a numbered checklist:

```
## Implementation Plan

1. [step description] — files affected, tests to write
2. [step description] — files affected, tests to write
...
```

**Gate 3**: Every step lists affected files and tests; dependency order verified — present for approval.

**Session boundary**: If this issue is complex, consider using `/handoff` to compact the conversation and starting a fresh session for implementation. For simple issues, continue in the same session.

### 4. Implement with TDD

Load and follow the `tdd` skill. For each step in the plan, run the red → green cycle at the TDD seams identified in step 2. Run single test files regularly and the full suite once at the end. There is **no typecheck** in this repo (plain JS, no TypeScript). Present progress after each step. If a step is complex or has subdecisions, pause and ask.

**Gate 4**: All steps implemented and tests pass — present a summary of what was built.

### 5. Code review

Load and follow the `code-review` skill. It runs a two-axis review in parallel (Standards and Spec).

Present both reports side by side under `## Standards` and `## Spec` headings.

**Gate 5**: Present the review results. Hard violations trigger the loop; judgement calls go to the user.

### 6. Grill the review

Load and follow the `grilling` skill on the code review results:

- For each finding from step 5, grill whether it's been adequately addressed
- For each "pass", stress-test whether it really passes or if the reviewer missed something

**Gate 6**: Present the grilled review conclusions. Unresolved issues trigger the loop; all clear proceeds.

### 7. Simplify

Load and follow the `simplify` skill on the code implemented in step 4 (the diff for this issue, not the whole repo).

**Gate 7**: Present proposed simplifications for approval. After applying, run the tests and the build to verify no regressions.

### 8. Spec verification

Re-read the original GitHub issue and any linked spec. Go through each acceptance criterion:

- Is it implemented?
- Is it tested?
- Does the behavior match the spec?

Present a checklist:

```
## Spec Verification

- [x] Criterion 1 — implemented in `file.ts:42`, tested in `file.spec.ts:15`
- [ ] Criterion 2 — NOT IMPLEMENTED
- [x] Criterion 3 — implemented, but behavior differs from spec (explain)
```

**Gate 8**: Every criterion verified — present the checklist. Any failure triggers the loop; all pass proceeds.

### 9. Quality checks

Before committing, run all quality checks — same order as CI:

```bash
npx vue-cli-service lint --no-fix   # ⚠ never `npm run lint` — it auto-fixes the whole repo
npm test
npm run build
```

There is no typecheck step (plain JS). The lint baseline is **26 pre-existing Prettier warnings** — that count must not go up; if it does, the new warnings are yours. If any check fails, fix and re-run.

**Gate 9**: Show quality check results.

### 10. Commit

Load and follow the `commit` skill. Conventional commits (`feat:`, `fix:`, `refactor:`, etc.).

**Gate 10**: Staged files and commit message presented for explicit validation.

### 11. Merge to main

```bash
git checkout main
git merge --ff-only <type>/<issue-number>-<description>
git worktree remove ../Ahoy-<issue-number>
```

**Gate 11**: Commit shown, merge command presented for validation before running it.

## Loop behavior

Steps 4 → 5 → 6 → 7 → 8 form a loop. If any review, grilling, simplify, or spec check fails:
- Note the specific issues
- Return to step 4 to implement fixes for those specific issues
- Re-run steps 5-8 on the fixes only (not the entire diff from scratch)
- Continue until all gates pass

## Scope boundaries

- Issue creation is handled by `to-tickets`
- No PR — work merges straight into `main`
- Push only when the user explicitly requests it
