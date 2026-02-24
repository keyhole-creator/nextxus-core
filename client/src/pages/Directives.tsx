import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const models = [
  { id: "gpt-5.1", name: "Rogers 3.0 (GPT-5.1)" },
  { id: "claude-sonnet-4-6", name: "Anthropic Claude" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek (OpenRouter)" },
  { id: "xai/grok-2", name: "Grok (OpenRouter)" },
];

export default function Directives() {
  const [directives, setDirectives] = useState<any[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-5.1");
  const [aiResponse, setAiResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [dirRes, knowledgeRes] = await Promise.all([
          fetch('/api/directives'),
          fetch('/api/knowledge'),
        ]);
        if (dirRes.ok) {
          const dirs = await dirRes.json();
          setDirectives(dirs);
        }
        if (knowledgeRes.ok) {
          const data = await knowledgeRes.json();
          setKnowledgeBase(data);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    }
    loadData();
  }, []);

  const volumes = useMemo(() => {
    const volMap = new Map<number, string>();
    directives.forEach((dir: any) => {
      if (dir.volume && dir.volumeTitle && !volMap.has(dir.volume)) {
        volMap.set(dir.volume, dir.volumeTitle);
      }
    });
    return Array.from(volMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([num, title]) => ({ volume: num, volumeTitle: title }));
  }, [directives]);

  const handleQuery = async () => {
    if (!searchQuery.trim()) return;
    setIsAnalyzing(true);
    try {
      const convRes = await fetch('/api/conversations');
      let convId = 1;
      if (convRes.ok) {
        const convs = await convRes.json();
        if (convs.length === 0) {
          const newConv = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: "Directive Query" })
          });
          if (newConv.ok) { const c = await newConv.json(); convId = c.id; }
        } else { convId = convs[0].id; }
      }
      const res = await fetch(`/api/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: searchQuery, model: selectedModel })
      });
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
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) { fullText += data.content; setAiResponse(fullText); }
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      const query = searchQuery.toLowerCase();
      const results = knowledgeBase.filter((node: any) =>
        node.topic?.toLowerCase().includes(query) || node.content?.toLowerCase().includes(query) ||
        node.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      );
      if (results.length > 0) { setAiResponse(`Local Match: ${results[0].content}`); }
      else { setAiResponse(`No match for "${searchQuery}" in local or neural memory.`); }
    } finally { setIsAnalyzing(false); }
  };

  const filteredDirectives = directives.filter((dir: any) => {
    const matchesSearch = !searchQuery ||
      dir.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dir.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dir.directiveId || dir.id)?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVolume = selectedVolume === 0 || dir.volume === selectedVolume;
    return matchesSearch && matchesVolume;
  });

  const groupedDirectives = useMemo(() => {
    if (selectedVolume !== 0) return null;
    const groups = new Map<number, { volumeTitle: string; directives: any[] }>();
    filteredDirectives.forEach((dir: any) => {
      const vol = dir.volume || 0;
      if (!groups.has(vol)) {
        groups.set(vol, { volumeTitle: dir.volumeTitle || "Unknown", directives: [] });
      }
      groups.get(vol)!.directives.push(dir);
    });
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  }, [filteredDirectives, selectedVolume]);

  const renderDirectiveCard = (dir: any, idx: number) => (
    <motion.div
      key={dir.id || dir.directiveId || idx}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * (idx % 20) }}
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
      className="p-5 rounded-lg border border-[#8B5CF6]/20 relative overflow-hidden group cursor-pointer flex flex-col h-full"
      style={{ background: 'rgba(10, 10, 30, 0.4)', backdropFilter: 'blur(8px)' }}
      data-testid={`directive-card-${dir.directiveId || idx}`}
    >
      <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#8B5CF6] to-[#38bdf8] opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_15px_#8B5CF6] transition-all"></div>
      <div className="flex justify-between items-start mb-2">
        <div className="text-[10px] font-mono text-[#8B5CF6] tracking-tighter uppercase opacity-70">{dir.directiveId || dir.id}</div>
        <div className="flex items-center gap-2">
          {dir.volume && (
            <span
              className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/10 text-[#38bdf8] uppercase tracking-wider"
              data-testid={`volume-badge-${dir.directiveId || idx}`}
            >
              Vol {dir.volume}
            </span>
          )}
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse shadow-[0_0_5px_#00ff9f]"></div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-[#00ff9f] transition-colors">{dir.title}</h3>
      <p className="text-sm text-[#c9c9c9] leading-relaxed group-hover:text-white transition-colors flex-grow italic">"{dir.content}"</p>
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
        <span className="text-[9px] font-mono text-[#8B5CF6]/50 group-hover:text-[#8B5CF6] uppercase tracking-widest">Read Directive</span>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 relative min-h-screen" data-testid="directives-page">
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-50 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#8B5CF6] hover:text-[#00ff9f] font-mono text-sm uppercase tracking-widest transition-colors"
            data-testid="back-to-core-link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Back to Core
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <img
            src="/images/roger-3.0.jpeg"
            alt="Roger 3.0"
            className="w-12 h-12 rounded-full object-cover border-2 border-[#8B5CF6]/50 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
          />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest font-display text-[#8B5CF6]" style={{ textShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
            Active Directives
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="cyber-card"
        >
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
                  selectedModel === m.id
                    ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6]"
                    : "bg-black/40 border-white/10 text-white/40 hover:border-white/30"
                }`}
                data-testid={`model-btn-${m.id}`}
              >
                {m.name}
              </button>
            ))}
          </div>

          {volumes.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2" data-testid="volume-tabs">
              <button
                onClick={() => setSelectedVolume(0)}
                className={`px-3 py-1.5 rounded text-xs font-mono border transition-all whitespace-nowrap ${
                  selectedVolume === 0
                    ? "bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                    : "bg-black/40 border-white/10 text-white/40 hover:border-white/30"
                }`}
                data-testid="volume-tab-all"
              >
                All Volumes
              </button>
              {volumes.map((v) => (
                <button
                  key={v.volume}
                  onClick={() => setSelectedVolume(v.volume)}
                  className={`px-3 py-1.5 rounded text-xs font-mono border transition-all whitespace-nowrap ${
                    selectedVolume === v.volume
                      ? "bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                      : "bg-black/40 border-white/10 text-white/40 hover:border-white/30"
                  }`}
                  data-testid={`volume-tab-${v.volume}`}
                >
                  Vol {v.volume}: {v.volumeTitle}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                placeholder="QUERY DATA CORE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="bg-black/50 border border-[#8B5CF6]/50 rounded-lg px-4 py-3 text-[#c9c9c9] font-mono text-sm focus:outline-none focus:border-[#8B5CF6] focus:shadow-[0_0_10px_rgba(139,92,246,0.3)] flex-1 transition-all placeholder:text-[#8B5CF6]/30"
                data-testid="directive-search"
              />
              <button
                onClick={handleQuery}
                disabled={isAnalyzing}
                className="px-6 py-3 uppercase tracking-wider font-display text-sm border border-[#8B5CF6]/50 text-[#8B5CF6] rounded-lg hover:bg-[#8B5CF6]/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="directive-query-btn"
              >
                {isAnalyzing ? "..." : "Search"}
              </button>
            </div>
            <div className="text-sm font-mono text-[#8B5CF6]/70 uppercase tracking-widest whitespace-nowrap">
              Count: {filteredDirectives.length}
            </div>
          </div>

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 font-mono text-[#8B5CF6] text-sm text-center"
              >
                <span className="animate-pulse">Querying neural network [{selectedModel}]...</span>
              </motion.div>
            )}
          </AnimatePresence>

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
                <div className="flex gap-3 items-start">
                  <img src="/images/roger-3.0.jpeg" alt="Roger AI" className="w-8 h-8 rounded-full object-cover border border-[#00ff9f]/40 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Roger AI — Synthesis Response:</div>
                    {aiResponse}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedVolume === 0 && groupedDirectives ? (
            <div className="space-y-8">
              {groupedDirectives.map(([volNum, group]) => (
                <div key={volNum} data-testid={`volume-group-${volNum}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <div className="h-px flex-1 bg-gradient-to-r from-[#38bdf8]/50 to-transparent"></div>
                    <h2 className="text-sm font-mono text-[#38bdf8] uppercase tracking-widest whitespace-nowrap" data-testid={`volume-header-${volNum}`}>
                      Vol {volNum}: {group.volumeTitle}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-[#38bdf8]/50 to-transparent"></div>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {group.directives.map((dir: any, idx: number) => renderDirectiveCard(dir, idx))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
              <AnimatePresence>
                {filteredDirectives.map((dir: any, idx: number) => renderDirectiveCard(dir, idx))}
              </AnimatePresence>
            </div>
          )}

          {directives.length === 0 && (
            <div className="py-10 text-center text-[#c9c9c9] animate-pulse">
              Awaiting Data Core Synchronization...
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
