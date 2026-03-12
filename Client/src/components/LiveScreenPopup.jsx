import React from 'react';
import { X, Monitor } from 'lucide-react';

export default function LiveScreenPopup({ employee, screenData, isStreaming, onClose, onStart, onStop }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Monitor className="text-blue-600" size={24} />
            <h3 className="font-bold text-lg">Live Screen - {employee?.hostname}</h3>
            {isStreaming && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full animate-pulse">
                Live
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 bg-gray-900 flex items-center justify-center min-h-[400px]">
          {screenData ? (
            <img
              src={screenData.image}
              alt="Live Screen"
              className="max-w-full max-h-[500px] rounded shadow-lg"
            />
          ) : (
            <div className="text-white text-center">
              <Monitor size={64} className="mx-auto mb-4 opacity-50" />
              <p>Waiting for screen data...</p>
              <p className="text-gray-400 text-sm mt-2">Make sure the employee app is running</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {screenData ? `Last updated: ${new Date(screenData.timestamp).toLocaleTimeString()}` : 'Connecting...'}
          </p>
          <button
            onClick={isStreaming ? onStop : () => onStart(employee?.hostname)}
            className={`px-4 py-2 rounded-lg transition ${
              isStreaming 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isStreaming ? 'Stop Viewing' : 'Start Viewing'}
          </button>
        </div>
      </div>
    </div>
  );
}
