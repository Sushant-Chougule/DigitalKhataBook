# Git & GitHub Collaboration Guide - DigitalKhataBook

Welcome! This guide will help you and your friend work together on the **DigitalKhataBook** project using VS Code and GitHub. By following these steps, you can both write code at the same time without worrying about deleting each other's work.

---

## SECTION 1: WHAT IS GIT AND GITHUB?

*   **Git**: Think of Git as a "Time Machine" for your code. It records every change you make. If you break something, you can use Git to go back to a time when it was working.
*   **GitHub**: This is a "Cloud Storage" (like Google Drive) specifically for Git. It hosts your code online so your friend can access it.
*   **Why use Git?**: It prevents accidental data loss and allows multiple people to work on the same project.
*   **Why use Branches?**: A branch is a separate "copy" of the project where you can experiment. 
    *   **The `main` branch**: This is your "Final Product." It should always be working and bug-free.
    *   **Feature branches**: This is where you do the work. You only move your code to `main` after it is tested and finished.
    *   *Example*: While you are fixing a "Login Bug," your friend can be adding "Marathi Translation" in their own branch. You won't clash!

---

## SECTION 2: FIRST TIME GITHUB SETUP

1.  **Create an Account**: Go to [github.com](https://github.com/) and sign up.
2.  **Install Git**: Download and install from [git-scm.com](https://git-scm.com/).
3.  **Verify**: Open the terminal in VS Code and type:
    ```bash
    git --version
    ```
4.  **Configure your identity**: (Do this once so GitHub knows who wrote the code)
    ```bash
    git config --global user.name "Your Name"
    git config --global user.email "your-email@example.com"
    ```

---

## SECTION 3: PUSH EXISTING PROJECT TO GITHUB

Follow these steps to move your `DigitalKhataBook` folder from your D: drive to GitHub:

1.  **Open Terminal** in VS Code (Ensure you are inside `D:\DigitalKhataBook`).
2.  **Initialize Git**:
    ```bash
    git init
    ```
3.  **Create a `.gitignore` file**: This tells Git to ignore heavy or private files. Create a file named `.gitignore` and paste this inside:
    ```text
    node_modules/
    .env
    database/khatabook.db
    ```
4.  **Add and Commit**:
    ```bash
    git add .
    git commit -m "Initial commit: DigitalKhataBook base project"
    ```
5.  **Create GitHub Repository**:
    *   Go to GitHub -> Click **New Repository**.
    *   Name it `DigitalKhataBook`.
    *   Keep it Public or Private as you prefer.
    *   Click **Create**.
6.  **Connect & Push**:
    *   Copy the URL of your new repo (e.g., `https://github.com/yourname/DigitalKhataBook.git`).
    *   In your terminal, type:
    ```bash
    git remote add origin https://github.com/yourname/DigitalKhataBook.git
    git branch -M main
    git push -u origin main
    ```

---

## SECTION 4: ADD YOUR FRIEND AS A COLLABORATOR

1.  On GitHub, open your `DigitalKhataBook` repository page.
2.  Click **Settings** (top tab).
3.  Click **Collaborators** (left sidebar).
4.  Click **Add people** -> Search for your friend's GitHub username.
5.  **Friend's Task**: They must check their email and **Accept the Invitation**.
6.  **Friend's Task (Clone)**: Your friend opens VS Code, opens a terminal in an empty folder on their PC, and types:
    ```bash
    git clone https://github.com/yourname/DigitalKhataBook.git
    ```

---

## SECTION 5: RECOMMENDED BRANCH STRATEGY

Always follow this "Branch Rule" to keep the project safe:

*   **`main`**: The "Gold Standard." Never edit this directly.
*   **`sushant-feature`**: Your playground.
*   **`friend-feature`**: Your friend's playground.

*Why?* If your friend's new code has a bug, it stays in their branch and doesn't break your working `main` version.

---

## SECTION 6: DAILY WORKFLOW

### Every Morning (Before you start coding):
1.  **Get latest code**:
    ```bash
    git checkout main
    git pull origin main
    ```
2.  **Go to your branch**:
    ```bash
    git checkout your-branch-name
    ```

### Every Evening (After work is done):
1.  **Save and Send**:
    ```bash
    git add .
    git commit -m "Describe what you did today"
    git push origin your-branch-name
    ```

---

## SECTION 7: CREATE A NEW BRANCH

Create a new branch for every new feature you build.
*Example naming*: `feature/customer-module` or `fix/login-bug`.

**Command**:
```bash
git checkout -b feature/name-here
```

---

## SECTION 8: SWITCH BRANCHES

*   **Check where you are**:
    ```bash
    git branch
    ```
    (The one with the `*` or in green is your current branch).
*   **Switch to another**:
    ```bash
    git checkout branch-name
    ```

---

## SECTION 9: COMMIT CODE PROPERLY

A "Commit" is a snapshot of your work. Use clear messages so you know what you did 6 months from now.

✅ **Good Examples**:
*   `git commit -m "Added Marathi translation for dashboard"`
*   `git commit -m "Fixed bug where customer balance was not updating"`
*   `git commit -m "Added search filter to customer list"`

❌ **Bad Examples**:
*   `git commit -m "fixed stuff"`
*   `git commit -m "update"`
*   `git commit -m "asdasd"`

---

## SECTION 10: PUSH CHANGES

1.  `git add .`: Stage your changes (Put them in the "waiting area").
2.  `git commit -m "..."`: Finalize the changes locally.
3.  `git push origin branch-name`: Upload them to the cloud (GitHub).

---

## SECTION 11: PULL CHANGES

If your friend finished a feature and moved it to `main`, you need to get it:
```bash
git checkout main
git pull origin main
```

---

## SECTION 12: MERGE BRANCHES

Once your feature (e.g., `feature/marathi`) is finished and tested:

1.  Go to `main`: `git checkout main`
2.  Pull latest: `git pull origin main`
3.  **Merge**: `git merge feature/marathi`
4.  **Push**: `git push origin main`

---

## SECTION 13: HANDLE MERGE CONFLICTS

**What is a conflict?**
It happens when you and your friend both edit the **exact same line** of the same file. Git doesn't know which version to keep.

**How to fix it in VS Code**:
1.  VS Code will highlight the conflicting lines in **Red/Blue**.
2.  You will see options like:
    *   `Accept Current Change` (Keep yours)
    *   `Accept Incoming Change` (Keep your friend's)
    *   `Accept Both Changes` (Keep both)
3.  Click the option you want, save the file, and then:
    ```bash
    git add .
    git commit -m "Resolved merge conflict"
    git push origin main
    ```

---

## SECTION 14: USING GEMINI CLI WITH GITHUB

Before asking Gemini to generate code:
1.  `git pull origin main` (Ensure Gemini sees the latest code).
2.  `git add .` & `git commit` (Save your own work first).
3.  `git checkout -b gemini-task-name` (Let Gemini work in a new branch).

After Gemini finishes:
1.  Test the code.
2.  If it works: `git merge` it into your branch.

---

## SECTION 15: VS CODE GIT FEATURES

You don't always need to type commands!
*   **Source Control Tab** (The icon with 3 circles): See all changed files.
*   **(+) Button**: Same as `git add`.
*   **Checkmark (✓) Button**: Same as `git commit`.
*   **Sync Button (bottom left)**: Same as `git pull` and `git push`.

---

## SECTION 16: PROJECT RULES

1.  **Never code on `main`**: Always use a feature branch.
2.  **Pull first**: Always `git pull` before you start typing code.
3.  **Commit small, commit often**: Don't wait 3 days to commit.
4.  **Test before you Push**: Make sure the server starts (`npm start`) before uploading.
5.  **Update documentation**: If you add a feature, add a line to `docs/CHANGELOG.md`.

---

## SECTION 17: CHEAT SHEET

| Task | Command |
| :--- | :--- |
| **Clone project** | `git clone [URL]` |
| **Create new branch** | `git checkout -b [branch-name]` |
| **Switch branch** | `git checkout [branch-name]` |
| **Save changes** | `git add .` |
| **Snapshot work** | `git commit -m "Message"` |
| **Upload work** | `git push origin [branch-name]` |
| **Download latest** | `git pull origin main` |
| **Combine code** | `git merge [branch-name]` |
| **Check status** | `git status` |

---
**Happy Coding!** 🚀
