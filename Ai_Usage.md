# AI Usage

## 1. AI Tools Used
- ChatGPT (used for code review, refactoring suggestions, and debugging)

---

## 2. How I Used AI
The overall system design, architecture, and core logic were independently implemented by me.

AI was used mainly for:
- Reviewing and improving code structure
- Refactoring code for better organization (e.g., repository pattern, centralized constants)
- Debugging specific issues during development
- Implementing small additional features without changing existing logic

---

## 3. Nature of Prompts
My prompts were specific and implementation-focused. Examples include:

- "Implement a previous question endpoint without changing existing logic"
- "Refactor code to use centralized status codes and route constants"
- "Move database calls from controllers to repository pattern"
- "Create index.js files to simplify imports across folders"

These prompts reflect targeted improvements rather than generating the entire solution.

---

## 4. What I Modified from AI Suggestions
- Ensured all changes aligned with my existing architecture and naming conventions
- Ignored or simplified overly complex suggestions
- Maintained control over core logic and flow
- Adapted refactoring suggestions (like repository pattern) to fit project scope

---

## 5. Limitations Observed
- Some suggestions required adjustment to match the existing codebase
- AI responses occasionally introduced unnecessary complexity
- Manual validation was required before applying changes

---

## 6. How I Verified Correctness
- Tested all APIs using Postman
- Verified database updates in MongoDB Atlas
- Tested complete user flow:
  - Module selection
  - Question navigation (next/previous)
  - Module switching
  - State and history persistence
- Handled edge cases such as invalid inputs and incorrect question references