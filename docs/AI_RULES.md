# AI Development Rules - DigitalKhataBook

Every future AI modification (via Gemini CLI or other tools) must strictly adhere to these rules:

## 1. Architectural Consistency
- **Maintain MVC**: Never combine business logic, database queries, and view rendering in a single file.
- **Route Naming**: Do not rename existing routes or controllers.
- **Reuse Components**: Use existing Bootstrap-based cards, buttons, and badges before creating new UI elements.

## 2. Code Quality & Formatting
- **Synchronous SQLite**: Use the synchronous API provided by `better-sqlite3` to keep code readable.
- **Responsive Design**: All new pages must be mobile-friendly using Bootstrap 5 grid system.
- **Comments**: Include meaningful comments in both JS and EJS files.

## 3. Database & Migration
- **No Direct Schema Changes**: Do not modify `database/setup.js` for existing tables.
- **Migration Logic**: Always create a separate migration script (e.g., `database/migrate_vX.js`) for adding columns or new tables.
- **Unique Constraints**: Maintain `customer_code` and `mobile` as unique identifiers for customers.

## 4. Multilingual Compliance
- **I18n Wrapper**: Wrap every visible string in the `__("key")` helper function.
- **Locales Update**: Whenever a new label is added, update both `locales/en.json` and `locales/mr.json`.
- **Naming Conventions**: Use `snake_case` for translation keys (e.g., `total_customers`).

## 5. Synchronization & Documentation
- **Check State**: Analyze the current directory and codebase before generating code.
- **Update Changelog**: Automatically append a new entry to `docs/CHANGELOG.md` after every feature implementation.
- **Handover Update**: Reflect structural changes in `docs/AI_HANDOVER.md` and `docs/PROJECT_MAP.md`.

## 6. Safety & Security
- **Credential Protection**: Never commit or log values from `.env`.
- **Error Handling**: Use `try...catch` blocks for all database operations and provide user-friendly translated error messages.
