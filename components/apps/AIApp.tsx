import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { generateResponse } from '../../services/geminiService';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export const AIApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hi! I'm YuzuBot. Ask me anything about Masuo Yuzuki's portfolio, skills, or projects!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    // Prepare history for context
    const history = messages.map(m => `${m.sender === 'user' ? 'User' : 'Model'}: ${m.text}`);
    
    const response = await generateResponse(userMsg, history);
    
    setMessages(prev => [...prev, { sender: 'bot', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="p-3 bg-white border-b flex items-center gap-2">
        <div className="p-1.5 bg-indigo-100 rounded-lg">
            <Bot size={18} className="text-indigo-600" />
        </div>
        <div>
            <h3 className="font-semibold text-sm">YuzuBot AI</h3>
            <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
            </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-200' : 'bg-indigo-600'}`}>
                 {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} className="text-white" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-white text-slate-800 rounded-tr-none border' 
                  : 'bg-indigo-600 text-white rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
               <div className="flex gap-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                       <Bot size={14} className="text-white" />
                   </div>
                   <div className="p-3 bg-indigo-600 rounded-2xl rounded-tl-none text-white text-sm flex items-center gap-1">
                       <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
                   </div>
               </div>
           </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t flex gap-2">
        <input
          type="text"
          className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
