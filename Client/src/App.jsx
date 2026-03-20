import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Wifi, WifiOff } from "lucide-react";
import { useSocket } from "./hooks/useSocket";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import "./App.css";

// 🔒 Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/login" replace />;
}

// 🔁 Auth Route
function AuthRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? <Navigate to="/" replace /> : children;
}

// 🎯 Layout (Single place for repeated UI)
function Layout({ children, socketConnected }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <header>
          <div className="py-5 bg-blue-50">
            <div className="px-5 mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-blue-600">
                  KavyaShift
                </h1>
                <p className="text-slate-500 mt-1">
                  Employee Monitoring Dashboard
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Socket Status */}
                <div className="flex items-center gap-2 text-sm">
                  {socketConnected ? (
                    <>
                      <Wifi size={16} className="text-green-500" />
                      <span className="text-green-600">Connected</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={16} className="text-red-500" />
                      <span className="text-red-600">Disconnected</span>
                    </>
                  )}
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}

// 🚀 Main App
function AppContent() {
  const { socketConnected } = useSocket();

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout socketConnected={socketConnected}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Layout socketConnected={socketConnected}>
                <Employees />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Layout socketConnected={socketConnected}>
                <Attendance />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppContent />;
}





























// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Wifi, WifiOff } from "lucide-react";
// import { useSocket } from "./hooks/useSocket";
// import Dashboard from "./pages/Dashboard";
// import Employees from "./pages/Employees";
// import Sidebar from "./components/Sidebar";
// import "./App.css";
// import Attendance from "./pages/Attendance";
// import Login from "./pages/Login";
// import ResetPassword from "./pages/ResetPassword";

// // Protected Route wrapper
// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem('adminToken');
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// }

// // Auth Route wrapper - redirect to dashboard if already logged in
// function AuthRoute({ children }) {
//   const token = localStorage.getItem('adminToken');
//   if (token) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// }

// function AppContent() {
//   const { socketConnected } = useSocket();

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Auth Routes */}
//         <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* Protected Routes */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <div className="min-h-screen bg-gray-50 flex">
//               <Sidebar />
//               <div className="flex-1">
//                 {/* Header */}
//                 <header>
//                   <div className="py-5 bg-blue-50">
//                     <div className="px-5 mx-auto flex items-center justify-between">
//                       <div>
//                         <h1 className="text-3xl font-bold text-blue-600">KavyaShift</h1>
//                         <p className="text-slate-500 mt-1">Employee Monitoring Dashboard</p>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <div className="flex items-center gap-2 text-sm">
//                           {socketConnected ? (
//                             <>
//                               <Wifi size={16} className="text-green-500" />
//                               <span className="text-green-600">Connected</span>
//                             </>
//                           ) : (
//                             <>
//                               <WifiOff size={16} className="text-red-500" />
//                               <span className="text-red-600">Disconnected</span>
//                             </>
//                           )}
//                         </div>
//                         <button
//                           onClick={() => {
//                             localStorage.removeItem('adminToken');
//                             localStorage.removeItem('admin');
//                             window.location.href = '/login';
//                           }}
//                           className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </header>
//                 {/* Main Content */}
//                 <main>
//                   <Dashboard />
//                 </main>
//               </div>
//             </div>
//           </ProtectedRoute>
//         } />

//         <Route path="/employees" element={
//           <ProtectedRoute>
//             <div className="min-h-screen bg-gray-50 flex">
//               <Sidebar />
//               <div className="flex-1">
//                 <header>
//                   <div className="py-5 bg-blue-50">
//                     <div className="px-5 mx-auto flex items-center justify-between">
//                       <div>
//                         <h1 className="text-3xl font-bold text-blue-600">KavyaShift</h1>
//                         <p className="text-slate-500 mt-1">Employee Monitoring Dashboard</p>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <div className="flex items-center gap-2 text-sm">
//                           {socketConnected ? (
//                             <>
//                               <Wifi size={16} className="text-green-500" />
//                               <span className="text-green-600">Connected</span>
//                             </>
//                           ) : (
//                             <>
//                               <WifiOff size={16} className="text-red-500" />
//                               <span className="text-red-600">Disconnected</span>
//                             </>
//                           )}
//                         </div>
//                         <button
//                           onClick={() => {
//                             localStorage.removeItem('adminToken');
//                             localStorage.removeItem('admin');
//                             window.location.href = '/login';
//                           }}
//                           className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </header>
//                 <main><Employees /></main>
//               </div>
//             </div>
//           </ProtectedRoute>
//         } />

//         <Route path="/Attendance" element={
//           <ProtectedRoute>
//             <div className="min-h-screen bg-gray-50 flex">
//               <Sidebar />
//               <div className="flex-1">
//                 <header>
//                   <div className="py-5 bg-blue-50">
//                     <div className="px-5 mx-auto flex items-center justify-between">
//                       <div>
//                         <h1 className="text-3xl font-bold text-blue-600">KavyaShift</h1>
//                         <p className="text-slate-500 mt-1">Employee Monitoring Dashboard</p>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <div className="flex items-center gap-2 text-sm">
//                           {socketConnected ? (
//                             <>
//                               <Wifi size={16} className="text-green-500" />
//                               <span className="text-green-600">Connected</span>
//                             </>
//                           ) : (
//                             <>
//                               <WifiOff size={16} className="text-red-500" />
//                               <span className="text-red-600">Disconnected</span>
//                             </>
//                           )}
//                         </div>
//                         <button
//                           onClick={() => {
//                             localStorage.removeItem('adminToken');
//                             localStorage.removeItem('admin');
//                             window.location.href = '/login';
//                           }}
//                           className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </header>
//                 <main><Attendance /></main>
//               </div>
//             </div>
//           </ProtectedRoute>
//         } />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// function App() {
//   return <AppContent />;
// }

// export default App;

