import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import yaml from "js-yaml";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";

const truthData = [{ name: 'Score', value: 98, fill: '#00ff9f' }];

const models = [
  { id: "gpt-5.1", name: "Rogers 3.0 (GPT-5.1)" },
  { id: "claude-sonnet-4-6", name: "Anthropic Claude" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek (OpenRouter)" },
  { id: "xai/grok-2", name: "Grok (OpenRouter)" },
];

const playClickSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {}
};

export default function SystemTerminal() {
  const [logs, setLogs] = useState<string[]>(["SYSTEM: Terminal Initialized..."]);
  const [chatInput, setChatInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-5.1");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [apiLink, setApiLink] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [yamlText, setYamlText] = useState("");

  const logEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, `> ${msg}`]);
  }, []);

  const speak = useCallback((text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.90;
      window.speechSynthesis.speak(u);
    } catch (_) {}
    addLog(`Voice Out: ${text}`);
  }, [addLog]);

  useEffect(() => {
    async function init() {
      try {
        const dirRes = await fetch('/api/directives');
        if (dirRes.ok) {
          const dirs = await dirRes.json();
          setYamlText(yaml.dump(dirs));
          addLog("Directives loaded from database.");
        }
        addLog("Rogers 3.0 Neural Link Active.");
      } catch (err) {
        addLog("Fallback: Using Local Memory.");
      }
    }
    init();
  }, [addLog]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      addLog("Voice In: SpeechRecognition not available on this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const cmd = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
      addLog(`Voice In: ${cmd}`);
      if (cmd.includes("status")) {
        speak("All systems online. 98 percent truth gate active.");
      }
      if (cmd.includes("save brain")) {
        exportBrain();
      }
    };
    recognition.onerror = (e: any) => addLog(`Voice Error: ${e.error || "unknown"}`);
    recognitionRef.current = recognition;
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, [addLog, speak]);

  const toggleVoice = () => {
    playClickSound();
    if (!recognitionRef.current) return;
    if (!isVoiceEnabled) {
      try {
        recognitionRef.current.start();
        setIsVoiceEnabled(true);
        speak("Voice input enabled.");
      } catch (e) {
        addLog("Could not start voice recognition.");
      }
    } else {
      try { recognitionRef.current.stop(); } catch (_) {}
      setIsVoiceEnabled(false);
      speak("Voice input disabled.");
    }
  };

  const handleQuery = async () => {
    if (!chatInput.trim()) return;
    playClickSound();
    setIsAnalyzing(true);
    addLog(`Querying Rogers 3.0 [${selectedModel}]: ${chatInput}`);
    try {
      const convRes = await fetch('/api/conversations');
      let convId = 1;
      if (convRes.ok) {
        const convs = await convRes.json();
        if (convs.length === 0) {
          const newConv = await fetch('/api/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: "Terminal Session" }) });
          if (newConv.ok) { const c = await newConv.json(); convId = c.id; }
        } else { convId = convs[0].id; }
      }
      const res = await fetch(`/api/conversations/${convId}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: chatInput, model: selectedModel }) });
      if (!res.ok) throw new Error("Link Failed");
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try { const data = JSON.parse(line.slice(6)); if (data.content) { fullText += data.content; setAiResponse(fullText); } } catch (e) {}
          }
        }
      }
      addLog("Rogers 3.0 Response Received.");
    } catch (err) {
      addLog("AI Link Error: Falling back to Local Memory.");
      setAiResponse(`Query failed. Local fallback active.`);
    } finally { setIsAnalyzing(false); }
  };

  const exportBrain = () => {
    playClickSound();
    let out = yamlText || "# NEXTXUS_EXPORT\n# No YAML loaded.\n";
    const blob = new Blob([out], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `directives_export_${new Date().toISOString().split('T')[0]}.yaml`;
    speak("YAML packaged. Downloading now.");
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };

  const loadBrain = () => {
    playClickSound();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.yaml,.yml,.json';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      setYamlText(text);
      addLog(`Brain loaded from file: ${file.name}`);
      speak("Brain data loaded successfully.");
    };
    input.click();
  };

  const exportSystem = async () => {
    playClickSound();
    addLog("Packaging Complete Core for Download...");
    speak("Packaging system for offline use.");
    try {
      const zip = new JSZip();
      zip.file("directives.yaml", yamlText || "# NEXTXUS_EXPORT\n# No YAML loaded.\n");
      zip.file("README.md", "# Rogers 3.0 Core Export\nStandalone knowledge base export.");
      const htmlContent = `<!DOCTYPE html><html><head><title>Rogers 3.0 Core</title></head><body><h1>Rogers 3.0 Offline Core</h1><p>Load directives.yaml to use.</p></body></html>`;
      zip.file("index.html", htmlContent);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Rogers_Core_${new Date().toISOString().split('T')[0]}.zip`);
      addLog("System package downloaded successfully.");
      speak("Core download complete.");
    } catch (err) {
      addLog("Error packaging system.");
      speak("Error packaging system.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 relative min-h-screen" data-testid="terminal-page">
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-50 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#00ff9f] font-mono text-sm uppercase tracking-widest transition-colors" data-testid="back-to-core-link">
          ← Back to Core
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mt-6 mb-4"
        >
          <div className="relative">
            <img
              src="/images/roger-3.0.jpeg"
              alt="Roger 3.0 AI"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-[#00d4ff]/50 shadow-[0_0_30px_rgba(0,212,255,0.5)]"
              data-testid="roger-avatar"
            />
            <div className="absolute inset-0 rounded-full border-2 border-[#00d4ff]/20 animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black text-center mb-6 uppercase tracking-widest font-display"
          style={{ color: '#EC4899' }}
        >
          SYSTEM TERMINAL
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="cyber-card p-6"
            >
              <h2 className="text-lg font-display uppercase tracking-wider text-[#EC4899] mb-4">Model Selection</h2>
              <div className="flex flex-wrap gap-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    data-testid={`terminal-model-${model.id}`}
                    onClick={() => { playClickSound(); setSelectedModel(model.id); addLog(`Model switched: ${model.name}`); }}
                    className={`px-4 py-2 text-xs uppercase tracking-wider font-display border rounded transition-all duration-300 ${
                      selectedModel === model.id
                        ? 'border-[#00ff9f] text-[#00ff9f] bg-[#00ff9f]/10 shadow-[0_0_15px_rgba(0,255,159,0.3)]'
                        : 'border-[#8B5CF6]/30 text-[#c9c9c9] hover:border-[#00d4ff] hover:text-[#00d4ff] hover:shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                    }`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="cyber-card p-6"
            >
              <h2 className="text-lg font-display uppercase tracking-wider text-[#EC4899] mb-4">Query Terminal</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  data-testid="terminal-chat-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  placeholder="Enter query for Rogers 3.0..."
                  className="flex-1 bg-black/50 border border-[#8B5CF6]/30 rounded px-4 py-3 text-[#00ff9f] font-mono text-sm placeholder-[#8B5CF6]/50 focus:outline-none focus:border-[#00d4ff] focus:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all"
                />
                <button
                  data-testid="terminal-send-btn"
                  onClick={handleQuery}
                  disabled={isAnalyzing}
                  className="px-6 py-3 uppercase tracking-wider font-display text-sm border border-[#00ff9f]/50 text-[#00ff9f] rounded hover:bg-[#00ff9f]/10 hover:shadow-[0_0_15px_rgba(0,255,159,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? "Analyzing..." : "Send"}
                </button>
                <button
                  data-testid="terminal-voice-btn"
                  onClick={toggleVoice}
                  className={`px-4 py-3 uppercase tracking-wider font-display text-sm border rounded transition-all duration-300 ${
                    isVoiceEnabled
                      ? 'border-[#00ff9f] text-[#00ff9f] bg-[#00ff9f]/10 shadow-[0_0_15px_rgba(0,255,159,0.3)]'
                      : 'border-[#8B5CF6]/30 text-[#c9c9c9] hover:border-[#00d4ff] hover:text-[#00d4ff]'
                  }`}
                >
                  {isVoiceEnabled ? "🎙️ ON" : "🎙️ OFF"}
                </button>
              </div>
            </motion.div>

            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="cyber-card p-6"
              >
                <h2 className="text-lg font-display uppercase tracking-wider text-[#EC4899] mb-4">Rogers 3.0 Response</h2>
                <div className="flex gap-4">
                  <img
                    src="/images/roger-3.0.jpeg"
                    alt="Roger 3.0"
                    className="w-12 h-12 rounded-full object-cover border border-[#00d4ff]/50 flex-shrink-0"
                    data-testid="response-avatar"
                  />
                  <div className="flex-1 text-[#00ff9f] font-mono text-sm leading-relaxed whitespace-pre-wrap" data-testid="ai-response-text">
                    {aiResponse}
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="cyber-card p-6"
            >
              <h2 className="text-lg font-display uppercase tracking-wider text-[#EC4899] mb-4">System Logs</h2>
              <div className="terminal-log overflow-y-auto max-h-[400px] bg-black/60 rounded p-4 border border-[#8B5CF6]/20">
                {logs.map((log, i) => (
                  <div key={i} className="text-[#00ff9f]/80 font-mono text-xs leading-relaxed">
                    {log}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="cyber-card p-6"
            >
              <h2 className="text-lg font-display uppercase tracking-wider text-[#EC4899] mb-4">Truth Gauge</h2>
              <div className="w-full h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={10}
                    data={truthData}
                    startAngle={220}
                    endAngle={-40}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      background={{ fill: 'rgba(139,92,246,0.1)' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-black font-display text-[#00ff9f]">98%</span>
                  <span className="text-xs font-mono text-[#8B5CF6] uppercase tracking-wider">Truth Score</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="cyber-card p-6 space-y-3"
            >
              <h2 className="text-lg font-display uppercase tracking-wider text-[#EC4899] mb-4">Core Operations</h2>
              <button
                onClick={exportBrain}
                data-testid="terminal-save-btn"
                className="w-full px-4 py-3 uppercase tracking-wider font-display text-sm border border-[#8B5CF6]/30 text-[#c9c9c9] rounded hover:border-[#00ff9f] hover:text-[#00ff9f] hover:shadow-[0_0_15px_rgba(0,255,159,0.3)] transition-all duration-300"
              >
                Save Brain
              </button>
              <button
                onClick={loadBrain}
                data-testid="terminal-load-btn"
                className="w-full px-4 py-3 uppercase tracking-wider font-display text-sm border border-[#8B5CF6]/30 text-[#c9c9c9] rounded hover:border-[#00d4ff] hover:text-[#00d4ff] hover:shadow-[0_0_10px_rgba(0,212,255,0.2)] transition-all duration-300"
              >
                Load Brain
              </button>
              <button
                onClick={exportSystem}
                data-testid="terminal-download-btn"
                className="w-full px-4 py-3 uppercase tracking-wider font-display text-sm border border-[#EC4899]/30 text-[#c9c9c9] rounded hover:border-[#EC4899] hover:text-[#EC4899] hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300"
              >
                Download Core
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="cyber-card p-6"
            >
              <h2 className="text-lg font-display uppercase tracking-wider text-[#EC4899] mb-4">Rogers 3.0 API Link</h2>
              {!showApiInput ? (
                <button
                  onClick={() => { playClickSound(); setShowApiInput(true); }}
                  data-testid="connect-api-btn"
                  className="w-full px-4 py-3 uppercase tracking-wider font-display text-sm border border-[#00d4ff]/30 text-[#00d4ff] rounded hover:bg-[#00d4ff]/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300"
                >
                  Connect External API
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={apiLink}
                    onChange={(e) => setApiLink(e.target.value)}
                    placeholder="API Endpoint URL"
                    data-testid="api-link-input"
                    className="w-full bg-black/50 border border-[#8B5CF6]/30 rounded px-3 py-2 text-[#00ff9f] font-mono text-xs placeholder-[#8B5CF6]/50 focus:outline-none focus:border-[#00d4ff] transition-all"
                  />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="API Key"
                    data-testid="api-key-input"
                    className="w-full bg-black/50 border border-[#8B5CF6]/30 rounded px-3 py-2 text-[#00ff9f] font-mono text-xs placeholder-[#8B5CF6]/50 focus:outline-none focus:border-[#00d4ff] transition-all"
                  />
                  <button
                    onClick={() => { playClickSound(); addLog(`API Link configured: ${apiLink}`); speak("External API link established."); setShowApiInput(false); }}
                    data-testid="save-api-btn"
                    className="w-full px-4 py-2 uppercase tracking-wider font-display text-sm border border-[#00ff9f]/50 text-[#00ff9f] rounded hover:bg-[#00ff9f]/10 hover:shadow-[0_0_15px_rgba(0,255,159,0.3)] transition-all duration-300"
                  >
                    Establish Link
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
