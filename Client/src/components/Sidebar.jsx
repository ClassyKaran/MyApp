import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Activity, Settings, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Dashboard', icon: <Home size={18} /> },
    { to: '/employees', label: 'Employees', icon: <Users size={20} /> },
    { to: '/Attendance', label: 'Attendance', icon: <Activity size={20} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="z-20">
      <div className="md:hidden p-2">
        <button
          onClick={() => setOpen((s) => !s)}
          className="p-2 rounded-md bg-white shadow-md"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`bg-white md:shadow-md md:rounded-r-lg md:h-screen md:sticky md:top-0 ${open ? 'block' : 'hidden md:block'}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">KavyaShift</h2>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}`
              }
              onClick={() => setOpen(false)}
            >
              <span className="text-lg">{l.icon}</span>
              <span className="font-medium">{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-gray-100 text-xs text-gray-500">
          <div>Version: 0.1.0</div>
        </div>
      </div>
    </aside>
  );
}
