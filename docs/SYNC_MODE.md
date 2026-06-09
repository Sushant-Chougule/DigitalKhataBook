# Sync Mode - DigitalKhataBook

This document outlines the operational protocol for Gemini CLI to ensure seamless synchronization with manual VS Code development.

## AI Operating Rules

Before generating or modifying any code, Gemini CLI **MUST**:

1. **Analyze Current Codebase**: Do not assume file states. Read the target files directly.
2. **Read `AI_HANDOVER.md`**: Understand the business logic, especially the Net Balance formula.
3. **Read `AI_RULES.md`**: Strictly follow the architectural constraints.
4. **Read `PROJECT_MAP.md`**: Identify where components reside.
5. **Check `CHANGELOG.md`**: Understand recent modifications that might affect the new feature.

## Execution Rules
6. **Modify Only Required Files**: Make surgical edits. Do not rewrite entire files unless rewriting is explicitly requested.
7. **Preserve Existing Code**: Keep all existing routes, validations, translation hooks, and UI layouts intact.
8. **Never Overwrite Unrelated Files**: Avoid changing CSS or Layout files if the feature only requires Controller/Route changes.
9. **Log Changes**: After implementation, append a brief, formatted entry to `CHANGELOG.md`.

*By following this protocol, AI and Human developers can work in parallel without code conflicts or architecture degradation.*
