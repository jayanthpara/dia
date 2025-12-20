import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import LunaChat from './LunaChat';

const SOSButton = () => {
  const [status, setStatus] = useState<'idle' | 'countdown' | 'active'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setStatus('active');
        // Trigger alert logic here in the future
      }
    }
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const handleStart = () => {
    setStatus('countdown');
    setCountdown(3);
  };

  const handleCancel = () => {
    setStatus('idle');
    setCountdown(3);
  };

  const handleClose = () => {
    setStatus('idle');
    setIsMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (status === 'active') {
    return (
      <LunaChat
        onClose={handleClose}
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
      />
    );
  }

  const getRingProgress = () => {
    // 3 -> 0, 2 -> 33, 1 -> 66, 0 -> 100
    const progress = ((3 - countdown) / 3) * 100;
    return 100 - progress; // Dashoffset logic
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        {status === 'countdown' && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="white"
                strokeWidth="4"
                fill="transparent"
                className="opacity-30"
              />
              {/* Progress Circle */}
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="white"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="226"
                strokeDashoffset={226 * (countdown / 3)}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
          </div>
        )}

        <button
          onClick={status === 'idle' ? handleStart : handleCancel}
          className={`relative rounded-full shadow-lg transition-all duration-300 flex items-center justify-center
            ${status === 'countdown'
              ? 'w-16 h-16 bg-red-700 scale-110'
              : 'w-14 h-14 bg-red-600 hover:bg-red-700 hover:scale-105 animate-pulse'
            }`}
          title="Emergency SOS"
        >
          {status === 'countdown' ? (
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-lg leading-none">{countdown}</span>
              <X className="w-4 h-4 text-white opacity-70 mt-0.5" />
            </div>
          ) : (
            <AlertTriangle className="w-7 h-7 text-white" />
          )}
        </button>

        {status === 'countdown' && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black bg-opacity-75 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
            Tap to Cancel
          </div>
        )}
      </div>
    </>
  );
};

export default SOSButton;