import React, { useState, useRef, useEffect } from "react";
import { TERMINAL_COMMANDS } from "../constants";

export default function TerminalApp() {
  const [commandHistory, setCommandHistory] = useState([
    {
      cmd: "Welcome to The Linux School Terminal!",
      isInput: false,
      output: "Type 'help' for available commands",
    },
    { cmd: "student@linuxschool:~$", isInput: false, output: "" },
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const terminalRef = useRef(null);

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output = "";

    if (trimmedCmd === "clear") {
      setCommandHistory([{ cmd: "student@linuxschool:~$", isInput: false, output: "" }]);
      return;
    }

    if (TERMINAL_COMMANDS[trimmedCmd]) {
      output = TERMINAL_COMMANDS[trimmedCmd];
    } else if (trimmedCmd) {
      output = `Command not found: ${cmd}. Type 'help' for available commands.`;
    }

    setCommandHistory((prev) => [
      ...prev,
      { cmd: `$ ${cmd}`, isInput: true, output: "" },
      ...(output ? [{ cmd: output, isInput: false, output: "" }] : []),
      { cmd: "student@linuxschool:~$", isInput: false, output: "" },
    ]);

    setCurrentCommand("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-green-400 font-mono rounded-lg">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-gray-400">bash — student@linuxschool</div>
        <div className="text-xs text-gray-500">80×24</div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 p-4 overflow-auto text-sm">
        {commandHistory.map((item, index) => (
          <div key={index} className="mb-1">
            <div className={item.isInput ? "text-cyan-300" : "text-green-400"}>
              {item.cmd}
            </div>
            {item.output && <div className="text-gray-300 ml-4">{item.output}</div>}
          </div>
        ))}

        {/* Input */}
        <div className="flex items-center mt-2">
          <span className="text-green-400">student@linuxschool:~$</span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 ml-2 bg-transparent border-none outline-none text-white"
            placeholder="Type command and press Enter..."
            autoFocus
          />
        </div>

        {/* Quick Commands */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="text-gray-400 text-xs mb-2">Try these commands:</div>
          <div className="flex flex-wrap gap-2">
            {["help", "ls", "pwd", "whoami", "date", "clear"].map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-green-300"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Bash 5.1.16</span>
          <span>UTF-8</span>
          <span>Press Enter to execute commands</span>
        </div>
      </div>
    </div>
  );
}