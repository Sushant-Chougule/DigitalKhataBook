# Client Deployment & Maintenance Guide - DigitalKhataBook

This guide explains how you and your teammate can transition **DigitalKhataBook** from a development project into a professional software product delivered to multiple clients.

---

## SECTION 1: CLIENT DELIVERY MODELS

| Model | Workflow | Advantages | Disadvantages | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Local Installation** | Install Node.js & project on client's laptop/PC. | No hosting costs; Offline access. | Hard to update; Data lost if PC crashes. | Small Dairy/Grocery (Single User) |
| **Own VPS Hosting** | Host all clients on one server you control. | Easier to update everyone at once. | Higher server load; One crash affects all. | Mixed clients (SaaS model) |
| **Dedicated Cloud** | Each client gets their own small server (e.g., Render/Railway). | High security; No interference between clients. | More expensive to manage multiple accounts. | Small Hospitals / Medical Shops |
| **SaaS Model** | One website, multiple logins (Tenant system). | Maximum scalability; One-click updates for all. | Complex to build; DB gets very large. | Professional Scaling |

**Recommendations:**
*   **Small Dairy/Grocery**: Local Installation or a very cheap VPS.
*   **Medical/Hospital**: Dedicated Cloud Deployment (for data privacy and reliability).

---

## SECTION 2: HOW TO HOST NODE.JS APPLICATIONS

### 1. Beginner-Friendly (PaaS)
*   **Railway / Render**: Easiest. You just connect your GitHub repo, and it goes live.
*   **Cost**: Free tier available, then ~$5/mo.
*   **Scalability**: Medium.

### 2. Professional (VPS)
*   **DigitalOcean / Linode / Hetzner**: You get a raw Linux computer. You must install Node.js and SQLite yourself.
*   **Cost**: Fixed ~$4-6/mo.
*   **Scalability**: High.

### 3. Enterprise (Cloud)
*   **AWS / Google Cloud / Azure**: Very complex. Overkill for this project initially.

**Our Recommendation**: Start with **Railway** or **Render** for your first 5 clients. Switch to a **DigitalOcean VPS** once you have 10+ clients to save costs.

---

## SECTION 3: DOMAIN SETUP

1.  **Buy a Domain**: Use Namecheap or GoDaddy (e.g., `clientname.digitalkhatabook.com` or `clientkhata.com`).
2.  **DNS Configuration**: Point the "A Record" to your Server IP or use a CNAME for Render/Railway.
3.  **SSL (HTTPS)**: 
    *   On Render/Railway: Automatic.
    *   On VPS: Use **Certbot (Let's Encrypt)**. It's free and makes the site secure (the lock icon).

---

## SECTION 4: CLIENT DATABASE MANAGEMENT

Since we use **SQLite**, we recommend **Option A: Separate Database Per Client**.

*   **Why?**: SQLite is a file. It is much easier to just copy `khatabook.db` for backups or move a client to a different server. 
*   **SaaS Approach**: If you want one website for all, you would add a `client_id` column to every table. This is harder to maintain for beginners.

---

## SECTION 5: CLIENT ONBOARDING PROCESS

1.  **Requirement Gathering**: Understand if they need Marathi, specific business types, or custom reports.
2.  **Demo**: Show them the current DigitalKhataBook on your laptop.
3.  **Development**: Customize the `.env` (Client Name, Admin Pass) and Locales.
4.  **Testing**: Verify the balance logic with their sample data.
5.  **Deployment**: Go live on their chosen model (Local or Cloud).
6.  **Training**: Spend 1 hour teaching them how to add customers and record milk/purchases.
7.  **Support**: Provide a WhatsApp number for queries.

---

## SECTION 6: FUTURE UPDATES (The "WhatsApp" Example)

If a client wants **WhatsApp Integration**:
1.  **Branch**: Create `feature/whatsapp-alerts`.
2.  **Develop**: Add code to send API requests to a WhatsApp provider.
3.  **Test**: Test on your local machine.
4.  **Staging**: Deploy to a "hidden" test server for the client to see.
5.  **Production**: Once approved, update the client's real server.

---

## SECTION 7: VERSION MANAGEMENT

We use **Semantic Versioning (vMajor.Minor.Patch)**:
*   **v1.0.0**: Initial launch.
*   **v1.1.0**: Added a feature (Marathi support).
*   **v1.1.1**: Fixed a small bug in the graph.
*   **v2.0.0**: Major change (e.g., changing from SQLite to MySQL or adding Mobile App).

---

## SECTION 8: CLIENT UPDATE PROCESS

To update a live client safely:
1.  **Backup**: Copy `database/khatabook.db` to a safe folder.
2.  **Pull**: Run `git pull` on the server to get new code.
3.  **Migrate**: If you added new columns, run your migration script (`node database/migrate_v2.js`).
4.  **Restart**: Run `pm2 restart all` (if using a VPS) or let the cloud provider auto-restart.
5.  **Verify**: Open the site and check if the data is still correct.

---

## SECTION 9: DATABASE BACKUP STRATEGY

*   **Daily**: Auto-copy the `.db` file to a cloud folder (Google Drive/Dropbox).
*   **Weekly**: Download a copy to your own developer machine.
*   **Restore**: If the client deletes something by mistake, rename the latest backup to `khatabook.db` and replace the current one.

---

## SECTION 10: MULTIPLE CLIENT MANAGEMENT

*   **10 Clients**: Manual management is fine.
*   **50+ Clients**: Use **Docker** to package the app and **CI/CD (GitHub Actions)** to update all servers automatically when you push code to GitHub.
*   **Support**: Use a simple Trello board or Excel sheet to track which client has which version.

---

## SECTION 11: CLIENT FEATURE REQUEST WORKFLOW

1.  **Request**: Client asks for "Daily SMS".
2.  **Analysis**: Can we do it? How much will the SMS provider cost?
3.  **Costing**: Give the client a quote (e.g., ₹2,000 one-time + ₹200/mo).
4.  **Approval**: Wait for payment/confirmation.
5.  **Execution**: Develop -> Test -> Deploy.

---

## SECTION 12: SUPPORT PACKAGES

| Plan | Response Time | Features | Price |
| :--- | :--- | :--- | :--- |
| **Basic** | 48 Hours | Bug fixes only. | ₹500/mo |
| **Standard** | 24 Hours | Bug fixes + Monthly Backups. | ₹1,500/mo |
| **Premium** | 4 Hours | Custom features + Training. | ₹3,000/mo |

---

## SECTION 13: FREELANCER BEST PRACTICES

*   **Staging vs Production**: Never test new code on a client's live site. Have a "Test" server that looks exactly like theirs.
*   **Change Tracking**: Always update `CHANGELOG.md` so you know what version each client is running.
*   **Communication**: Tell clients 24 hours before a scheduled maintenance/update.

---

## SECTION 14: GITHUB + DEPLOYMENT WORKFLOW

1.  **`dev` branch**: You and your friend write code here.
2.  **`main` branch**: Clean code ready for clients.
3.  **Workflow**:
    *   Develop in `dev`.
    *   Merge `dev` -> `main`.
    *   GitHub triggers a "Webhook" to **Render/Railway**.
    *   Client site updates automatically.

---

## SECTION 15: DIGITALKHATABOOK ROADMAP

*   **v1.0**: (Current) Core Ledger, Marathi, Dark Mode, Excel Export.
*   **v1.5**: WhatsApp Notifications, QR Code for Customer Payments.
*   **v2.0**: Inventory Management (Stock tracking for shops).
*   **v2.5**: Mobile App (Android/iOS) using Flutter or React Native.
*   **v3.0**: AI Insights (Predict which customer will pay late).

---
**Prepared by: DigitalKhataBook Dev Team**
