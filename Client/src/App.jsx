
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Wifi, WifiOff, Cpu } from 'lucide-react';
import { useSocket } from './hooks/useSocket';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Sidebar from './components/Sidebar';
import './App.css';
import Attendance from './pages/Attendance';

function AppContent() {
  const { socketConnected } = useSocket();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex">
        
        <Sidebar />

        <div className="flex-1">
          
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
            
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <Cpu size={20} />
              WorkTrack Lite Admin Dashboard
            </h1>

            <div className="flex items-center gap-1 text-sm text-gray-600">
              {socketConnected ? (
                <>
                  <Wifi size={16} className="text-green-500" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff size={16} className="text-red-500" />
                  Disconnected
                </>
              )}
            </div>

          </header>

          {/* Main Content */}
          <main >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
          
              <Route
                path="/Attendance"
                element={
                  
                  <Attendance/>
                }
              />
              <Route
                path="/settings"
                element={
                  <div className="bg-white rounded-lg shadow p-6">
                    Settings view coming soon
                  </div>
                }
              />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;