# 🏃‍♀️ Alan Play Extension

A lightweight web app to create and manage team walking challenges. Built with **Vite + React + TypeScript + TailwindCSS** on the frontend, and **Flask + SQLite** on the backend.

---

## 🚀 Features

- ✅ Create team walking challenges with title, team members, reward, and D-Day
- ✅ View all challenges in a card layout
- ✅ Fully responsive UI with TailwindCSS
- ✅ Data persistence using Flask API + SQLite backend

---

## 🛠 Tech Stack

### Frontend
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend
- [Flask](https://flask.palletsprojects.com/)
- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)
- [SQLite](https://www.sqlite.org/index.html)

---

## 📦 Project Structure

```

alan-play-extension/
├── frontend/            # React + Tailwind frontend
│   ├── src/
│   ├── index.css        # Tailwind directives
│   ├── postcss.config.cjs
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/             # Flask backend
│   ├── app.py
│   └── db.sqlite
└── README.md

````

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/alan-play-extension.git
cd alan-play-extension
````

---

### 2. Frontend: Install & Run

```bash
cd frontend
npm install
npm run dev
```

> Runs at: [http://localhost:5173](http://localhost:5173)

---

### 3. Backend: Setup & Run

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Run the server
python app.py
```

> Runs at: [http://localhost:5000](http://localhost:5000)

---

## 🔧 Troubleshooting

### TailwindCSS not applying?

* Ensure `postcss.config.cjs` exists and uses CommonJS syntax
* Vite auto-detects `.cjs` config without needing extra config
* If you're using Tailwind v4, install `@tailwindcss/postcss` instead

---

## 📌 To-Do

* [ ] Challenge deletion
* [ ] Team ranking logic
* [ ] Progress tracking by steps
* [ ] Login/auth integration (optional)

---
