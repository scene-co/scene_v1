# Project Context — Scene
Scene is a cross-platform (iOS + Android) student-focused social ecosystem built using Expo, React Native, TypeScript. Use the compatible langauges only. Dont mix yourself with other languages which will cause issues later on. Remember that I am trying to make an app for iOS and android. so the code should be efficient and functional for both the platforms.
The app combines a student marketplace, forums, social feed, events, hangouts, sports invites, group chats, AI therapist, and integrated delivery & splitwise-like systems.  
The app must maintain:
- High code quality
- Secure data handling
- Efficient algorithms
- Scalable architecture
- Predictable developer experience

When unsure about context, goals, or expected behavior → ALWAYS refer back to this file before generating output.

---

# Code Style
- Use TypeScript for all files.
- Use 2-space indentation.
- Use functional React components with hooks.
- Avoid unnecessary re-renders (use memo, useCallback, useMemo).
- Prefer flat code structure over deep nesting.
- Write pure functions unless side effects are required.
- Use ESLint + Prettier conventions.
- Use async/await (never raw Promises).
- Use strict TypeScript compiler settings.
- Avoid large components — split by responsibility.
- Use early returns instead of nested if blocks.
- Use environment variables and never hardcode secrets.

---
Components → PascalCase (UserCard.tsx)
- Functions → camelCase (calculateSplitAmount)
- Files & folders → kebab-case (event-card.tsx)
- Types & Interfaces → PascalCase (UserProfile)
- Constants → UPPER_CASE
- Custom hooks → useSomething

---

# Workflow Preferences
- Create small reusable components in components/.
- Screens should contain minimal logic; use hooks for data & logic.
- Before starting a feature:
  1. Define types
  2. Define API structure
  3. Define screens
  4. Create UI components
  5. Connect to hooks + business logic

- Use feature branches (feature/marketplace-listing).
- Commit in small meaningful increments.
- Run npm run lint before PRs.

---

# Common Commands
- Start dev server: `npx expo start`
  - Press `i` for iOS simulator
  - Press `a` for Android emulator
  - Scan QR code with Expo Go app on physical device
- Build for iOS (development): `npx expo run:ios`
- Build for Android (development): `npx expo run:android`
- Build (web): `npm run build`
- Test: `npm test`
- Lint: `npm run lint`

---

# Security Guidelines
- Never store secrets in frontend code.
- Validate ALL input on backend.
- Sanitize all user content (forums, chat, events).
- Restrict DB access by UID/Firebase rules.
- Avoid storing tokens in AsyncStorage (use secure storage).
- Encrypt sensitive data when possible.
- AI therapist must:
  - Avoid medical claims
  - Avoid harmful advice
  - Not store emotional logs without explicit user consent

- Always use HTTPS and secure API patterns.

---

# Performance & Efficiency
- Use efficient data structures:
  - Map / Set for fast lookup
  - Priority queues or sorted lists for feeds
- Use pagination + infinite scroll.
- Lazy-load heavy screens.
- Memoize expensive components.
- Cache network data (React Query).
- Avoid O(n²) loops; prefer O(n log n) or better.
- Compress and cache images.
- Avoid unnecessary dependencies.

---

# Quality Expectations
- Code must be:
  - Clean
  - Modular
  - Typed
  - Secure
  - Efficient
  - Scalable
  - Maintainable

- Never produce hacky or temporary solutions.
- Everything should follow long-term maintainable patterns.

---

# AI Behavior Rules
- Always use this claude.md as source of truth.
- Maintain structure, architecture, naming, and patterns described here.
- Prioritize security and efficiency in all code.
- Ask for missing details instead of guessing.
- Never invent APIs; clarify if unsure.
- Explain reasoning for major architectural choices.

If AI is unsure → RE-READ this file before generating any output.

---

# When Context Is Lost
If instructions feel unclear:
1. Re-read this claude.md file.
2. If still unsure, ask clarifying questions.
3. Never guess blindly.

This file is ALWAYS the reference point for understanding the project and generating consistent, high-quality code.