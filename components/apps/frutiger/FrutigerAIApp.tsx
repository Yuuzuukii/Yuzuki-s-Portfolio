import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bell, Smile, Paperclip, Phone, Video, User, 
  Heart, ThumbsUp, Coffee, HelpCircle, Check, Star, Sparkles
} from 'lucide-react';
import { generateResponse } from '../../../services/geminiService';
import { audio } from '../../../services/audioService';

interface Message {
  sender: 'user' | 'bot' | 'system';
  text: string;
  time: string;
}

/* 2000s Authentic MSN Messenger Vector Icons (No standard emojis!) */
const MsnIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-4 h-4 inline-block align-middle" }) => {
  switch (name) {
    case 'smile':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <circle cx="8" cy="8" r="7" fill="url(#msn-yellow-grad)" stroke="#d97706" strokeWidth="0.8" />
          <ellipse cx="5.5" cy="5.5" rx="1" ry="1.2" fill="#78350f" />
          <ellipse cx="10.5" cy="5.5" rx="1" ry="1.2" fill="#78350f" />
          <path d="M4.5 9.5 C6 12, 10 12, 11.5 9.5" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="6" cy="4" rx="3.5" ry="1.5" fill="#ffffff" fillOpacity="0.6" />
          <defs>
            <linearGradient id="msn-yellow-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'laugh':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <circle cx="8" cy="8" r="7" fill="url(#msn-yellow-grad)" stroke="#d97706" strokeWidth="0.8" />
          <ellipse cx="5.5" cy="5.5" rx="1.2" ry="1.4" fill="#78350f" />
          <ellipse cx="10.5" cy="5.5" rx="1.2" ry="1.4" fill="#78350f" />
          <path d="M4.5 8.5 Q8 14 11.5 8.5 Z" fill="#78350f" />
          <path d="M5.5 8.8 Q8 10 10.5 8.8" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case 'wink':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <circle cx="8" cy="8" r="7" fill="url(#msn-yellow-grad)" stroke="#d97706" strokeWidth="0.8" />
          <ellipse cx="5.5" cy="5.5" rx="1" ry="1.2" fill="#78350f" />
          <path d="M9.5 6 L12 6" stroke="#78350f" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M5 9.5 C6.5 12, 9.5 12, 11 9.5" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'tongue':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <circle cx="8" cy="8" r="7" fill="url(#msn-yellow-grad)" stroke="#d97706" strokeWidth="0.8" />
          <ellipse cx="5.5" cy="5.5" rx="1" ry="1.2" fill="#78350f" />
          <ellipse cx="10.5" cy="5.5" rx="1" ry="1.2" fill="#78350f" />
          <path d="M5 9 L11 9" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6.5 9 Q8 13.5 9.5 9 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.6" />
        </svg>
      );
    case 'surprised':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <circle cx="8" cy="8" r="7" fill="url(#msn-yellow-grad)" stroke="#d97706" strokeWidth="0.8" />
          <ellipse cx="5.5" cy="5" rx="1.2" ry="1.5" fill="#78350f" />
          <ellipse cx="10.5" cy="5" rx="1.2" ry="1.5" fill="#78350f" />
          <ellipse cx="8" cy="10.5" rx="2" ry="2.5" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
        </svg>
      );
    case 'thumbsup':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <path d="M3 7 H5 V14 H3 Z" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="0.8" />
          <path d="M5 9 Q7 9 7.5 7 Q8 5 9 5 Q9.5 5 9.5 6.5 L9 8.5 H13.5 Q14.5 8.5 14 10 L13 13.5 Q12.5 14 11 14 H5 Z" fill="url(#msn-blue-grad)" stroke="#1d4ed8" strokeWidth="0.8" />
          <defs>
            <linearGradient id="msn-blue-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <path d="M8 14 C1 9, 2 3, 5.5 3 C7 3, 8 4.5, 8 4.5 C8 4.5, 9 3, 10.5 3 C14 3, 15 9, 8 14 Z" fill="url(#msn-red-grad)" stroke="#991b1b" strokeWidth="0.8" />
          <ellipse cx="5.5" cy="4.5" rx="1.5" ry="0.8" fill="#ffffff" fillOpacity="0.6" />
          <defs>
            <linearGradient id="msn-red-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'cool':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <circle cx="8" cy="8" r="7" fill="url(#msn-yellow-grad)" stroke="#d97706" strokeWidth="0.8" />
          <path d="M3.5 5.5 H12.5 L11.5 8 H4.5 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="0.8" />
          <path d="M4 6.5 L12 6.5" stroke="#94a3b8" strokeWidth="0.5" />
          <path d="M5.5 11 Q8 12.5 10.5 11" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'coffee':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <path d="M3 6 H11 V11 Q11 13 8 13 Q5 13 5 11 H3 Z" fill="url(#msn-white-grad)" stroke="#64748b" strokeWidth="0.8" />
          <path d="M11 7 H13 Q14 7 14 8.5 Q14 10 11 10" stroke="#64748b" strokeWidth="1" fill="none" />
          <path d="M2 14 H14" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M5 4 Q6 2 6 1 M8 4 Q9 2 9 1" stroke="#cbd5e1" strokeWidth="0.8" strokeLinecap="round" />
          <defs>
            <linearGradient id="msn-white-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 16 16" className={className} fill="none">
          <polygon points="8,1 10,6 15,6 11,9.5 12.5,15 8,11.5 3.5,15 5,9.5 1,6 6,6" fill="url(#msn-yellow-grad)" stroke="#d97706" strokeWidth="0.8" />
        </svg>
      );
    default:
      return null;
  }
};

const EMOTICONS = [
  { code: ':-)', iconName: 'smile', label: 'Smile' },
  { code: ':-D', iconName: 'laugh', label: 'Laugh' },
  { code: ';-)', iconName: 'wink', label: 'Wink' },
  { code: ':-P', iconName: 'tongue', label: 'Tongue' },
  { code: ':-O', iconName: 'surprised', label: 'Surprised' },
  { code: '(Y)', iconName: 'thumbsup', label: 'Thumbs Up' },
  { code: '(L)', iconName: 'heart', label: 'Heart' },
  { code: '(H)', iconName: 'cool', label: 'Cool' },
  { code: '(C)', iconName: 'coffee', label: 'Coffee' },
  { code: '(S)', iconName: 'star', label: 'Star' },
];

export const FrutigerAIApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'system',
      text: "You are now connected to YuzuBot on Windows Live Messenger 8.5 (YuzuOS Edition).",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      sender: 'bot',
      text: "Hello! I am YuzuBot, Masuo Yuzuki's interactive assistant. Ask me anything about Yuzuki's research at Ritsumeikan SI Lab, full-stack tech stack, or projects. You can also try sending a Nudge (BUZZ)!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNudging, setIsNudging] = useState(false);
  const [showEmoticonPicker, setShowEmoticonPicker] = useState(false);
  const [myStatus, setMyStatus] = useState<'online' | 'busy' | 'away' | 'offline'>('online');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    audio.playClick();
    const userMsg = input;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInput("");
    setShowEmoticonPicker(false);
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: nowTime }]);
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.sender !== 'system')
        .map(m => `${m.sender === 'user' ? 'User' : 'Model'}: ${m.text}`);
      const response = await generateResponse(userMsg, history);

      audio.playBubble();
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setMessages(prev => [...prev, {
        sender: 'system',
        text: "Error: Could not reach the YuzuBot server. Please try again later.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNudge = () => {
    audio.playGlassPing();
    setIsNudging(true);
    setMessages(prev => [
      ...prev,
      {
        sender: 'system',
        text: "You just sent a Nudge!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setTimeout(() => {
      setIsNudging(false);
    }, 800);
  };

  const handleInsertEmoticon = (code: string) => {
    audio.playClick();
    setInput(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + code + ' ');
    setShowEmoticonPicker(false);
  };

  // Convert emoticons like :-) to 2000s skeuomorphic SVG components
  const renderFormattedText = (content: string) => {
    const parts = content.split(/(\s+)/);
    return parts.map((part, i) => {
      const match = EMOTICONS.find(e => e.code.toLowerCase() === part.trim().toLowerCase());
      if (match) {
        return <MsnIcon key={i} name={match.iconName} className="w-4.5 h-4.5 inline-block mx-0.5 align-text-bottom drop-shadow-xs" />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div 
      className={`h-full w-full bg-[#f1f5f9] flex flex-col font-frutiger-ui select-none overflow-hidden text-xs transition-transform ${
        isNudging ? 'translate-x-1 translate-y-1 scale-[1.01]' : ''
      }`}
    >
      {/* Authentic MSN Messenger 8.5 Header Contact Bar */}
      <div 
        className="px-3 py-2 border-b border-[#94a3b8] flex items-center justify-between shrink-0 shadow-xs relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 60%, #7dd3fc 100%)',
        }}
      >
        {/* Horizontal Gloss Highlight */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 50%, transparent 51%)',
          }}
        />

        {/* Contact Status Info */}
        <div className="flex items-center gap-3 relative z-10">
          {/* Classic MSN Buddies Multi-User Icon */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] p-0.5 border border-white shadow-md flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
              <circle cx="9" cy="8" r="3.5" fill="#ffffff" />
              <path d="M3 18 C3 14, 6 12, 9 12 C12 12, 15 14, 15 18 Z" fill="#ffffff" />
              <circle cx="16" cy="9" r="2.5" fill="#bae6fd" />
              <path d="M12 18 C12 15, 14 13.5, 17 13.5 C19.5 13.5, 21 15, 21 18 Z" fill="#bae6fd" />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-blue-950 text-xs">YuzuBot</span>
              <span className="text-[9px] text-emerald-800 font-bold bg-emerald-100/90 px-1 py-0.2 rounded-xs border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[10px] text-blue-900 truncate max-w-xs font-medium">
              "Researching Multi-Agent Protocols @ SI Lab & Building Web OS"
            </p>
            <p className="text-[9px] text-sky-800 font-mono">
              [yuzubot@msn.yuzuos.net]
            </p>
          </div>
        </div>

        {/* MSN Quick Action Buttons */}
        <div className="flex items-center gap-1 text-slate-700 relative z-10">
          <button 
            onClick={() => audio.playBubble()} 
            className="p-1.5 rounded-xs hover:bg-white/60 text-blue-800 cursor-pointer border border-transparent hover:border-sky-300" 
            title="Video Call"
          >
            <Video size={14} />
          </button>
          <button 
            onClick={() => audio.playBubble()} 
            className="p-1.5 rounded-xs hover:bg-white/60 text-blue-800 cursor-pointer border border-transparent hover:border-sky-300" 
            title="Voice Call"
          >
            <Phone size={14} />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Chat Transcript + Right Display Picture Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Transcript Area with Frutiger Aero Bubble Sky Texture */}
        <div 
          className="flex-1 p-3 overflow-y-auto space-y-3 relative text-xs"
          style={{
            background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 60%, #bae6fd 100%)',
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.85) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.65) 0%, transparent 40%)',
          }}
        >
          {messages.map((msg, index) => {
            if (msg.sender === 'system') {
              return (
                <div key={index} className="text-center my-1 text-[10px] font-semibold text-slate-600 bg-white/70 py-0.5 px-3 rounded-full border border-sky-200 w-fit mx-auto shadow-2xs">
                  {msg.text}
                </div>
              );
            }

            const isUser = msg.sender === 'user';

            return (
              <div key={index} className="space-y-0.5">
                {/* Classic MSN Header: "Name says (time):" */}
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-bold text-[11px] ${isUser ? 'text-emerald-800' : 'text-blue-800'}`}>
                    {isUser ? 'You say' : 'YuzuBot says'}:
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">({msg.time})</span>
                </div>

                {/* Message Body inside translucent Aero Glass speech panel */}
                <div 
                  className={`p-2.5 rounded-sm border shadow-xs max-w-xl text-[11px] leading-relaxed break-words ${
                    isUser
                      ? 'bg-emerald-50/95 border-emerald-300 text-slate-900 ml-2'
                      : 'bg-white/95 border-sky-300 text-slate-900'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-[10px] text-sky-800 font-semibold bg-white/80 px-2 py-1 rounded border border-sky-200 w-fit">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span>YuzuBot is typing a message...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Right MSN Display Picture (Avatar) Panel */}
        <div 
          className="w-36 border-l border-[#94a3b8] p-2 flex flex-col justify-between hidden md:flex shrink-0 select-none"
          style={{
            background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          }}
        >
          {/* Bot Display Picture in 3D Silver Frame */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-blue-900 text-center">YuzuBot (AI)</div>
            <div className="w-24 h-24 mx-auto p-1 bg-gradient-to-b from-white to-slate-200 border-2 border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] shadow-md flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 flex flex-col items-center justify-center text-white">
                <MsnIcon name="smile" className="w-10 h-10 drop-shadow-md" />
                <span className="text-[8px] font-bold tracking-widest uppercase mt-1">MSN AI</span>
              </div>
              <div 
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 60%)',
                }}
              />
            </div>
          </div>

          {/* User Display Picture in 3D Frame */}
          <div className="space-y-1">
            <div className="w-20 h-20 mx-auto p-1 bg-gradient-to-b from-white to-slate-200 border-2 border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] shadow-md flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-600 flex flex-col items-center justify-center text-white">
                <User size={24} />
                <span className="text-[7px] font-bold tracking-widest uppercase mt-1">GUEST</span>
              </div>
            </div>

            {/* My Status Selector without modern emojis */}
            <div className="pt-1">
              <select 
                value={myStatus} 
                onChange={(e: any) => {
                  audio.playClick();
                  setMyStatus(e.target.value);
                }}
                className="w-full text-[10px] bg-white border border-slate-300 p-0.5 rounded-xs font-semibold text-slate-700"
              >
                <option value="online">Online (Available)</option>
                <option value="busy">Busy (Do Not Disturb)</option>
                <option value="away">Away (Be Right Back)</option>
                <option value="offline">Appear Offline</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MSN Action Toolbar (Font, Emoticons, Winks, Nudge!) */}
      <div 
        className="px-2 py-1 border-t border-b border-[#94a3b8] flex items-center justify-between text-[11px] select-none shrink-0 relative"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        }}
      >
        <div className="flex items-center gap-1">
          {/* Emoticon Picker Toggle Button */}
          <button
            onClick={() => {
              audio.playClick();
              setShowEmoticonPicker(!showEmoticonPicker);
            }}
            className="p-1 rounded-xs hover:bg-white text-slate-700 hover:text-blue-900 border border-transparent hover:border-slate-300 flex items-center gap-1 cursor-pointer"
            title="Insert MSN Emoticon"
          >
            <MsnIcon name="smile" className="w-4 h-4" />
            <span className="text-[9px]">▼</span>
          </button>

          {/* Winks Button */}
          <button
            onClick={() => {
              audio.playBubble();
              setMessages(prev => [
                ...prev,
                { sender: 'user', text: "[Sent an MSN Wink animation]", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              ]);
            }}
            className="p-1 rounded-xs hover:bg-white text-slate-700 hover:text-blue-900 border border-transparent hover:border-slate-300 flex items-center gap-1 cursor-pointer"
            title="Send a Wink"
          >
            <MsnIcon name="wink" className="w-4 h-4" />
          </button>

          {/* Legendary MSN Nudge Button */}
          <button
            onClick={handleNudge}
            className="px-2 py-0.5 rounded-xs bg-gradient-to-b from-white to-[#cbd5e1] hover:from-white hover:to-[#e2e8f0] border border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] font-bold text-rose-700 flex items-center gap-1 active:translate-y-px cursor-pointer shadow-2xs"
            title="Send a Nudge! Shakes the window"
          >
            <Bell size={12} className={isNudging ? 'animate-bounce' : ''} />
            <span>Nudge!</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-500 font-mono">
          Enter to Send
        </span>

        {/* Authentic MSN Emoticon Popover Picker */}
        {showEmoticonPicker && (
          <div className="absolute bottom-9 left-2 bg-white border-2 border-t-white border-l-white border-r-[#64748b] border-b-[#64748b] shadow-2xl p-2 rounded-xs grid grid-cols-5 gap-2 z-50">
            {EMOTICONS.map((emo) => (
              <button
                key={emo.code}
                onClick={() => handleInsertEmoticon(emo.code)}
                className="w-8 h-8 flex flex-col items-center justify-center hover:bg-sky-100 rounded-xs cursor-pointer active:scale-95 border border-transparent hover:border-sky-300"
                title={`${emo.label} ${emo.code}`}
              >
                <MsnIcon name={emo.iconName} className="w-5 h-5" />
                <span className="text-[7px] text-slate-500 font-mono mt-0.5">{emo.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Message Area & 2000s Glossy Send Button */}
      <div className="p-2 bg-white flex items-center gap-2 border-t border-[#94a3b8] shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message to YuzuBot..."
          rows={2}
          className="flex-1 bg-white border border-t-[#64748b] border-l-[#64748b] border-r-white border-b-white rounded-xs p-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none shadow-inner"
        />

        {/* Glossy Royal Blue 2000s Aero Send Button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={`px-5 py-3 rounded-xs font-bold text-white shadow-md border-2 border-t-white border-l-white border-r-[#0369a1] border-b-[#0369a1] flex flex-col items-center justify-center transition-all cursor-pointer ${
            !input.trim() || isLoading
              ? 'opacity-50 cursor-not-allowed bg-slate-400'
              : 'active:translate-y-px hover:brightness-110'
          }`}
          style={{
            background: !input.trim() || isLoading
              ? '#94a3b8'
              : 'linear-gradient(180deg, #38bdf8 0%, #0284c7 45%, #0369a1 100%)',
          }}
        >
          <div className="flex items-center gap-1">
            <Send size={12} />
            <span>Send</span>
          </div>
        </button>
      </div>
    </div>
  );
};
