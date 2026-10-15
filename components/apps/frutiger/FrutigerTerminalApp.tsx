import React, { useState, useRef, useEffect } from 'react';
import { audio } from '../../../services/audioService';
import { Terminal, Copy, Check, Sparkles } from 'lucide-react';

interface FileNode {
  type: 'file' | 'dir';
  content?: string;
  size?: number;
  date?: string;
  children?: Record<string, FileNode>;
}

const DOS_FILE_SYSTEM: Record<string, FileNode> = {
  'root': {
    type: 'dir',
    children: {
      'Projects': {
        type: 'dir',
        date: '2024-08-15  14:30',
        children: {
          'ShigaChat.exe': {
            type: 'file',
            size: 19293798,
            date: '2024-08-12  11:15',
            content: 'PROJECT: ShigaChat.exe\nTYPE: Multilingual Regional Q&A Assistant\nSTACK: React 19, Python, FastAPI, ChatGPT, RAG, MySQL\nSTATUS: Active in Shiga Prefecture\nDESC: Dedicated support system for foreign residents.'
          },
          'YuzuOS_Portfolio.exe': {
            type: 'file',
            size: 8598322,
            date: '2024-09-01  09:20',
            content: 'PROJECT: YuzukiOS Web Operating System\nTYPE: Dual-Engine Interactive Web Portfolio\nSTACK: React 19, TypeScript, Tailwind CSS, Vite, Web Audio\nDESC: Faithful recreation of modern Windows and Frutiger Aero.'
          },
          'MultiAgent_Dialogue.doc': {
            type: 'file',
            size: 16777216,
            date: '2024-10-04  16:45',
            content: 'RESEARCH: LLM Multi-Agent Dialogue Protocols\nLAB: Social Intelligence Laboratory (SI Lab), Ritsumeikan University\nFOCUS: Cross-cultural collaborative decision-making and automated consensus.'
          }
        }
      },
      'About_Masuo.txt': {
        type: 'file',
        size: 1240,
        date: '2024-09-10  12:00',
        content: 'NAME: 増尾 柚希 (Yuzuki Masuo)\nDEGREE: Graduate Student (M1), Ritsumeikan University ISE\nLABORATORY: Social Intelligence Laboratory (SI Lab)\nEMAIL: is0690ke@ed.ritsumei.ac.jp\nGITHUB: https://github.com/Yuuzuukii\nSPECIALTY: Multi-Agent AI Systems, Full-Stack Development (React, FastAPI, Docker)'
      },
      'Skills_Matrix.ini': {
        type: 'file',
        size: 890,
        date: '2024-09-15  18:30',
        content: '[Languages]\nTypeScript=95%\nPython=92%\nJavaScript=95%\nSQL=80%\n\n[Frontend & Backend]\nReact_19=94%\nFastAPI=88%\nNext_js=88%\nDocker=85%\ngRPC=82%\nMySQL=80%'
      },
      'Certifications.txt': {
        type: 'file',
        size: 512,
        date: '2024-07-20  10:00',
        content: '1. Fundamental Information Technology Engineer (FE / 基本情報技術者試験)\n2. TOEIC IP: 895 points (Advanced Business Communication)'
      }
    }
  }
};

export const FrutigerTerminalApp: React.FC = () => {
  const [theme, setTheme] = useState<'cmd' | 'powershell' | 'matrix'>('cmd');
  const [history, setHistory] = useState<string[]>([
    "Microsoft Windows [Version 6.0.6002]",
    "(C) Copyright 1985-2006 Microsoft Corp. - YuzuOS Aero Command Processor (x86_64)",
    "",
    "Type 'HELP' or 'DIR' for a list of available commands.",
    ""
  ]);
  const [input, setInput] = useState("");
  const [currentDir, setCurrentDir] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getCurrentNode = (path: string[]): FileNode | null => {
    let node = DOS_FILE_SYSTEM['root'];
    for (const seg of path) {
      if (node.children && node.children[seg]) {
        node = node.children[seg];
      } else {
        return null;
      }
    }
    return node;
  };

  const getPromptPath = () => {
    return 'C:\\Users\\Yuzuki' + (currentDir.length > 0 ? '\\' + currentDir.join('\\') : '');
  };

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      setHistory(prev => [...prev, `${getPromptPath()}>`]);
      return;
    }

    audio.playClick();
    const [command, ...args] = trimmed.split(' ');
    const cmd = command.toLowerCase();
    const argStr = args.join(' ');

    const newLines = [`${getPromptPath()}> ${trimmed}`];

    switch (cmd) {
      case 'help':
      case '?':
        newLines.push(
          "For more information on a specific command, type HELP command-name",
          "",
          "CD             Displays the name of or changes the current directory.",
          "CLS            Clears the screen.",
          "DIR            Displays a list of files and subdirectories in a directory.",
          "ECHO           Displays messages or turns command-echoing on or off.",
          "HELP           Provides Help information for Windows commands.",
          "PING           Sends ICMP echo packets to test network connectivity.",
          "THEME          Changes terminal color scheme (cmd, powershell, matrix).",
          "TREE           Graphically displays the directory structure of a path.",
          "TYPE           Displays the contents of a text file.",
          "VER            Displays the Windows version.",
          "ABOUT          Displays Masuo Yuzuki profile information.",
          "PROJECTS       Summarizes portfolio projects.",
          "SKILLS         Lists core engineering proficiencies."
        );
        break;

      case 'cls':
      case 'clear':
        setHistory([]);
        return;

      case 'ver':
        newLines.push("Microsoft Windows [Version 6.0.6002] Service Pack 2 (YuzuOS Aero Edition)");
        break;

      case 'theme':
        if (args[0] === 'cmd' || args[0] === 'powershell' || args[0] === 'matrix') {
          setTheme(args[0]);
          newLines.push(`Terminal color scheme changed to '${args[0]}'.`);
        } else {
          newLines.push("Usage: THEME <cmd | powershell | matrix>");
        }
        break;

      case 'dir': {
        const node = getCurrentNode(currentDir);
        if (!node || node.type !== 'dir' || !node.children) {
          newLines.push("File not found or cannot read directory.");
          break;
        }

        newLines.push(
          ` Volume in drive C is YUZU_SYSTEM`,
          ` Volume Serial Number is 6002-AERO`,
          ` Directory of ${getPromptPath()}`,
          ""
        );

        let fileCount = 0;
        let dirCount = 0;
        let totalBytes = 0;

        newLines.push("2024-09-01  09:00    <DIR>          .");
        newLines.push("2024-09-01  09:00    <DIR>          ..");
        dirCount += 2;

        for (const [name, child] of Object.entries(node.children)) {
          const date = child.date || '2024-09-01  12:00';
          if (child.type === 'dir') {
            newLines.push(`${date}    <DIR>          ${name}`);
            dirCount++;
          } else {
            const sizeStr = (child.size || 0).toLocaleString().padStart(14, ' ');
            newLines.push(`${date}    ${sizeStr} ${name}`);
            fileCount++;
            totalBytes += child.size || 0;
          }
        }

        newLines.push(
          `               ${fileCount} File(s)    ${totalBytes.toLocaleString()} bytes`,
          `               ${dirCount} Dir(s)   124,582,912,000 bytes free`
        );
        break;
      }

      case 'cd': {
        if (!argStr || argStr === '.') {
          newLines.push(getPromptPath());
          break;
        }

        if (argStr === '..' || argStr === '../') {
          if (currentDir.length > 0) {
            setCurrentDir(prev => prev.slice(0, -1));
          }
          break;
        }

        if (argStr === '\\' || argStr === '/') {
          setCurrentDir([]);
          break;
        }

        const node = getCurrentNode(currentDir);
        if (node && node.children && node.children[argStr] && node.children[argStr].type === 'dir') {
          setCurrentDir(prev => [...prev, argStr]);
        } else {
          newLines.push(`The system cannot find the path specified: ${argStr}`);
        }
        break;
      }

      case 'type': {
        if (!argStr) {
          newLines.push("The syntax of the command is incorrect. Usage: TYPE <filename>");
          break;
        }
        const node = getCurrentNode(currentDir);
        if (node && node.children && node.children[argStr]) {
          const file = node.children[argStr];
          if (file.type === 'dir') {
            newLines.push(`Access is denied: ${argStr} is a directory.`);
          } else {
            newLines.push(file.content || '');
          }
        } else {
          newLines.push(`The system cannot find the file specified: ${argStr}`);
        }
        break;
      }

      case 'echo':
        newLines.push(argStr);
        break;

      case 'ping':
        newLines.push(
          `Pinging ritsumei.ac.jp [133.19.1.1] with 32 bytes of data:`,
          `Reply from 133.19.1.1: bytes=32 time=12ms TTL=54`,
          `Reply from 133.19.1.1: bytes=32 time=11ms TTL=54`,
          `Reply from 133.19.1.1: bytes=32 time=14ms TTL=54`,
          `Reply from 133.19.1.1: bytes=32 time=10ms TTL=54`,
          ``,
          `Ping statistics for 133.19.1.1:`,
          `    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`,
          `Approximate round trip times in milli-seconds:`,
          `    Minimum = 10ms, Maximum = 14ms, Average = 11ms`
        );
        break;

      case 'tree':
        newLines.push(
          `Folder PATH listing for volume YUZU_SYSTEM`,
          `Volume serial number is 6002-AERO`,
          `C:\\USERS\\YUZUKI`,
          `├── Projects`,
          `│   ├── ShigaChat.exe`,
          `│   ├── YuzuOS_Portfolio.exe`,
          `│   └── MultiAgent_Dialogue.doc`,
          `├── About_Masuo.txt`,
          `├── Skills_Matrix.ini`,
          `└── Certifications.txt`
        );
        break;

      case 'about':
        newLines.push(
          "===========================================================",
          " 増尾 柚希 (Yuzuki Masuo) - Graduate Student @ Ritsumeikan ISE",
          " Laboratory: Social Intelligence Laboratory (SI Lab)",
          " Research: Multi-Agent Dialogue Protocols using LLMs",
          " Stack: React 19, TypeScript, Python, FastAPI, Docker, gRPC",
          " GitHub: https://github.com/Yuuzuukii",
          "==========================================================="
        );
        break;

      case 'projects':
        newLines.push(
          "[1] ShigaChat.exe       - Multilingual Regional Q&A (FastAPI, React, RAG, MySQL)",
          "[2] YuzuOS_Portfolio    - Web Operating System (React 19, TypeScript, Tailwind)",
          "[3] MultiAgent_Protocol - Academic Multi-Agent LLM Research (Python, NLP)"
        );
        break;

      case 'skills':
        newLines.push(
          "Core Languages : TypeScript (95%), Python (92%), JavaScript (95%), SQL (80%)",
          "Frontend       : React 19, Next.js, Tailwind CSS, Responsive Web Architecture",
          "Backend & Cloud: FastAPI, REST, gRPC, Docker, MySQL, Prisma ORM, GCP"
        );
        break;

      default:
        newLines.push(`'${command}' is not recognized as an internal or external command,`, "operable program or batch file.");
        break;
    }

    setHistory(prev => [...prev, ...newLines]);
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'powershell':
        return {
          bg: '#012456',
          text: '#ffffff',
          prompt: '#ffffff',
          cursor: '#ffffff',
        };
      case 'matrix':
        return {
          bg: '#051307',
          text: '#4ade80',
          prompt: '#22c55e',
          cursor: '#22c55e',
        };
      default:
        return {
          bg: '#000000',
          text: '#e2e8f0',
          prompt: '#cbd5e1',
          cursor: '#ffffff',
        };
    }
  };

  const currentTheme = getThemeStyles();

  return (
    <div className="h-full w-full flex flex-col font-retro-cmd text-xs select-none overflow-hidden">
      {/* 2000s Terminal Menu Strip */}
      <div 
        className="h-6 px-2 flex items-center justify-between text-[11px] text-slate-800 border-b border-[#94a3b8] shrink-0 font-frutiger-ui"
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <span 
            onClick={() => handleCommand('help')}
            className="cursor-pointer hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded-xs transition-colors"
          >
            Commands
          </span>
          <span 
            onClick={() => handleCommand('dir')}
            className="cursor-pointer hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded-xs transition-colors"
          >
            Dir
          </span>
          <span 
            onClick={() => handleCommand('cls')}
            className="cursor-pointer hover:bg-blue-600 hover:text-white px-1.5 py-0.5 rounded-xs transition-colors"
          >
            Clear
          </span>
        </div>

        {/* Theme Palette Switcher */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-slate-500 font-semibold">Theme:</span>
          {(['cmd', 'powershell', 'matrix'] as const).map(t => (
            <button
              key={t}
              onClick={() => {
                audio.playClick();
                setTheme(t);
              }}
              className={`px-1.5 py-0.5 rounded-xs capitalize cursor-pointer border ${
                theme === t
                  ? 'bg-blue-600 text-white font-bold border-blue-800'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              {t === 'cmd' ? 'CMD' : t === 'powershell' ? 'PowerShell' : 'Matrix'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Terminal Window Viewport */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="flex-1 p-3 overflow-y-auto leading-relaxed relative cursor-text font-mono"
        style={{
          backgroundColor: currentTheme.bg,
          color: currentTheme.text,
        }}
      >
        {/* Subtle CRT Scanline overlay in matrix theme */}
        {theme === 'matrix' && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
            }}
          />
        )}

        {/* Console History Output */}
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap break-words min-h-[1.25rem]">
            {line}
          </div>
        ))}

        {/* Interactive Prompt Input Line */}
        <div className="flex items-center mt-1">
          <span className="font-bold mr-1.5 shrink-0" style={{ color: currentTheme.prompt }}>
            {getPromptPath()}&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(input);
                setInput('');
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-xs font-mono"
            style={{ color: currentTheme.text }}
            autoFocus
            spellCheck={false}
          />
        </div>

        <div ref={scrollRef} />
      </div>
    </div>
  );
};
