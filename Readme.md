
- Email: admin@kavyashift.com  
- Password:Kavyashift@123


# EmpMonitorDeskApp - Employee Activity Monitoring System

A complete employee monitoring solution with desktop tracking app, backend API, and admin dashboard.

---

## Project Structure

```
EmpMonitorDeskApp/
├── ElectronApp/     # Desktop app (Employee side)
├── Server/           # Backend API (Node.js + Express + MongoDB)
└── Client/           # Admin Dashboard (React + Vite)
```

---

## Tech Stack

### Desktop App (Electron)
- **Electron** - Desktop application framework
- **uiohook-napi** - Keyboard & mouse activity tracking
- **screenshot-desktop** - Screenshot capture
- **active-win** - Active window detection
- **auto-launch** - Auto-start on system boot

### Backend
- **Node.js + Express** - API server
- **MongoDB** - Database for activities & attendance
- **Socket.io** - Real-time updates
- **Multer** - File handling

### Frontend (Admin Dashboard)
- **React** (Vite) - UI framework
- **Tailwind CSS** - Styling
- **Socket.io-client** - Real-time connection

---

## Core Features

### Desktop App (Employee Side)
- Activity tracking (keyboard press count & mouse click count)
- Idle detection (10 minutes inactivity = idle)
- Screenshot capture
- Active window title detection
- System info collection (hostname, OS, RAM, IP)
- Auto-start on system boot
- System tray background running
- Sends activity data every 5 seconds to backend

### Backend Features
- Employee management (hostname-based identification)
- Activity data storage & processing
- Real-time status updates via Socket.io
- Automatic offline detection (2 min threshold)
- Working hours calculation

### Attendance System
- **Daily tracking**: Login time, logout time, active time, idle time
- **Late login detection**: After 10:30 AM
- **Half-day logic**: < 4 hours active = half day
- **Monthly reports**: Expected days, present days, absent days
- **CSV export**: Export attendance for selected date range

### Admin Dashboard
- Real-time employee status (Online/Idle/Offline)
- Employee list with live status indicators
- Click to view detailed daily summary
- Attendance calendar view
- Date range picker for reports
- CSV export functionality

---

## API Endpoints

### Activity
```
POST   /api/activity                    # Receive activity data from desktop app
GET    /api/employees                   # List all employees
GET    /api/employee/:hostname/summary  # Get daily activity summary
```

### Attendance
```
POST   /api/attendance/calculate        # Calculate attendance for date range
GET    /api/attendance                  # Get attendance records
GET    /api/attendance/export           # Export attendance as CSV
```

### Screenshots
```
POST   /api/screenshots/upload           # Upload screenshot
GET    /api/screenshots/:employeeId     # Get employee screenshots
```

---

## Running the Project

### 1. Backend Server
```bash
cd Server
npm install
# Create .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# FRONTEND_URL=http://localhost:5173
npm run dev
```

### 2. Desktop App
```bash
cd ElectronApp
npm install
# Create .env file with:
# BACKEND_URL=http://localhost:5000 
npm start
# Or build:
npm run build
```

### 3. Admin Dashboard
```bash
cd Client
npm install
# Create .env file with:
# ⁢VITE_API_URL=http://localhost:5000/api
# VITE_SOCKET_URL=http://localhost:5000
# optionally for desktop updater:
# UPDATE_REPO=yourUser/yourRepo
npm run dev
# Or build:
npm run build
---

## Configuration

### Backend (.env)
```
⁡⁣⁣⁢MONGO_URI=mongodb+srv://karanrajput:karanrajput@cluster0.bm0rc6v.mongodb.net/emptracker
FRONTEND_URL=http://localhost:5173
PORT=5000⁡
```
---

### Desktop App (.env)
⁡⁢⁣⁣```
BACKEND_URL=http://localhost:5000
# optional: GitHub repo used by the auto‑updater; override in code or set via UPDATE_REPO
# UPDATE_REPO=yourUser/yourRepo
```⁡
---

### Frontend (.env)
⁡⁢⁣⁢```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```⁡

---

## Status Indicators

| Status | Meaning |
|--------|---------|
| 🟢 Online | Active now |
| 🟡 Idle | 10+ min inactive |
| 🔴 Offline | Not sending data |

---

## Attendance Logic
⁡⁣⁢⁣
- **Office Hours**: 10:30 AM - 6:30 PM
- **Late Login**: After 10:30 AM = Late
- **Half-Day**: < 4 hours active time
- **Status Types**: full_day, half_day, absent, non_working
⁡

Attendance calculation 2 steps mein hota hai:
1. Calculate Attendance (Server/controllers/attendance.controller.js:6-77)
Har employee ke liye har din ye check hota hai:
- Activity records find kiye jate hain us din ke liye
- Weekend (Sat-Sun) ko non_working mark kiya jata hai
- Activities milne par → workCalculator.js se summary calculate hota hai
2. Full Day vs Half Day (Server/utils/workCalculator.js:82-84)
const HALF_DAY_ACTIVE_HOURS = 4; // <4h active => half day
const halfDay = activeHours < HALF_DAY_ACTIVE_HOURS;
Logic:
- Active time (onlineTime - idleTime) < 4 hours → Half Day
- Active time >= 4 hours → Full Day
- Koi activity nahi → Absent
Office timing: 10:30 AM se 6:30 PM
3. Summary (Server/controllers/attendance.controller.js:115-124)
const presentDays = full_day + half_day;
const absentDays = absent;
Attendance report mein:
- Present Days = Full Day + Half Day
- Absent Days = sirf 'absent' status wale din

