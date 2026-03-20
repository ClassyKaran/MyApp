import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Wifi, WifiOff, Cpu, Bell, Settings } from "lucide-react";
import { useSocket } from "./hooks/useSocket";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Sidebar from "./components/Sidebar";
import "./App.css";
import Attendance from "./pages/Attendance";

function AppContent() {
  const { socketConnected } = useSocket();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />

        <div className="flex-1">
          {/* Header */}
          <header className=" ">
            <div className=" py-5 bg-blue-50 ">
              <div className="px-5  mx-auto flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-blue-600">
                    KavyaShift
                  </h1>
                  <p className="text-slate-500 mt-1">
                    Employee Monitoring Dashboard
                  </p>
                </div>

                <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
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
                </button>
              
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />

              <Route path="/Attendance" element={<Attendance />} />
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
  return <AppContent />;
}

export default App;
