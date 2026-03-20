import React from 'react';
import { Users, Clock, Monitor, Shield, Bell, Settings } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useAllScreenshots } from '../hooks/useAllScreenshots';

function Dashboard() {
  const { data: employees = [] } = useEmployees();
  const { data: screenshots = [] } = useAllScreenshots();



  return (
    <div className="min-h-screen bg-gray-100 py-5">
      {/* Main Content */}
      <div className="px-5 pb-8">
        <div className="mx-auto">

      
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="text-blue-600" size={20} />
                </div>
                <span className="text-slate-500 text-sm">Employees</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{employees.length}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="text-green-600" size={20} />
                </div>
                <span className="text-slate-500 text-sm">Online</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{employees.filter((e) => e.status === 'online').length}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="text-purple-600" size={20} />
                </div>
                <span className="text-slate-500 text-sm">Work Hours</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">8h</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Monitor className="text-orange-600" size={20} />
                </div>
                <span className="text-slate-500 text-sm">Screenshots</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{screenshots.length}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-2">Manage Employees</h3>
              <p className="text-slate-500 text-sm">View and manage your team members, track their status and activity.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
                <Monitor className="text-green-600" size={24} />
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-2">View Reports</h3>
              <p className="text-slate-500 text-sm">Access detailed reports and analytics about employee productivity.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                <Shield className="text-purple-600" size={24} />
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-2">Security Settings</h3>
              <p className="text-slate-500 text-sm">Configure monitoring settings and privacy controls for your workspace.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
