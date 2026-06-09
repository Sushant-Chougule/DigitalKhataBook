# VS Code Development Guide (Start Here)

Welcome to DigitalKhataBook! If you are a human developer starting to work on this project in VS Code, follow this recommended learning order to understand the architecture.

## Recommended Learning Order

### 1. `package.json`
- **Purpose**: Lists all dependencies (Express, better-sqlite3, EJS, etc.) and startup scripts.
- **Modify**: Safe to add new npm packages.
- **Do not modify**: Existing core dependency versions unless thoroughly testing afterwards.

### 2. `server.js`
- **Purpose**: The main entry point. Sets up Express, session middleware, EJS layouts, and mounts all routes.
- **Modify**: Safe to add new `app.use('/route', ...)` declarations.
- **Do not modify**: Core middleware order (session, body-parser, langMiddleware) as it can break authentication and translation.

### 3. `routes/`
- **Purpose**: Maps URLs (e.g., `/customers`) to controller functions.
- **Modify**: Safe to add new endpoints. Use `router.use(authMiddleware)` to protect routes.

### 4. `controllers/`
- **Purpose**: Contains the core business logic.
- **Modify**: Safe to edit. This is where you write SQLite queries and define data passed to `res.render()`.
- **Do not modify**: Do not remove the `try/catch` blocks surrounding database queries.

### 5. `database/` (`setup.js`, `db.js`)
- **Purpose**: Handles SQLite connection and initial table creation.
- **Do not modify**: Do not alter existing schemas directly in `setup.js` if the app is already in production. Use migration scripts instead.

### 6. `middleware/`
- **Purpose**: Intercepts requests.
  - `authMiddleware.js`: Checks for `req.session.user`.
  - `langMiddleware.js`: Loads locales and provides the `__()` translation function to views.

### 7. `views/`
- **Purpose**: EJS templates for the UI.
  - `layouts/main.ejs`: The master template containing the sidebar and top navbar.
  - `pages/`: Individual screen templates.
- **Modify**: Safe to edit. Always wrap static text in `<%= __("key") %>` for multilingual support.

### 8. `locales/` (`en.json`, `mr.json`)
- **Purpose**: Dictionary files for translation.
- **Modify**: Always add corresponding keys to both files when introducing new UI text.

### 9. `public/` (`css/style.css`, `js/main.js`)
- **Purpose**: Client-side styling and scripts.
- **Modify**: Safe to add custom CSS or generic JS helpers. Note that specific page logic (like Chart.js configs) is often embedded in the specific EJS files rather than `main.js`.
