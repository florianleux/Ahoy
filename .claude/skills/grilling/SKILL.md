---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases. Add "with docs" (or when working inside this repo) to also capture what it learns as ADRs and glossary entries.
---

Interview me relentlessly about every aspect of this until we reach a shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.

If a *fact* can be found by exploring the environment (filesystem, tools, etc.), look it up rather than asking me. The *decisions*, though, are mine — put each one to me and wait for my answer.

If the user asked for docs, or this is happening inside a codebase with a domain worth tracking, also load and follow the `domain-modeling` skill as you go — record hard-to-reverse decisions as ADRs and keep the glossary clean. Otherwise run stateless: no files written.

Do not act on it until I confirm we have reached a shared understanding.
