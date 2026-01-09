# 🏡 Working Family App

A fun and interactive app that helps families manage household chores and screen time!  
Kids earn screen time by completing tasks, while parents assign, approve, and track usage.

🌐 **Live Demo**: [https://family-c56e3.web.app/](https://family-c56e3.web.app/)

---

## 🧪 Try It Out – Demo Accounts

No need to sign up! Use these demo users to test the app instantly:

### 👨‍👩‍👧 Parent
- **Email**: a@a.com  
- **Password**: 098765

### 🧒 Child
- **Email**: b@b.com  
- **Password**: 098765

---

## ✨ Features

- 👪 Separate logins for parents and kids
- ✅ Assign chores with screen time rewards
- 📲 Drag-and-drop task management
- 🔐 Parental approval flow
- ⏱️ Track earned, pending, and used screen time
- 🎨 Fun sidebar with YouTube search and background customization

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite + React Bootstrap  
- **State Management**: React Context API  
- **Drag & Drop**: [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd)  
- **Backend**: Firebase (Auth + Firestore)  
- **API Integration**: YouTube Data API v3  

---

## 📦 Installation

```bash
git clone https://github.com/your-username/working-family-app.git
cd working-family-app
npm install
```
---

## 🔑 Create a .env file

VITE_FIREBASE_API_KEY=your_api_key  
VITE_FIREBASE_PROJECT_ID=your_project_id  
VITE_YOUTUBE_API_KEY=your_youtube_key

---

## 🚀 Run Locally

npm run dev

The app will run at: http://localhost:5173

---

## 📁 Project Structure

src/
├── api/               # Firebase + YouTube logic  
├── components/        # Reusable UI components  
├── context/           # App-wide state (Auth, Tasks, etc.)  
├── pages/             # Home, Tasks, Login, etc.  
├── templates/         # Layout components like Sidebar and Navbar  
├── App.jsx            # Main app layout and routing  

---

## 🧠 Why This App?

This app gives kids a structured way to earn time through responsibility, while giving parents a simple interface to oversee everything.

---

## 🗺️ Roadmap

📲 Push notifications

🧠 AI task suggestions

📅 Recurring weekly chores

🏆 Gamified reward system

🌐 Multi-language support

---

## 🤝 Contributing

PRs and suggestions are welcome!

1. Fork the repo  
2. Create your feature branch:
   git checkout -b feature/your-feature  
3. Commit your changes and push  
4. Open a pull request

---

## 📜 License

MIT © Yael

---

## 💬 Feedback?

Found a bug or have a suggestion?  
Open an issue or message me directly!
