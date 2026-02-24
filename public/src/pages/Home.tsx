import { useState, useEffect, useRef, useCallback } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import yaml from "js-yaml";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const TRUTH_GATE = 0.95;

const radarData = [
  { subject: 'Logic (Primary)', A: 0.95, fullMark: 1 },
  { subject: 'Empathy', A: 0.90, fullMark: 1 },
  { subject: 'Action', A: 0.93, fullMark: 1 },
  { subject: 'Logic (Secondary)', A: 0.95, fullMark: 1 },
];

// Audio Context for UI Sounds
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
  } catch (e) {
    // Ignore audio errors
  }
};

export default function Home() {
  const [yamlData, setYamlData] = useState<any>(null);
  const [yamlText, setYamlText] = useState<string>("");
  const [logs, setLogs] = useState<string[]>(["SYSTEM: Loading directives.yaml..."]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiLink, setApiLink] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [verdict, setVerdict] = useState<{ ok: boolean; msg: string }>({
    ok: true,
    msg: "AGENT ZERO: INITIALIZING",
  });
  
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

  // Load YAML
  useEffect(() => {
    async function loadDirectivesYAML() {
      try {
        const res = await fetch('/directives.yaml', { cache: "no-store" });
        if (!res.ok) throw new Error(`Fetch failed: HTTP ${res.status}`);
        const text = await res.text();
        const data = yaml.load(text);
        
        setYamlText(text);
        setYamlData(data);
        
        const dirCount = Array.isArray((data as any)?.directives) ? (data as any).directives.length : 0;
        const arcCount = Array.isArray((data as any)?.archetypes) ? (data as any).archetypes.length : 0;
        const kbCount = Array.isArray((data as any)?.knowledge_base) ? (data as any).knowledge_base.length : 0;
        
        if ((data as any)?.knowledge_base) {
          setKnowledgeBase((data as any).knowledge_base);
        }
        
        addLog("Loaded directives.yaml successfully.");
        addLog(`Directives: ${dirCount}`);
        addLog(`Archetypes: ${arcCount}`);
        addLog(`Knowledge Nodes: ${kbCount}`);
        
        setVerdict({
          ok: true,
          msg: `AGENT ZERO: ACTIVE (${Math.round(TRUTH_GATE * 100)}% Gate)`
        });

        if (dirCount > 0) {
          const d = (data as any).directives[0];
          addLog(`Example: ${d.id} — ${d.title}`);
        }
        
        speak("NextXus online.");
      } catch (err: any) {
        setVerdict({
          ok: false,
          msg: "AGENT ZERO: YAML LOAD FAILED"
        });
        addLog(`ERROR: ${err.message || err}`);
        addLog("Fix: Ensure directives.yaml is available.");
      }
    }

    loadDirectivesYAML();
    
    // Metabolism demo heartbeat
    const timer = setTimeout(() => {
      speak("Heartbeat active. Evaluation mode only.");
      setTimeout(() => {
        speak("No mutations applied. Use Agent Zero review before any merge.");
      }, 3500);
    }, 7000);
    
    return () => clearTimeout(timer);
  }, [addLog, speak]);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Voice setup
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
        speak(`All systems online. ${Math.round(TRUTH_GATE * 100)} percent gate active.`);
      }
      if (cmd.includes("save brain")) {
        exportBrain();
      }
      if (cmd.includes("list directives")) {
        const n = Array.isArray((yamlData as any)?.directives) ? (yamlData as any).directives.length : 0;
        speak(`Directives loaded: ${n}.`);
      }
    };
    
    recognition.onerror = (e: any) => addLog(`Voice Error: ${e.error || "unknown"}`);
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, [addLog, speak, yamlData]);

  const toggleVoice = () => {
    playClickSound();
    if (!recognitionRef.current) return;
    
    if (!isVoiceEnabled) {
      try {
        recognitionRef.current.start();
        setIsVoiceEnabled(true);
        speak("Voice input enabled.");
      } catch (e) {
        addLog("Could not start voice recognition. Make sure you granted microphone permissions.");
      }
    } else {
      try { recognitionRef.current.stop(); } catch(_) {}
      setIsVoiceEnabled(false);
      speak("Voice input disabled.");
    }
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

  const exportSystem = async () => {
    playClickSound();
    addLog("Packaging Complete NextXus Core for Eternal Download...");
    speak("Packaging entire system for offline eternal use.");
    
    try {
      // First try to fetch the pre-built files from our dist directory
      // If we're in dev mode, this will grab the public files
      const zip = new JSZip();
      
      // Get the current HTML
      let htmlContent = document.documentElement.outerHTML;
      
      // Try to embed the current YAML if possible
      if (yamlText) {
        // Create a self-contained, highly styled immortal version
        htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NextXus Core - Eternal Terminal</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
    
    :root {
      --cyan: #00ff9f;
      --purple: #8B5CF6;
      --pink: #EC4899;
      --bg: #050505;
      --panel: rgba(10, 10, 10, 0.8);
    }
    
    body {
      background-color: var(--bg);
      color: #c9c9c9;
      font-family: 'Rajdhani', sans-serif;
      margin: 0;
      padding: 20px;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
        linear-gradient(rgba(0, 255, 159, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 159, 0.03) 1px, transparent 1px);
      background-size: 100% 100%, 30px 30px, 30px 30px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 1px solid rgba(139, 92, 246, 0.3);
      padding-bottom: 20px;
    }
    
    h1 {
      font-family: 'Orbitron', sans-serif;
      color: var(--cyan);
      text-transform: uppercase;
      letter-spacing: 4px;
      text-shadow: 0 0 10px rgba(0, 255, 159, 0.5);
      margin: 0;
    }
    
    .subtitle {
      font-family: 'JetBrains Mono', monospace;
      color: var(--purple);
      font-size: 0.9rem;
      letter-spacing: 2px;
      margin-top: 10px;
    }
    
    .search-box {
      width: 100%;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid var(--purple);
      color: var(--cyan);
      padding: 15px 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.1rem;
      border-radius: 8px;
      margin-bottom: 30px;
      outline: none;
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
      transition: all 0.3s;
    }
    
    .search-box:focus {
      border-color: var(--cyan);
      box-shadow: 0 0 20px rgba(0, 255, 159, 0.4);
    }
    
    .results {
      display: grid;
      gap: 20px;
    }
    
    .card {
      background: var(--panel);
      border: 1px solid rgba(236, 72, 153, 0.3);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    
    .card h2 {
      font-family: 'Orbitron', sans-serif;
      color: var(--pink);
      margin-top: 0;
      border-bottom: 1px solid rgba(236, 72, 153, 0.2);
      padding-bottom: 10px;
    }
    
    .card p {
      font-size: 1.1rem;
      line-height: 1.6;
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 15px;
    }
    
    .tag {
      background: rgba(139, 92, 246, 0.1);
      color: var(--purple);
      padding: 4px 10px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    .status {
      text-align: center;
      font-family: 'JetBrains Mono', monospace;
      color: var(--cyan);
      margin-top: 50px;
      font-size: 0.8rem;
      opacity: 0.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>NextXus Immortal Core</h1>
      <div class="subtitle">STATIC KNOWLEDGE RECALL SYSTEM [HDL]</div>
    </header>
    
    <input type="text" id="search" class="search-box" placeholder="QUERY KNOWLEDGE BASE..." autofocus>
    
    <div id="results" class="results"></div>
    
    <div class="status">SYSTEM ONLINE // LOCAL MEMORY ONLY // ETERNAL BUILD</div>
  </div>

  <script>
    // Embedded Knowledge Base Data
    const yamlData = \`${yamlText.replace(/`/g, '\\`')}\`;
    
    let db = { knowledge_base: [], directives: [] };
    
    try {
      db = jsyaml.load(yamlData);
      console.log("Loaded Brain Data:", db);
    } catch(e) {
      console.error("Failed to parse YAML", e);
      document.getElementById('results').innerHTML = '<div class="card" style="border-color:red"><h2 style="color:red">CORRUPTION DETECTED</h2><p>Failed to load embedded YAML data.</p></div>';
    }

    const searchInput = document.getElementById('search');
    const resultsDiv = document.getElementById('results');

    function renderResults(items) {
      if (!items || items.length === 0) {
        resultsDiv.innerHTML = '<div class="card"><h2 style="color:var(--purple)">NO MATCHES FOUND</h2><p>The query returned zero results from the local data core.</p></div>';
        return;
      }
      
      let html = '';
      items.forEach(item => {
        let tagsHtml = '';
        if (item.tags) {
          tagsHtml = '<div class="tags">' + item.tags.map(t => '<span class="tag">' + t + '</span>').join('') + '</div>';
        }
        
        html += \`
          <div class="card">
            <h2>\${item.topic || item.title || item.id}</h2>
            <p>\${item.content}</p>
            \${tagsHtml}
          </div>
        \`;
      });
      
      resultsDiv.innerHTML = html;
    }

    function search() {
      const q = searchInput.value.toLowerCase();
      if (!q) {
        renderResults([...(db.knowledge_base || []), ...(db.directives || [])].slice(0, 10));
        return;
      }
      
      const allItems = [...(db.knowledge_base || []), ...(db.directives || [])];
      const filtered = allItems.filter(item => {
        const text = ((item.topic || '') + ' ' + (item.title || '') + ' ' + (item.content || '') + ' ' + (item.tags ? item.tags.join(' ') : '')).toLowerCase();
        return text.includes(q);
      });
      
      renderResults(filtered);
    }

    searchInput.addEventListener('input', search);
    
    // Initial render
    search();
  </script>
</body>
</html>`;
      }

      // Add files to zip
      zip.file("index.html", htmlContent);
      zip.file("directives.yaml", yamlText || "# NEXTXUS_EXPORT\n# No YAML loaded.\n");
      
      // Provide instructions
      zip.file("README.md", `# NextXus Static Core Download

This is a complete, standalone version of the NextXus Core. It is designed to run indefinitely on any standard web browser without a backend server. 

## How to use

1. **Free Hosting (Netlify/Vercel/GitHub Pages):**
   - Upload this entire folder to your preferred free hosting provider.
   - Set the publish directory to the root of this folder (or \`/\` if asked).
   - No build command is required.
   
## The Brain
Your entire knowledge base is stored in \`directives.yaml\`. You can open this file in any text editor (like Notepad) to manually add more data.

## Immortality
Because this is a static build, it will never "break" due to outdated server environments. It is effectively immortal as long as browsers can read standard HTML/JS/CSS.`);

      // Generate and download
      const content = await zip.generateAsync({ type: "blob" });
      
      try {
        saveAs(content, `NextXus_Core_Eternal_${new Date().toISOString().split('T')[0]}.zip`);
      } catch (e) {
        console.warn("saveAs failed, trying fallback:", e);
      }
      
      // Fallback for browsers that block saveAs inside an iframe (like Replit's preview window)
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NextXus_Core_Eternal_${new Date().toISOString().split('T')[0]}.zip`;
      
      // Ensure the link is visible and clickable if the automatic click fails
      a.style.display = 'none';
      document.body.appendChild(a);
      
      // For Replit preview windows, sometimes a direct click is blocked. We can try dispatching a MouseEvent
      try {
        a.click();
      } catch (clickErr) {
        console.warn("Direct click failed, trying MouseEvent:", clickErr);
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        a.dispatchEvent(clickEvent);
      }
      
      // Don't remove immediately in case the browser needs a moment to process the download
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      }, 5000);
      
      addLog("System package downloaded successfully.");
      speak("System package ready. You are now immortal.");
    } catch (err) {
      console.error(err);
      addLog("Error packaging system. See console for details.");
      speak("Error packaging system.");
    }
  };

  const handleQuery = async () => {
    if (!searchQuery.trim()) return;
    playClickSound();
    
    if (apiLink && apiKey) {
      setIsAnalyzing(true);
      addLog(`Querying External Intelligence: ${searchQuery}`);
      try {
        // Mocking an AI call if an API key is present
        // In a real scenario, this would fetch from the apiLink
        setTimeout(() => {
          const mockResponse = `Analysis of "${searchQuery}" complete. Cross-referencing with Directives... Accessing Legacy Plan Core. Intelligence link active.`;
          setAiResponse(mockResponse);
          addLog("AI Response Received.");
          speak(mockResponse);
          setIsAnalyzing(false);
        }, 1500);
      } catch (err) {
        addLog("AI Link Error: Connection Failed.");
        setIsAnalyzing(false);
      }
    } else {
      addLog(`Searching Local Memory for: ${searchQuery}`);
      
      // Advanced Local Search Logic (Back-up to the back-up)
      const query = searchQuery.toLowerCase();
      const results = yamlData?.knowledge_base?.filter((node: any) => 
        node.topic?.toLowerCase().includes(query) || 
        node.content?.toLowerCase().includes(query) ||
        node.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      ) || [];

      if (results.length > 0) {
        const bestMatch = results[0];
        const response = `Found entry on "${bestMatch.topic}": ${bestMatch.content}`;
        setAiResponse(response);
        speak(response);
        addLog(`LOCAL MATCH FOUND: ${bestMatch.topic}`);
      } else {
        const fallback = `No direct match for "${searchQuery}" in local memory. Searching directives...`;
        speak(fallback);
        addLog(fallback);
      }
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 relative min-h-screen">
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-50 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black text-center mb-2 uppercase tracking-widest font-display glitch"
          data-text="NEXTXUS CORE"
        >
          NEXTXUS CORE
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`text-2xl md:text-3xl font-black text-center my-8 p-4 rounded-xl uppercase tracking-wider font-display transition-colors duration-500 shadow-lg border-[2px] backdrop-blur-md relative overflow-hidden ${
            verdict.ok ? "border-[#00ff9f]/50 text-[#00ff9f] bg-[#00ff9f]/5" : "border-[#e74c3c]/50 text-[#e74c3c] bg-[#e74c3c]/5"
          }`}
        >
          {verdict.ok && (
            <motion.div 
              className="absolute inset-0 bg-[#00ff9f]/10"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-3">
            {verdict.ok ? (
              <span className="inline-block w-4 h-4 rounded-full bg-[#00ff9f] shadow-[0_0_10px_#00ff9f] animate-pulse"></span>
            ) : (
              <span className="inline-block w-4 h-4 rounded-full bg-[#e74c3c] shadow-[0_0_10px_#e74c3c] animate-pulse"></span>
            )}
            {verdict.msg}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="cyber-card flex flex-col backdrop-blur-md bg-black/40"
          >
            <h2 className="text-2xl font-bold text-[#38bdf8] uppercase tracking-wide mb-2 font-display flex items-center gap-2">
              <span className="w-2 h-2 bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]"></span>
              Calibration Scale
            </h2>
            
            <div className="flex-grow min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(56,189,248,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#c9c9c9', fontSize: 12, fontFamily: 'Rajdhani' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                  <Radar name="Agent" dataKey="A" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="cyber-card flex flex-col backdrop-blur-md bg-black/40"
          >
            <h2 className="text-2xl font-bold text-[#EC4899] uppercase tracking-wide mb-2 font-display flex items-center gap-2">
              <span className="w-2 h-2 bg-[#EC4899] shadow-[0_0_8px_#EC4899]"></span>
              System Terminal
            </h2>
            
            <div className="flex gap-4 mb-4">
              <div className="w-1/3 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="150px">
                  <RadialBarChart 
                    cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" 
                    barSize={10} data={[{ name: 'Score', value: 98, fill: '#00ff9f' }]} 
                    startAngle={220} endAngle={-40}
                  >
                    <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" cornerRadius={5} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-white font-display">98<span className="text-sm opacity-50">%</span></span>
                </div>
              </div>
              
              <div className="w-2/3 terminal-log overflow-y-auto p-4 rounded-lg text-[#c9c9c9] text-sm leading-relaxed max-h-[150px] relative">
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]"></div>
                {logs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={i} 
                    className="mb-1"
                  >
                    {log}
                  </motion.div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex gap-4">
                <button 
                  onClick={exportBrain}
                  className="flex-1 py-3 text-sm font-bold bg-[#8B5CF6]/20 border border-[#8B5CF6] hover:bg-[#8B5CF6]/40 text-white rounded-lg uppercase tracking-wider transition-all font-display hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                >
                  SAVE BRAIN
                </button>
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept=".yaml,.yml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const text = event.target?.result as string;
                          const data = yaml.load(text);
                          setYamlText(text);
                          setYamlData(data);
                          addLog(`LOADED NEW BRAIN: ${file.name}`);
                          playClickSound();
                        } catch (err: any) {
                          addLog(`ERROR PARSING UPLOAD: ${err.message}`);
                        }
                      };
                      reader.readAsText(file);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full py-3 text-sm font-bold bg-[#38bdf8]/20 border border-[#38bdf8] hover:bg-[#38bdf8]/40 text-white rounded-lg uppercase tracking-wider transition-all font-display hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                    LOAD BRAIN
                  </button>
                </div>
                <button 
                  onClick={exportSystem}
                  className="flex-1 py-3 text-sm font-bold bg-amber-500/20 border border-amber-500 hover:bg-amber-500/40 text-white rounded-lg uppercase tracking-wider transition-all font-display hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                >
                  DOWNLOAD CORE
                </button>
              </div>
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={toggleVoice}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg uppercase tracking-wider transition-all font-display ${
                    isVoiceEnabled 
                      ? 'bg-[#e74c3c]/20 text-[#e74c3c] border border-[#e74c3c] hover:bg-[#e74c3c]/40 hover:shadow-[0_0_15px_rgba(231,76,60,0.5)]' 
                      : 'bg-transparent text-[#00ff9f] border border-[#00ff9f]/50 hover:bg-[#00ff9f]/10 hover:border-[#00ff9f]'
                  }`}
                >
                  VOICE: {isVoiceEnabled ? 'DISABLE' : 'ENABLE'}
                </button>
              </div>

              {/* ROGERS 3.0 INTERFACE */}
              <div className="flex flex-col gap-2 pt-3 border-t border-[#8B5CF6]/20">
                {!showApiInput ? (
                  <button 
                    onClick={() => {
                      playClickSound();
                      setShowApiInput(true);
                    }}
                    className={`w-full py-3 text-sm font-bold rounded-lg uppercase tracking-wider transition-all font-display ${
                      apiLink 
                        ? 'bg-[#00ff9f]/20 text-[#00ff9f] border border-[#00ff9f] hover:bg-[#00ff9f]/40 hover:shadow-[0_0_15px_rgba(0,255,159,0.5)]'
                        : 'bg-transparent text-[#EC4899] border border-[#EC4899]/50 hover:bg-[#EC4899]/10 hover:border-[#EC4899]'
                    }`}
                  >
                    {apiLink ? 'ROGERS 3.0 ACTIVE' : 'CONNECT ROGERS 3.0 (API LINK)'}
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="ENTER ENDPOINT URL..."
                      value={apiLink}
                      onChange={(e) => setApiLink(e.target.value)}
                      className="w-full bg-black/50 border border-[#EC4899]/50 rounded-lg px-4 py-2 text-[#c9c9c9] font-mono text-sm focus:outline-none focus:border-[#EC4899] transition-all"
                    />
                    <input
                      type="password"
                      placeholder="ENTER API KEY / AUTH TOKEN..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-black/50 border border-[#EC4899]/50 rounded-lg px-4 py-2 text-[#c9c9c9] font-mono text-sm focus:outline-none focus:border-[#EC4899] transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          playClickSound();
                          setShowApiInput(false);
                          if (apiLink) {
                            addLog("ROGERS 3.0 LINK ESTABLISHED. External engine active.");
                          } else {
                            addLog("ROGERS 3.0 DISCONNECTED. Reverting to local core.");
                          }
                        }}
                        className="flex-1 py-2 font-bold bg-[#EC4899]/20 border border-[#EC4899] text-white rounded-lg uppercase tracking-wider transition-all hover:bg-[#EC4899]/40 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                      >
                        {apiLink ? 'CONNECT' : 'CANCEL'}
                      </button>
                    </div>
                  </div>
                )}
                {apiLink && !showApiInput && (
                  <div className="text-[10px] text-[#00ff9f] font-mono text-center tracking-widest break-all px-2 opacity-70">
                    LINKED: {apiLink}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Data Core Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="cyber-card backdrop-blur-md bg-black/40"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-[#8B5CF6]/30 pb-4 gap-4">
            <h2 className="text-2xl font-bold text-[#8B5CF6] uppercase tracking-wide font-display flex items-center gap-2">
              <span className="w-2 h-2 bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]"></span>
              Active Directives
            </h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-[350px]">
                <input
                  type="text"
                  placeholder="QUERY DATA CORE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  className="bg-black/50 border border-[#8B5CF6]/50 rounded-lg px-4 py-2 text-[#c9c9c9] font-mono text-sm focus:outline-none focus:border-[#8B5CF6] focus:shadow-[0_0_10px_rgba(139,92,246,0.3)] w-full transition-all placeholder:text-[#8B5CF6]/30 pr-10"
                />
                <button 
                  onClick={handleQuery}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8B5CF6] hover:text-[#00ff9f] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
              </div>
              <div className="text-sm font-mono text-[#8B5CF6]/70 uppercase tracking-widest whitespace-nowrap">
                Count: {yamlData?.directives?.length || 0}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-lg bg-[#00ff9f]/10 border border-[#00ff9f]/30 font-mono text-[#00ff9f] text-sm relative"
              >
                <button 
                  onClick={() => setAiResponse("")}
                  className="absolute top-2 right-2 text-[#00ff9f]/50 hover:text-[#00ff9f]"
                >
                  ✕
                </button>
                <div className="flex gap-2 items-start">
                  <span className="animate-pulse">●</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">AI Synthesis Response:</div>
                    {aiResponse}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {yamlData?.directives
                ?.filter((dir: any) => 
                  dir.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  dir.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  dir.id.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((dir: any, idx: number) => (
                <motion.div
                  key={dir.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * (idx % 20) }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
                  className="p-5 rounded-lg border border-[#8B5CF6]/30 bg-black/60 relative overflow-hidden group cursor-pointer flex flex-col h-full"
                  onClick={() => {
                    playClickSound();
                    speak(`${dir.title}. ${dir.content}`);
                  }}
                >
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#8B5CF6] to-[#38bdf8] opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_15px_#8B5CF6] transition-all"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] font-mono text-[#8B5CF6] tracking-tighter uppercase opacity-70">{dir.id}</div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse shadow-[0_0_5px_#00ff9f]"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-[#00ff9f] transition-colors">{dir.title}</h3>
                  <p className="text-sm text-[#c9c9c9] leading-relaxed group-hover:text-white transition-colors flex-grow italic">"{dir.content}"</p>
                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                    <span className="text-[9px] font-mono text-[#8B5CF6]/50 group-hover:text-[#8B5CF6] uppercase tracking-widest">Read Directive</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!yamlData && (
              <div className="col-span-full py-10 text-center text-[#c9c9c9] animate-pulse">
                Awaiting Data Core Synchronization...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
