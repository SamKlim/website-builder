# /test

Run the full testing pipeline for everything new or changed in this chat.

Follow `.ai/rules/test-pipeline.md` — all stages in order. Do not duplicate that rule here.

**When to run:**
- From `/finish-coding` step 3 (default — do not write tests during coding)
- When the user explicitly says "test", "run tests", or invokes `/test` mid-chat

**Do not run during coding** unless the user asks. Implementation first; tests at finish-coding.

**Stage 1 is mandatory visibility:** post the full test plan in chat (scenarios, states, layers, existing tests to update) and wait for approval before writing test code — unless the user said "auto-run".

Never mark testing complete if a command exited non-zero or if changed code has no tests and you did not explain why in the Stage 1 plan.
