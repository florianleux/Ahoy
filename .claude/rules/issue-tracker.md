# Issue tracker conventions

Tracker for this repo: **GitHub Issues** on `florianleux/Ahoy`, via the `gh` CLI. No Jira/Linear/Confluence — the sections below in `to-tickets` and `wayfinder` that branch on tracker type always take the "real issue tracker" path, with GitHub's specifics as described here.

## Creating an issue

```bash
gh issue create --title "<title>" --body "<body>" --label ready-for-agent
```

If the `ready-for-agent` or `wayfinder:map` label doesn't exist yet in the repo, create it once:

```bash
gh label create ready-for-agent --color 0E8A16 --description "Agent-grabbable, ready to work"
gh label create wayfinder:map --color 5319E7 --description "Wayfinder map issue"
```

## Blocking edges

GitHub has no field scriptable via `gh` CLI for a true native "blocked by" relationship (that lives in Projects, not on the issue itself). Use the **body convention** for every ticket:

```
**Blocked by:** #12, #14
```

or `**Blocked by:** None — can start immediately`.

A ticket is **unblocked** once every issue it names is closed. Check with:

```bash
gh issue view <number> --json state -q .state
```

## Frontier query

List open, unblocked, unassigned issues:

```bash
gh issue list --state open --json number,title,body,assignees
```

Parse each issue's `**Blocked by:**` line; keep the ones whose referenced issues are all closed and that have no assignee — that's the frontier.

## Wayfinding operations

The map is a GitHub issue labelled `wayfinder:map`. Find it with:

```bash
gh issue list --label wayfinder:map --state open
```

Child tickets are regular issues referencing the map issue number in their body (`**Parent:** #<map-number>`) — GitHub has no scriptable native sub-issue link here either, so this is the same body convention as blocking. Wire blocking edges after the child issues exist (they need ids first), same as any other ticket.

## Claiming a ticket

```bash
gh issue edit <number> --add-assignee @me
```

## No Jira ticket defaults

This repo has no Jira project — ignore any instruction in a skill about Jira title formats, sprints, or components.
