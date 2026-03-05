import React from 'react';
import { Circle } from 'lucide-react';

export default function StatusBadge({ status }) {
  
  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Online', icon: <Circle className="text-white" size={12} /> },
    idle: { color: 'bg-yellow-500', label: 'Idle', icon: <Circle className="text-white opacity-75" size={12} /> },
    offline: { color: 'bg-red-500', label: 'Offline', icon: <Circle className="text-white opacity-50" size={12} /> },
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${config.color} text-white`}>
      <span>{config.icon}</span>
      {config.label}
    </div>
  );
}
