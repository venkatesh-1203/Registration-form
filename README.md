# QR Code Event Registration System

A simple full-stack event registration system built with **HTML/CSS/JavaScript** frontend, **Node.js + Express** backend, and **SQLite** database.

## ✅ Features

- Registration form (Name, Phone, Email, College, Department, Year)
- QR code generation linking to the registration page
- Admin dashboard with login, search, and CSV export

## 🗂 Project Structure

```
project/
  frontend/
    index.html
    admin.html
    style.css
    script.js
    admin.js
  backend/
    server.js
    db.js
    routes/
      registration.js
      admin.js
    controllers/
      registrationController.js
      adminController.js
  database/
    schema.sql
    event_registration.db  # Auto-created SQLite database
  package.json
  .env.example
  README.md
```

---

## 🚀 Setup Instructions

### 1) Clone or open this workspace in VS Code

Open the project folder in VS Code (`d:/registrationForm`).

### 2) Install dependencies

In a terminal:

```bash
npm install
```

### 3) Configure environment

Copy `.env.example` to `.env` and update values:

```bash
copy .env.example .env
```

Edit `.env` and set admin credentials and email settings.

### 4) Setup Email Confirmation (Optional)

To send confirmation emails after registration:

1. **For Gmail**: Go to your Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password (not your regular password)
   - Use your Gmail address as EMAIL_USER and the App Password as EMAIL_PASS

2. **For other email providers**: Configure SMTP settings in `.env`

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

> If email is not configured, registrations will still work but no confirmation emails will be sent.

### 5) Start the backend server

```bash
npm start
```

By default, it runs on `http://localhost:3000`.

### 6) Open the frontend

Open a browser and visit:

- Registration page: `http://localhost:3000/`
- Admin page: `http://localhost:3000/admin.html`

---

## 🔐 Default Admin Credentials

These are defined in the `.env` file. Defaults:

- Username: `admin`
- Password: `password`

----

## 🧩 Notes

- The database is SQLite (file-based, no server setup needed)
- The admin dashboard is protected with a simple session-based login.
- CSV export is available from the admin dashboard.

---

## ✅ Running in Dev Mode (Auto-restart)

If you want auto-reload during development:

```bash
npm run dev
```

---

## 🛠 Troubleshooting

- If the server fails to start, check for port conflicts (default 3000)
- Database file is created automatically in `database/event_registration.db`

---

Happy building! 🎉
#
