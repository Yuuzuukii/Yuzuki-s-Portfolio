import React, { useState, useRef, useEffect } from 'react';

// --- Virtual File System Type Definitions ---
type FileSystemNode = {
  type: 'file' | 'dir';
  content?: string; // for files
  children?: Record<string, FileSystemNode>; // for dirs
};

// Construct the virtual file system
const FILE_SYSTEM: Record<string, FileSystemNode> = {
  '~': {
    type: 'dir',
    children: {
      'projects': {
        type: 'dir',
        children: {
          'yuzu_os.txt': { type: 'file', content: 'PROJECT: YuzuOS\nSTATUS: Active\nSTACK: React, TypeScript, Tailwind\nDESC: A web-based operating system portfolio.' },
          'eco_tracker.md': { type: 'file', content: '# EcoTracker Mobile\nA cross-platform app for sustainable living.' },
          'dataviz_dashboard': { type: 'dir', children: {
              'readme.txt': { type: 'file', content: 'Data Visualization Dashboard using D3.js.' },
              'data.csv': { type: 'file', content: 'id,value\n1,100\n2,200' }
          }}
        }
      },
      'about.txt': { type: 'file', content: 'Name: Masuo Yuzuki\nRole: Frontend Engineer / Student\nUniversity: Information Systems (4th Year)\nLocation: Tokyo, Japan' },
      'skills.json': { type: 'file', content: '{\n  "frontend": ["React", "TypeScript", "Next.js"],\n  "backend": ["Node.js", "Python"],\n  "tools": ["Docker", "AWS", "Figma"]\n}' },
      'contact.info': { type: 'file', content: 'Email: yuzuki.dev@example.com\nGitHub: github.com/yuzuki\nLinkedIn: linkedin.com/in/yuzuki' },
      'hidden': {
          type: 'dir',
          children: {
              'secret.txt': { type: 'file', content: 'You found the secret file! The password for the admin panel is "admin123" (just kidding).' }
          }
      }
    }
  }
};

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    "Welcome to YuzuOS v1.0.0 (Ubuntu-based)",
    "Copyright (c) 2024 Masuo Yuzuki",
    "",
    "Type 'help' to see available commands.",
    "",
  ]);
  const [input, setInput] = useState("");
  // currentPath is a stack of directory names, starting with '~'
  const [currentPath, setCurrentPath] = useState<string[]>(['~']); 
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus input when clicking anywhere in terminal
  const handleContainerClick = () => {
      // Prevent focus stealing if user is selecting text
      const selection = window.getSelection();
      if (!selection || selection.toString().length === 0) {
          inputRef.current?.focus();
      }
  };

  // --- File System Logic ---
  
  // Helper: Get the node at a specific path stack
  const getNodeAt = (pathStack: string[]): FileSystemNode | null => {
    let current = FILE_SYSTEM['~'];
    // pathStack[0] is always '~', so iterate from 1
    for (let i = 1; i < pathStack.length; i++) {
      const dirName = pathStack[i];
      if (current.children && current.children[dirName]) {
        current = current.children[dirName];
      } else {
        return null;
      }
    }
    return current;
  };

  // Helper: Resolve a path string (e.g., "../projects", "about.txt", "/home") to a path stack
  const resolvePath = (targetPath: string): string[] | null => {
    const parts = targetPath.split('/').filter(p => p);
    let tempPath: string[] = [];

    // Handle absolute path (though we fake root as ~ for simplicity in this shell)
    if (targetPath.startsWith('/')) {
        // Treat '/' as root, but our root is '~'
        tempPath = ['~']; 
    } else {
        tempPath = [...currentPath];
    }

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        if (tempPath.length > 1) tempPath.pop();
      } else if (part === '~') {
        tempPath = ['~'];
      } else {
        // Verify if 'part' exists in current tempPath
        const currentNode = getNodeAt(tempPath);
        if (currentNode && currentNode.type === 'dir' && currentNode.children && currentNode.children[part]) {
          tempPath.push(part);
        } else {
            // Check if it is the last part and maybe a file? 
            // Actually for 'cd' it must be a dir. For 'cat' it handles file check separately.
            // This helper is mainly for navigation.
            return null;
        }
      }
    }
    return tempPath;
  };

  // --- Command Handlers ---
  const handleCommand = (cmdRaw: string) => {
    const trimmed = cmdRaw.trim();
    if (!trimmed) {
        setHistory(prev => [...prev, `guest@yuzu-os:${currentPath.join('/')}$`]);
        return;
    }

    const [cmd, ...args] = trimmed.split(/\s+/);
    const arg = args.join(' '); // Simple single argument support for now
    const prompt = `guest@yuzu-os:${currentPath.join('/')}$ ${cmdRaw}`;
    let output = "";

    switch (cmd.toLowerCase()) {
      case "help":
        output = [
            "GNU bash, version 5.1.16(1)-release (x86_64-pc-linux-gnu)",
            "These shell commands are defined internally.  Type 'help' to see this list.",
            "",
            "Available commands:",
            "  ls [dir]    List directory contents",
            "  cd [dir]    Change directory",
            "  cat [file]  Display file content",
            "  pwd         Print working directory",
            "  clear       Clear terminal screen",
            "  whoami      Show current user",
            "  date        Show system date/time",
            "  open [app]  Open an application (e.g., 'open about')"
        ].join('\n');
        break;
      
      case "ls":
        // Determine which node to list
        let targetNodeForLs = getNodeAt(currentPath);
        // If arg provided, try to resolve it (not fully implemented for ls arg, assuming current dir for simplicity or simple child)
        if (arg) {
            const path = resolvePath(arg);
            if(path) targetNodeForLs = getNodeAt(path);
            else {
                output = `ls: cannot access '${arg}': No such file or directory`;
                break;
            }
        }

        if (targetNodeForLs && targetNodeForLs.type === 'dir' && targetNodeForLs.children) {
            const items = Object.keys(targetNodeForLs.children).map(key => {
                const item = targetNodeForLs!.children![key];
                const isDir = item.type === 'dir';
                return isDir 
                    ? `<span class="text-blue-400 font-bold">${key}/</span>` 
                    : `<span class="text-white">${key}</span>`;
            });
            output = items.join('  ');
        }
        break;

      case "cd":
        if (!arg || arg === "~") {
            setCurrentPath(['~']);
        } else {
            const newPath = resolvePath(arg);
            if (newPath) {
                // Verify it's a directory
                const node = getNodeAt(newPath);
                if (node && node.type === 'dir') {
                    setCurrentPath(newPath);
                } else {
                    output = `cd: ${arg}: Not a directory`;
                }
            } else {
                output = `cd: ${arg}: No such file or directory`;
            }
        }
        break;

      case "cat":
        if (!arg) {
            output = "cat: missing file operand";
        } else {
            // Handle simple relative path for file
            const currentNode = getNodeAt(currentPath);
            if (currentNode && currentNode.children && currentNode.children[arg]) {
                const target = currentNode.children[arg];
                if (target.type === 'file') {
                    output = target.content || "";
                } else {
                    output = `cat: ${arg}: Is a directory`;
                }
            } else {
                 output = `cat: ${arg}: No such file or directory`;
            }
        }
        break;
      
      case "pwd":
        output = "/" + currentPath.slice(1).join("/");
        if (output === "/") output = "/home/guest"; 
        else output = "/home/guest" + output;
        break;

      case "whoami":
        output = "guest";
        break;

      case "date":
        output = new Date().toString();
        break;

      case "clear":
        setHistory([]);
        return;

      case "sudo":
        output = "[sudo] password for guest: \nSorry, try again.";
        break;
        
      case "rm":
        output = "rm: cannot remove '" + (arg || "file") + "': Permission denied";
        break;
        
      case "open":
        output = `Opening ${arg}... (Simulated: Use UI to open apps)`;
        break;

      default:
        if (cmd === "exit") {
            output = "logout";
            // Logic to close window could go here if connected to parent
        } else {
            output = `Command not found: ${cmd}`;
        }
    }

    setHistory(prev => [...prev, prompt, output].filter(Boolean));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput("");
    }
    if (e.key === 'c' && e.ctrlKey) {
        setHistory(prev => [...prev, `guest@yuzu-os:${currentPath.join('/')}$ ^C`]);
        setInput("");
    }
  };

  return (
    <div 
        className="h-full w-full bg-black/95 text-green-400 font-mono p-4 text-sm overflow-y-auto cursor-text" 
        onClick={handleContainerClick}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-1 leading-relaxed break-words" dangerouslySetInnerHTML={{__html: line.startsWith('guest@') ? line : line.replace(/\n/g, '<br/>')}} />
      ))}
      <div className="flex items-center">
        <span className="mr-2 text-blue-400 whitespace-nowrap">guest@yuzu-os:{currentPath.join('/')}$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="bg-transparent border-none outline-none flex-1 text-green-400 w-full"
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};