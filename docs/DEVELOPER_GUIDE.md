# Developer Guide - DigitalKhataBook

## Getting Started
### Running the Project
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start the Server**:
   ```bash
   npm start
   ```
3. **Access the App**: [http://localhost:3000](http://localhost:3000)

### Development Mode
- Run with `node server.js`.
- For auto-restart on changes, install and use `nodemon`: `npx nodemon server.js`.

## Project Structure & Extension
### Adding a New Page
1. Create the EJS file in `views/pages/`.
2. Define a route in the relevant file in `routes/`.
3. Add a method in the corresponding `controllers/` file to render the view.
4. Update the sidebar in `views/layouts/main.ejs` if necessary.

### Adding a Route/Controller
- **Routes**: Follow the existing naming convention (e.g., `customerRoutes.js`).
- **Controllers**: Export methods (e.g., `exports.getMethod = (req, res) => { ... }`).
- **Middleware**: Use `authMiddleware.js` for routes requiring login.

### Database Modifications
- **Adding Columns**: Create a migration script in `database/` (like `migrate.js`) to `ALTER TABLE`.
- **Initialization**: `database/setup.js` handles table creation and admin seeding.

## Debugging
- Check terminal output for server-side errors (logged by `better-sqlite3` and `morgan` if added).
- Use browser DevTools (F12) for frontend console logs and network inspection.
- The `better-sqlite3` driver runs synchronously, making it easier to trace database errors.

## Deployment
1. Ensure `.env` contains secure `SESSION_SECRET` and correct `PORT`.
2. Ensure `database/` folder is writable by the process.
3. The app is self-contained; copying the folder and running `npm start` is sufficient for local servers.
