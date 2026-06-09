# Git Workflow - DigitalKhataBook

For hybrid manual and AI development, follow this standard branch-based Git workflow.

## Recommended Workflow

### 1. Create Feature Branch
Always work on a separate branch, not `main`.
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Develop in VS Code
- Write your code or use Gemini CLI to assist.
- Ensure changes follow `/docs/AI_RULES.md`.

### 3. Test Locally
- Run the server: `npm start`
- Verify multilingual support and dark mode UI.

### 4. Commit Changes
- Write clear, concise commit messages.
```bash
git add .
git commit -m "feat: Added email notifications to customer profile"
```

### 5. Update Documentation
- Ensure `/docs/CHANGELOG.md` is updated.
- Update `/docs/PROJECT_MAP.md` if new files were created.

### 6. Merge to Main
```bash
git checkout main
git pull origin main
git merge feature/your-feature-name
git push origin main
```
