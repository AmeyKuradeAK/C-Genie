"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";

const CodeEditor = () => {
  const [code, setCode] = useState(`#include <stdio.h>\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}`);
  const [output, setOutput] = useState<string>("");

  const runCode = async () => {
    setOutput("Running...");

    try {
      const response = await fetch("/api/run-c", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.output);
      }
    } catch (err) {
      console.error("Error reaching the server:", err); // ✅ Fix: Log error properly
      setOutput("Error: Could not reach server.");
    }
  };

  return (
    <div className="w-full p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold">C Code Editor</h2>
      <CodeMirror
        value={code}
        height="300px"
        extensions={[cpp()]}
        theme="dark"
        onChange={(newCode) => setCode(newCode)}
      />
      <button className="mt-4 bg-blue-500 p-2 rounded" onClick={runCode}>
        Run Code
      </button>
      <div className="mt-4 p-2 bg-black text-green-400 min-h-[100px]">
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
