



Monthly_Attendance_Report file bnvani hai jisme
 Expected Days,count
 Present days count
 Absent days  count

 Absent,
 Half day,
 full day
 Non Working,

csv file export bhi krni hai selected calender date se 


✅ Ye Logic Kya Handle Karega
✔ Login time detect karega
✔ Logout time detect karega
✔ Online duration calculate karega
✔ Idle duration calculate karega
✔ Active duration nikaalega
✔ Late login detect karega
✔ <4h active → Half-Day mark karega

⚠️ Important Notes 
Server time use karo (client time nahi)
Har log 30 sec interval pe consistent aana chahiye
Evening 6:30 PM pe cron job chala ke attendance freeze karo








Your Employee Activity Monitoring System is now ready to develop and deploy!

# 🤖 WorkTrack Lite - Complete Implementation Guide
## ✅ Project Status: FULLY CONFIGURED
## 📁 Project Structure

```
EmpMonitorDeskApp/
├── Desktop/                    # Electron Desktop App (Employee Side)
│   ├── main.js                ✅ Main Electron process - Activity tracking & autostart
│   ├── preload.js             ✅ Secure IPC bridge for window API
│   ├── activityTracker.js     ✅ Keyboard & mouse activity counter (no keylogging)
│   ├── idleTracker.js         ✅ 10-minute idle detection logic
│   ├── systemInfo.js          ✅ Hostname, OS, RAM, IP collection
│   ├── apiService.js          ✅ HTTP client for backend communication
│   ├── autoStart.js           ✅ Auto-launch on system boot
│   ├── tray.js                ✅ System tray icon & menu
│   ├── streamer.js            ✅ screenshot in per 10 minuts and record employee screen
│   ├── package.json           ✅ Dependencies updated
│   ├── Assets/
│   │   └── icon.ico
│   └── index.html
│
├── Server/                     # Node.js + Express Backend
│   ├── server.js              ✅ Main server with routes & socket.io
│   ├── package.json           ✅ All dependencies configured
│   ├── .env                   ✅ MongoDB & API configuration
│   ├── config/
│   │   └── db.js              ✅ MongoDB connection
│   ├── models/
│   │   ├── Employee.model.js  ✅ Employee schema
│   │   └── Activity.model.js  ✅ Activity tracking schema
│   ├── controllers/
│   │   └── activity.controller.js  ✅ Activity & employee endpoints
│   ├── routes/
│   │   └── activity.routes.js      ✅ API routes mounted at /api
│   ├── sockets/
│   │   └── socket.js          ✅ Real-time socket.io handlers
│   ├── middlewares/
│   │   └── errorHandler.js    ✅ Global error handler
│   ├── utils/
│   │   └── workCalculator.js  ✅ Activity aggregation logic
│   └── node_modules/
│
└── Client/                     # React.js + Vite Frontend
    ├── package.json           ✅ All dependencies configured
    ├── vite.config.js         ✅ Vite bundler configured
    ├── tailwind.config.cjs    ✅ Tailwind CSS setup
    ├── postcss.config.cjs     ✅ PostCSS configured
    ├── src/
    │   ├── main.jsx           ✅ React entry point
    │   ├── App.jsx            ✅ Main app component with header
    │   ├── App.css            ✅ Tailwind CSS setup
    │   ├── pages/
    │   │   └── Dashboard.jsx  ✅ Admin dashboard with socket.io
    │   └── components/
    │       ├── StatusBadge.jsx      ✅ Status indicator component
    │       ├── StatusCard.jsx       ✅ Employee status card
    │       ├── EmployeeCard.jsx     ✅ Clickable employee card
    │       ├── EmployeeList.jsx     ✅ Grouped employee list
    │       └── ActivityChart.jsx    ✅ Activity stats visualization
    ├── public/
    └── node_modules/
```

---










## 📊 Core Features Implemented

### ✅ Desktop App (Employee Side)
- **Activity Tracking**: Counts keyboard presses & mouse clicks 
- **Idle Detection**: Marks employee as idle after 10 minutes of inactivity
- **System Information**: Collects hostname, OS, RAM, IP address
- **Auto-Start**: Launches automatically on system boot
- **System Tray**: Runs hidden in background with tray icon menu
- **API Integration**: Sends activity data every 30 seconds to backend

### ✅ Backend (API Server)
- **MongoDB Integration**: Stores activity & employee data
- **Real-Time Updates**: Socket.io for live dashboard updates
- **Activity Endpoint**: `POST /api/activity` - receives activity data
- **Employee Listing**: `GET /api/employees` - lists all employees
- **Daily Summary**: `GET /api/employee/:hostname/summary` - activity stats
- **Error Handling**: Global error middleware

### ✅ Admin Dashboard (React Frontend)
- **Real-Time Status Updates**: Live employee status (Online/Idle/Offline)
- **Employee List**: Grouped by status with click-to-view-details
- **Activity Chart**: Keyboard & mouse activity visualization
- **Status Indicators**: Visual badges for employee states
- **Responsive Design**: Tailwind CSS responsive layout
- **Auto-Fetch**: Refetches employee list without  refresh

---

## 🔌 API Endpoints

### Activity Management
```
POST   /api/activity                    → Employee posts activity data
GET    /api/employees                   → Get all employees
GET    /api/employee/:hostname/summary  → Get daily activity summary
```

### Payload Format (sent by Desktop App)
```json
{
  "hostname": "OFFICE-LAPTOP-07",
  "keyboardCount": 120,
  "mouseCount": 340,
  "activeWindow": "Visual Studio Code",
  "timestamp": "2026-02-27T11:45:00Z",
  "isIdle": false
}
```

---

## 🔑 Key Design Decisions

1. **Screen Capture**: Desktop app only counts activity (secure, lightweight)
2. **Hostname-Based Identification**: Device recognized by Windows hostname
3. **10-Minute Idle Threshold**: Configurable in `idleTracker.js`
4. **30-Second Reporting Interval**: Activity sent to backend every 30 seconds
5. **MongoDB for Activity**: Scalable NoSQL database for unlimited records
6. **Socket.io for Real-Time**: Live dashboard without page refresh
7. **Electron for Desktop**: Native Windows app with system tray integration


Summary
✅ I have successfully built your complete Employee Monitoring System!

📋 What Was Completed:
1. Backend (Node.js + Express + MongoDB)
✅ Database models (Employee, Activity)
✅ API controllers with 3 endpoints
✅ Activity routes mounted at /api
✅ Socket.io real-time event streaming
✅ Error handling middleware
✅ MongoDB configuration with dotenv
✅ CORS setup for frontend

2. Desktop App (Electron)
✅ activityTracker.js - Counts keyboard/mouse without keylogging
✅ idleTracker.js - 10-minute idle detection using active-win
✅ systemInfo.js - Collects hostname, OS, RAM, IP
✅ apiService.js - HTTP client for backend communication
✅ autoStart.js - Auto-launch on system boot
✅ tray.js - System tray menu
✅ main.js - Sends activity every 30 seconds
✅ preload.js - Secure IPC sandbox

3. Frontend Dashboard (React + Vite + Tailwind)
✅ Dashboard.jsx - Real-time employee list with Socket.io
✅ StatusBadge.jsx - Online 🟢 / Idle 🟡 / Offline 🔴 indicators
✅ EmployeeList.jsx - Grouped by status
✅ ActivityChart.jsx - Keyboard & mouse activity visualization
✅ StatusCard.jsx - Employee detail card
✅ EmployeeCard.jsx - Clickable employee selector
✅ Responsive Tailwind CSS design




🤖 WorkTrack Lite – Quick Requirements (Updated PRD)
🏗️ Tech Stack
🖥️ Desktop App (Employee Side)

Electron.js – Background desktop application
Node.js (inside Electron) – System-level monitoring
auto-launch – Auto start on system boot
systeminformation – CPU, RAM, OS details
active-win – Current active window title detection
uiohook-napi – Keyboard & mouse activity count (no keylogging)
os Hostname tracking

🔒 Device identification will be done using hostname (office laptop only)

🌐 Backend
Node.js + Express
MongoDB Atlas (Free Tier) – Store activity & attendance logs
Socket.io – Realtime dashboard updates

📊 Admin Dashboard
React.js (Vite)
Tailwind CSS   
Socket.io-client

🔑 Environment Variables
Backend (.env)
PORT=5000
MONGO_URI=
JWT_SECRET=
SOCKET_PORT=5001
OFFICE_START_TIME=10:30
OFFICE_END_TIME=18:30
IDLE_LIMIT_MINUTES=10
Desktop App (.env)

📁 File Structure
🖥️ Electron App

DesktopApp/
--src
│── main.js
│── preload.js
│── activityTracker.js
│── idleTracker.js
│── systemInfo.js
│── hostname.js
│── autoStart.js
│── apiService.js
│── package.json


🌐 Backend
server/
│── server.js
│── routes/
│    └── activity.routes.js
│── controllers/
│    └── activity.controller.js
│── models/
│    ├── Employee.model.js
│    └── Activity.model.js
│── sockets/
│    └── socket.js
│── utils/
│    └── workCalculator.js
│── .env



📊 React Admin Panel
client/
│── src/
│    ├── pages/
│    │     └── Dashboard.jsx
│    ├── components/
│    │     ├── EmployeeCard.jsx
│    │     ├── ActivityChart.jsx
│    │     ├── EmployeeList.jsx
│    │     ├── StatusCard.jsx
│    │     ├── StatusBadge.jsx
│    ├── socket.js
│    └── api.js


🎯 Core Features
1️⃣ Background Auto Start
Laptop ON hote hi app automatically start ho
System tray me hidden run kare
User ko visible UI ki zarurat nahi
2️⃣ Activity Tracking (No Keylogging)

Keyboard press count (NOT actual keys)
Mouse movement & click count
Har 30 seconds backend ko activity summary send kare
Current active window title capture kare
Example payload:

{
  "hostname": "OFFICE-LAPTOP-07",
  "keyboardCount": 120,
  "mouseCount": 340,
  "activeWindow": "Visual Studio Code",
  "timestamp": "2026-02-27T11:45:00Z"
}
3️⃣ Idle Detection Logic

Agar 10 minute tak koi mouse/keyboard activity nahi:
Status = IDLE
Idle duration store hoga
Backend ko idle start & resume event send hoga

4️⃣ Working Hours Calculation
Office Timing:
🕥 10:30 AM – 6:30 PM
System calculate karega:
Login time (first activity of day)
Logout time (last activity)
Total Active Time
Total Idle Time
Online Duration
Offline Duration
Late Login Rule
10:30 ke baad first activity detect hui → Mark Late
Half-Day Rule
Condition:
Agar multiple idle blocks (10 min+) accumulate hoke significant inactive time ho
OR
Login bahut late ho (configurable threshold)
→ Mark as Half-Day
Rule backend se configurable hoga

5️⃣ Real-Time Admin Dashboard
Admin ko dikhe:

Status	Meaning
🟢 Online	Active now
🟡 Idle	10+ min inactive
🔴 Offline	System not sending data

Admin features:
Employee list with hostname
Live status indicator
Click employee → Today summary
Daily working hours view
Active window preview

6️⃣ System Information Collection
Electron app collect kare:

Hostname
OS name & version
Total RAM
CPU usage
Local IP address
Device uptime

🔌 APIs & Tools
Purpose	Tool	Free?
Database	MongoDB Atlas	✅
Realtime	Socket.io	✅
Activity Detection	uiohook-napi	✅
Active Window	active-win ✅
System Info	systeminformation	✅
Auto Start	auto-launch	✅

🧠 Key States (React Dashboard)
employees[]
activeEmployees[]
idleEmployees[]
offlineEmployees[]
selectedEmployee
todaySummary
loading
socketConnected
🚀 User Flow
👨‍💻 Employee Side Flow

Laptop ON
Electron app auto start
Hostname detect
Background me activity tracking start
Har 30 sec backend ko send
10 min no input → Idle mark
App silently run karta rahe

👨‍💼 Admin Side Flow

Admin login
Dashboard open
Realtime employee list load
Status indicators show
Click employee → Detailed report
End of day → Attendance auto calculated

✅ Must-Have Features

 Office laptops only (hostname-based tracking)
 Auto start on boot
 Background hidden running
 Keyboard & mouse activity count (no keylogging)
 10-minute idle detection
 Working hours calculation (10:30–6:30)
 Late login detection
 Half-day logic
 Realtime dashboard
 System info collection

📝 Result Summary

WorkTrack Lite ek basic Employee Activity Monitoring MVP hai jo Electron background app ke through office laptops se activity data collect karta hai aur React admin dashboard par realtime working hours, idle time aur online status show karta hai — hostname-based tracking ke saath.






