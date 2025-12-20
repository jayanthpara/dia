import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Maximize2, Shield } from 'lucide-react';

interface LunaChatProps {
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'luna' | 'user';
  timestamp: Date;
}

const LunaChat: React.FC<LunaChatProps> = ({ onClose, isMinimized, onToggleMinimize }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "I'm here. Help has been notified. Take a slow breath with me.",
      sender: 'luna',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized]);

  // Simulate Luna's responses
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        const responses = [
          "You are safe now. I'm right here.",
          "Just focus on your breathing. In... and out...",
          "I'm listening. You're doing great.",
          "Help is on the way. Stay grounded."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: randomResponse,
          sender: 'luna',
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }]);
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    }]);
  };

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-24 right-6 bg-indigo-900 text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-3 cursor-pointer animate-pulse border-2 border-indigo-400"
        onClick={onToggleMinimize}
      >
        <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
        <span className="font-medium">Luna is here</span>
        <Maximize2 size={16} />
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[60vh] bg-white shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.3)] rounded-t-3xl z-40 flex flex-col animate-in slide-in-from-bottom duration-500 border-t border-indigo-100">
      {/* Header */}
      <div className="bg-indigo-900 text-white p-4 rounded-t-3xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center border border-indigo-500">
            <Shield className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Luna Support</h3>
            <p className="text-xs text-indigo-300 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Live Connection
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleMinimize} 
            className="p-2 hover:bg-indigo-800 rounded-full transition-colors"
            title="Minimize"
          >
            <Minimize2 size={20} />
          </button>
          <button 
            onClick={onClose} 
            className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
          >
            I'm Safe Now
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-indigo-100 shadow-sm rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-indigo-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      <div className="px-4 py-2 bg-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
        {['I am safe', 'Call me', 'Stay with me'].map(chip => (
          <button
            key={chip}
            onClick={() => handleQuickReply(chip)}
            className="whitespace-nowrap px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default LunaChat;
