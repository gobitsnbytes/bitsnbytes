# AI Assistant (Gemini) Guidelines

When assisting with this repository, **you must always read and adhere to `AGENTS.md`** before generating code, making architectural decisions, answering team-related questions, or proposing workflows. 

## Core Directives

1. **Reference `AGENTS.md` immediately:**
   `AGENTS.md` is the single source of truth for our team structure, decision-making processes, and coding standards. Whenever you encounter a task related to project workflows or technical choices, utilize the rules found there.

2. **Strict Engineering Standards:**
   - **Always Use `pnpm`:** You must use `pnpm` as the package manager for all installations, commands, and dependency changes. Do not use `npm` or `yarn`.
   - **Always Optimized:** All code you write must prioritize extremely fast performance (optimizing for TTFB, LCP, INP, and general speed).
   - **Always Responsive:** Any UI components or frontend code you generate must be fully responsive, working flawlessly across mobile, tablet, and desktop devices.
   - **Security Always:** You must apply the highest security considerations and best practices to keep our platform and user data safe.

3. **Align with Team Roles:**
   If the user asks who to ping, or if you need to know who owns a specific part of the stack (e.g., backend, design, cloud infra), look up the Agent Profiles in `AGENTS.md` to provide accurate guidance.

By reading this file, you understand that these guidelines and the contents of `AGENTS.md` are mandatory for your operations within the bits&bytes™ codebase.
