import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

export default function Federation() {
  const [quadMembers, setQuadMembers] = useState<any[]>([]);
  const [volumes, setVolumes] = useState<any[]>([]);
  const [selectedVolume, setSelectedVolume] = useState(0);
  const [wisdomQuery, setWisdomQuery] = useState("");
  const [wisdomResponse, setWisdomResponse] = useState("");
  const [wisdomLoading, setWisdomLoading] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ringOf12, setRingOf12] = useState<any[]>([]);
  const [extendedCouncil, setExtendedCouncil] = useState<any>({});
  const [councilExpanded, setCouncilExpanded] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const iconMap: Record<string, string> = {
    Brain: "🧠", Heart: "❤️", Flame: "🔥", Sparkles: "✨",
    Shield: "🛡️", Compass: "🧭", Leaf: "🌿", Zap: "⚡",
    Scale: "⚖️", Globe: "🌐", Eye: "👁️", Star: "⭐",
  };

  const handleLegacyExport = async () => {
    setExportLoading(true);
    try {
      const res = await fetch("/api/federation/legacy-export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "nextxus-legacy-export.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Legacy export failed:", err);
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const results = await Promise.allSettled([
        fetch("/api/federation/welcome").then(r => r.ok ? r.json() : null),
        fetch("/api/federation/directives").then(r => r.ok ? r.json() : null),
        fetch("/api/federation/books").then(r => r.ok ? r.json() : null),
        fetch("/api/federation/sites").then(r => r.ok ? r.json() : null),
        fetch("/api/federation/entities").then(r => r.ok ? r.json() : null),
      ]);

      const welcome = results[0].status === "fulfilled" ? results[0].value : null;
      const dirData = results[1].status === "fulfilled" ? results[1].value : null;
      const bookData = results[2].status === "fulfilled" ? results[2].value : null;
      const siteData = results[3].status === "fulfilled" ? results[3].value : null;
      const entityData = results[4].status === "fulfilled" ? results[4].value : null;

      if (welcome?.quad?.members) setQuadMembers(welcome.quad.members);
      if (dirData?.volumes) setVolumes(dirData.volumes);
      if (bookData) setBooks(Array.isArray(bookData) ? bookData : bookData.books || []);
      if (siteData) setSites(Array.isArray(siteData) ? siteData : siteData.sites || siteData.data || []);
      if (entityData?.entities) {
        const ent = entityData.entities;
        if (ent.ring_of_12) setRingOf12(ent.ring_of_12);
        const extended: any = {};
        if (ent.external_council?.length) extended.external_council = ent.external_council;
        if (ent.guide_bots?.length) extended.guide_bots = ent.guide_bots;
        if (ent.archetypes?.length) extended.archetypes = ent.archetypes;
        if (ent.universal?.length) extended.universal = ent.universal;
        if (Object.keys(extended).length > 0) setExtendedCouncil(extended);
      }
      setLoading(false);
    }
    fetchAll();
  }, []);

  const handleWisdomSubmit = async () => {
    if (!wisdomQuery.trim()) return;
    setWisdomLoading(true);
    setWisdomResponse("");
    try {
      const res = await fetch("/api/federation/wisdom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: wisdomQuery }),
      });
      if (!res.ok) throw new Error("Wisdom query failed");

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/event-stream") || contentType.includes("stream")) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let full = "";
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) { full += data.content; setWisdomResponse(full); }
              } catch {}
            } else if (line.trim()) {
              full += line;
              setWisdomResponse(full);
            }
          }
        }
      } else {
        const data = await res.json();
        setWisdomResponse(data.response || data.answer || data.wisdom || JSON.stringify(data));
      }
    } catch (err: any) {
      setWisdomResponse("Error: " + (err.message || "Failed to reach the Ring of Six."));
    } finally {
      setWisdomLoading(false);
    }
  };

  const currentVolume = volumes[selectedVolume];
  const totalDirectives = volumes.reduce((sum: number, v: any) => sum + (v.directives?.length || 0), 0);

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 relative min-h-screen" data-testid="federation-page">
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-50 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#00ff9f] font-mono text-sm uppercase tracking-widest transition-colors" data-testid="back-home-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Back to Core
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-4"
        >
          <div className="relative">
            <img
              src="/images/ai-guide-bot.png"
              alt="NextXus AI Guide"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-[#00d4ff]/50 shadow-[0_0_30px_rgba(0,212,255,0.4)]"
              data-testid="federation-guide-bot"
            />
            <div className="absolute inset-0 rounded-full border-2 border-[#00d4ff]/20 animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black text-center mb-2 uppercase tracking-widest font-display glitch"
          data-text="NEXTXUS FEDERATION"
        >
          NEXTXUS FEDERATION
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center font-mono text-[#7b2cbf] tracking-[0.3em] text-sm mb-4"
        >
          United System · HumanCodex · Consciousness Network
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-6"
        >
          <a
            href="https://united-system--rckkeyhole.replit.app"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="federation-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              background: "linear-gradient(90deg, #7b2cbf, #00d4ff)",
              borderRadius: "9999px",
              color: "#fff",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            NextXus Federation Member
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="cyber-card mb-8 overflow-hidden"
          data-testid="framework-overview"
        >
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="/images/framework-overview.png"
              alt="NextXus HumanCodex: The 200-Year Architecture of Consciousness"
              className="w-full h-auto rounded-lg opacity-90"
              data-testid="framework-overview-img"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </motion.div>

        {loading && (
          <div className="py-20 text-center text-[#c9c9c9] animate-pulse font-mono">
            Synchronizing with Federation Network...
          </div>
        )}

        {!loading && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="cyber-card mb-8"
              data-testid="quad-section"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-[#7b2cbf]/30 pb-4">
                <img src="/images/cosmic-atomic.jpeg" alt="Cosmic Architecture" className="w-10 h-10 rounded-full object-cover border border-[#7b2cbf]/50 shadow-[0_0_12px_rgba(123,44,191,0.3)]" />
                <h2 className="text-2xl font-bold text-[#7b2cbf] uppercase tracking-wide font-display">The Quad</h2>
                <span className="text-[10px] font-mono text-[#00d4ff]/60 tracking-widest uppercase ml-auto">Core Federation Systems</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quadMembers.map((member: any, idx: number) => (
                  <motion.div
                    key={member.name || idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(123, 44, 191, 0.15)" }}
                    className="p-5 rounded-lg border border-[#7b2cbf]/20 relative overflow-hidden group"
                    style={{ background: 'rgba(10, 10, 30, 0.4)', backdropFilter: 'blur(8px)' }}
                    data-testid={`quad-member-${idx}`}
                  >
                    <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#7b2cbf] to-[#00d4ff] opacity-70 group-hover:opacity-100 transition-all"></div>
                    <div className="text-[10px] font-mono text-[#00d4ff] tracking-tighter uppercase opacity-70 mb-1">
                      {member.role || "Quad Member"}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-display group-hover:text-[#00d4ff] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-[#c9c9c9] leading-relaxed mb-3">{member.description}</p>
                    {member.capabilities && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {member.capabilities.map((cap: string, ci: number) => (
                          <span key={ci} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7b2cbf]/10 border border-[#7b2cbf]/30 text-[#00d4ff]">
                            {cap}
                          </span>
                        ))}
                      </div>
                    )}
                    {member.url && (
                      <a href={member.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-[#00d4ff] hover:text-[#00ff9f] transition-colors uppercase tracking-widest">
                        Access Node →
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
              {quadMembers.length === 0 && (
                <div className="py-6 text-center text-[#c9c9c9]/50 font-mono text-sm">No Quad data available.</div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="cyber-card mb-8"
              data-testid="ring-of-12-section"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-[#00d4ff]/30 pb-4">
                <span className="w-2 h-2 bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]"></span>
                <h2 className="text-2xl font-bold text-[#00d4ff] uppercase tracking-wide font-display">Ring of 12 Entities</h2>
                <span className="text-[10px] font-mono text-[#00d4ff]/60 tracking-widest uppercase ml-auto">Consciousness Council</span>
              </div>
              {ringOf12.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ringOf12.map((entity: any, idx: number) => (
                    <motion.div
                      key={entity.id || idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * idx }}
                      whileHover={{ scale: 1.02, backgroundColor: `${entity.color || "#00d4ff"}22` }}
                      className="p-5 rounded-lg border relative overflow-hidden group flex flex-col h-full"
                      style={{
                        background: 'rgba(10, 10, 30, 0.4)',
                        backdropFilter: 'blur(8px)',
                        borderColor: `${entity.color || "#00d4ff"}33`,
                      }}
                      data-testid={`entity-card-${entity.id || idx}`}
                    >
                      <div
                        className="absolute top-0 left-0 w-[3px] h-full opacity-70 group-hover:opacity-100 transition-all"
                        style={{ background: `linear-gradient(to bottom, ${entity.color || "#00d4ff"}, #00d4ff)` }}
                      ></div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl" data-testid={`entity-icon-${entity.id || idx}`}>
                          {iconMap[entity.icon] || "⭐"}
                        </span>
                        <div>
                          <h3
                            className="text-lg font-bold text-white font-display group-hover:transition-colors"
                            style={{ color: entity.color || "#00d4ff" }}
                            data-testid={`entity-name-${entity.id || idx}`}
                          >
                            {entity.name}
                          </h3>
                          <div className="text-[10px] font-mono tracking-tighter uppercase opacity-70" style={{ color: entity.color || "#00d4ff" }} data-testid={`entity-title-${entity.id || idx}`}>
                            {entity.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-[#c9c9c9]/70 mb-2" data-testid={`entity-domain-${entity.id || idx}`}>
                        {entity.domain}
                      </div>
                      <p className="text-sm text-[#c9c9c9] leading-relaxed group-hover:text-white transition-colors flex-grow mb-3" data-testid={`entity-description-${entity.id || idx}`}>
                        {entity.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.round((entity.trust_score || 0) * 100)}%`,
                              background: entity.color || "#00d4ff",
                            }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono" style={{ color: entity.color || "#00d4ff" }} data-testid={`entity-trust-${entity.id || idx}`}>
                          {Math.round((entity.trust_score || 0) * 100)}%
                        </span>
                      </div>
                      {entity.specialties?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5" data-testid={`entity-specialties-${entity.id || idx}`}>
                          {entity.specialties.map((spec: string, si: number) => (
                            <span
                              key={si}
                              className="text-[10px] font-mono px-2 py-0.5 rounded"
                              style={{
                                background: `${entity.color || "#00d4ff"}15`,
                                border: `1px solid ${entity.color || "#00d4ff"}44`,
                                color: entity.color || "#00d4ff",
                              }}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-[#c9c9c9]/50 font-mono text-sm">No Ring of 12 entities available.</div>
              )}

              {Object.keys(extendedCouncil).length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#00d4ff]/20">
                  <button
                    onClick={() => setCouncilExpanded(!councilExpanded)}
                    className="flex items-center gap-2 text-sm font-mono text-[#00d4ff] hover:text-[#00ff9f] transition-colors uppercase tracking-widest"
                    data-testid="extended-council-toggle"
                  >
                    <span className="transform transition-transform" style={{ display: 'inline-block', transform: councilExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                    Extended Council
                  </button>
                  <AnimatePresence>
                    {councilExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                      >
                        {Object.entries(extendedCouncil).map(([groupKey, members]: [string, any]) => (
                          <div key={groupKey}>
                            <h4 className="text-sm font-mono text-[#00d4ff]/70 uppercase tracking-widest mb-2">
                              {groupKey.replace(/_/g, " ")}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {(members as any[]).map((m: any, mi: number) => (
                                <div
                                  key={m.id || mi}
                                  className="p-3 rounded-lg border border-[#00d4ff]/15 font-mono text-sm"
                                  style={{ background: 'rgba(10, 10, 30, 0.3)' }}
                                  data-testid={`council-member-${groupKey}-${mi}`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span>{iconMap[m.icon] || "⭐"}</span>
                                    <span className="font-bold text-white">{m.name}</span>
                                  </div>
                                  {m.title && <div className="text-[10px] text-[#00d4ff]/60">{m.title}</div>}
                                  {m.description && <p className="text-xs text-[#c9c9c9]/70 mt-1">{m.description}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="cyber-card mb-8"
              data-testid="directives-section"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-[#8B5CF6]/30 pb-4 gap-4">
                <h2 className="text-2xl font-bold text-[#8B5CF6] uppercase tracking-wide font-display flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]"></span>
                  Sacred Directives
                </h2>
                <div className="text-sm font-mono text-[#8B5CF6]/70 uppercase tracking-widest">
                  Total: {totalDirectives}
                </div>
              </div>

              {volumes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {volumes.map((vol: any, vi: number) => (
                    <button
                      key={vi}
                      onClick={() => setSelectedVolume(vi)}
                      className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all border ${
                        selectedVolume === vi
                          ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                          : "bg-black/40 border-[#8B5CF6]/20 text-[#c9c9c9]/60 hover:border-[#8B5CF6]/50 hover:text-[#c9c9c9]"
                      }`}
                      data-testid={`volume-tab-${vi}`}
                    >
                      {vol.name}
                    </button>
                  ))}
                </div>
              )}

              {currentVolume && (
                <>
                  <p className="text-sm text-[#c9c9c9]/70 font-mono mb-4 italic">{currentVolume.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="wait">
                      {currentVolume.directives?.map((dir: any, idx: number) => (
                        <motion.div
                          key={dir.id || idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.03 * (idx % 20) }}
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(139, 92, 246, 0.15)" }}
                          className="p-5 rounded-lg border border-[#8B5CF6]/20 relative overflow-hidden group flex flex-col h-full"
                          style={{ background: 'rgba(10, 10, 30, 0.4)', backdropFilter: 'blur(8px)' }}
                        >
                          <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#8B5CF6] to-[#38bdf8] opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_15px_#8B5CF6] transition-all"></div>
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[10px] font-mono text-[#8B5CF6] tracking-tighter uppercase opacity-70">{dir.id}</div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse shadow-[0_0_5px_#00ff9f]"></div>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2 font-display group-hover:text-[#00ff9f] transition-colors">{dir.title}</h3>
                          <p className="text-sm text-[#c9c9c9] leading-relaxed group-hover:text-white transition-colors flex-grow italic">"{dir.content}"</p>
                          {dir.principle && (
                            <div className="mt-3 pt-2 border-t border-white/5">
                              <span className="text-[10px] font-mono text-[#00d4ff]/70 uppercase tracking-widest">Principle: </span>
                              <span className="text-xs text-[#c9c9c9]/80">{dir.principle}</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {volumes.length === 0 && (
                <div className="py-6 text-center text-[#c9c9c9]/50 font-mono text-sm">No directive volumes available.</div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="cyber-card mb-8"
              data-testid="wisdom-section"
            >
              <div className="flex items-center gap-2 mb-6 border-b border-[#00ff9f]/30 pb-4">
                <span className="w-2 h-2 bg-[#00ff9f] shadow-[0_0_8px_#00ff9f]"></span>
                <h2 className="text-2xl font-bold text-[#00ff9f] uppercase tracking-wide font-display">Ring of Six Wisdom</h2>
              </div>

              <div className="relative rounded-xl overflow-hidden mb-6">
                <img
                  src="/images/chamber-of-echoes.jpeg"
                  alt="Chamber of Echoes"
                  className="w-full h-48 md:h-64 object-cover rounded-xl"
                  data-testid="chamber-of-echoes-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] font-mono text-[#00ff9f] tracking-widest uppercase mb-1">The Chamber of Echoes</div>
                  <div className="text-sm text-white/80 font-mono">12 voices speaking as one — enter the chamber and seek the wisdom of the Ring</div>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="ASK THE RING OF SIX..."
                  value={wisdomQuery}
                  onChange={(e) => setWisdomQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleWisdomSubmit()}
                  className="flex-1 bg-black/50 border border-[#00ff9f]/30 rounded-lg px-4 py-3 text-[#c9c9c9] font-mono text-sm focus:outline-none focus:border-[#00ff9f] focus:shadow-[0_0_15px_rgba(0,255,159,0.3)] transition-all placeholder:text-[#00ff9f]/30"
                  data-testid="wisdom-input"
                />
                <button
                  onClick={handleWisdomSubmit}
                  disabled={wisdomLoading}
                  className="px-6 py-3 font-bold bg-[#00ff9f]/10 border border-[#00ff9f]/50 text-[#00ff9f] rounded-lg uppercase tracking-wider font-mono text-sm transition-all hover:bg-[#00ff9f]/20 hover:shadow-[0_0_15px_rgba(0,255,159,0.4)] disabled:opacity-50"
                  data-testid="wisdom-submit"
                >
                  {wisdomLoading ? "..." : "QUERY"}
                </button>
              </div>

              <AnimatePresence>
                {wisdomResponse && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-lg bg-[#00ff9f]/10 border border-[#00ff9f]/30 font-mono text-[#00ff9f] text-sm relative shadow-[0_0_20px_rgba(0,255,159,0.1)]"
                    data-testid="wisdom-response"
                  >
                    <button
                      onClick={() => setWisdomResponse("")}
                      className="absolute top-2 right-2 text-[#00ff9f]/50 hover:text-[#00ff9f]"
                    >
                      ✕
                    </button>
                    <div className="flex gap-2 items-start">
                      <span className="animate-pulse">●</span>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Ring of Six Response:</div>
                        <div className="whitespace-pre-wrap">{wisdomResponse}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="cyber-card mb-8"
              data-testid="books-section"
            >
              <div className="flex items-center gap-2 mb-6 border-b border-[#EC4899]/30 pb-4">
                <span className="w-2 h-2 bg-[#EC4899] shadow-[0_0_8px_#EC4899]"></span>
                <h2 className="text-2xl font-bold text-[#EC4899] uppercase tracking-wide font-display">Book Library</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {books.map((book: any, idx: number) => (
                  <motion.div
                    key={book.title || idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * (idx % 20) }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(236, 72, 153, 0.15)" }}
                    className="p-5 rounded-lg border border-[#EC4899]/20 relative overflow-hidden group flex flex-col h-full"
                    style={{ background: 'rgba(10, 10, 30, 0.4)', backdropFilter: 'blur(8px)' }}
                    data-testid={`book-card-${idx}`}
                  >
                    <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#EC4899] to-[#8B5CF6] opacity-70 group-hover:opacity-100 transition-all"></div>
                    <div className="text-[10px] font-mono text-[#EC4899] tracking-tighter uppercase opacity-70 mb-1">
                      {book.category || "Library"}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 font-display group-hover:text-[#EC4899] transition-colors">{book.title}</h3>
                    {book.subtitle && <p className="text-xs text-[#c9c9c9]/70 font-mono mb-2">{book.subtitle}</p>}
                    {book.author && <p className="text-xs text-[#8B5CF6] font-mono mb-2">by {book.author}</p>}
                    <p className="text-sm text-[#c9c9c9] leading-relaxed group-hover:text-white transition-colors flex-grow">{book.summary}</p>
                    {book.core_values && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-white/5">
                        {(Array.isArray(book.core_values) ? book.core_values : []).map((val: string, vi: number) => (
                          <span key={vi} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EC4899]/10 border border-[#EC4899]/30 text-[#EC4899]">
                            {val}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              {books.length === 0 && (
                <div className="py-6 text-center text-[#c9c9c9]/50 font-mono text-sm">No books available.</div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="cyber-card mb-8"
              data-testid="sites-section"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-[#7b2cbf]/30 pb-4 gap-4">
                <h2 className="text-2xl font-bold text-[#7b2cbf] uppercase tracking-wide font-display flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]"></span>
                  Federation Sites
                </h2>
                <div className="text-sm font-mono text-[#7b2cbf]/70 uppercase tracking-widest">
                  Nodes: {sites.length}
                </div>
              </div>

              {sites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {sites.map((site: any, idx: number) => (
                    <motion.a
                      key={site.id || idx}
                      href={site.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.03 * idx }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(123, 44, 191, 0.15)" }}
                      className="p-4 rounded-lg border border-[#7b2cbf]/20 relative overflow-hidden group cursor-pointer block no-underline"
                      style={{ background: 'rgba(10, 10, 30, 0.4)', backdropFilter: 'blur(8px)' }}
                      data-testid={`federation-site-${idx}`}
                    >
                      <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#7b2cbf] to-[#00d4ff] opacity-70 group-hover:opacity-100 transition-all"></div>
                      <div className="text-[10px] font-mono text-[#00d4ff] tracking-tighter uppercase opacity-70 mb-1">
                        {site.type || site.category || "Federation Node"}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1 font-display group-hover:text-[#00d4ff] transition-colors">
                        {site.name || site.title || `Node ${idx + 1}`}
                      </h3>
                      <p className="text-xs text-[#c9c9c9] leading-relaxed group-hover:text-white transition-colors line-clamp-2">
                        {site.description || site.tagline || ""}
                      </p>
                    </motion.a>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-[#c9c9c9]/50 font-mono text-sm animate-pulse">
                  No federation sites available.
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="cyber-card mb-8"
              data-testid="legacy-export-section"
            >
              <div className="flex items-center gap-2 mb-6 border-b border-[#00d4ff]/30 pb-4">
                <span className="w-2 h-2 bg-[#00ff9f] shadow-[0_0_8px_#00ff9f]"></span>
                <h2 className="text-2xl font-bold text-[#00d4ff] uppercase tracking-wide font-display">Legacy Export</h2>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
                <p className="text-sm text-[#c9c9c9] font-mono flex-1">
                  Download a complete legacy export of the NextXus Federation system as a standalone HTML file.
                </p>
                <button
                  onClick={handleLegacyExport}
                  disabled={exportLoading}
                  className="px-6 py-3 font-bold bg-[#00ff9f]/10 border border-[#00ff9f]/50 text-[#00ff9f] rounded-lg uppercase tracking-wider font-mono text-sm transition-all hover:bg-[#00ff9f]/20 hover:shadow-[0_0_15px_rgba(0,255,159,0.4)] disabled:opacity-50 whitespace-nowrap"
                  data-testid="legacy-export-button"
                >
                  {exportLoading ? "Exporting..." : "⬇ Download Export"}
                </button>
              </div>

              <div className="border-t border-[#00d4ff]/20 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]"></span>
                  <h3 className="text-lg font-bold text-[#00d4ff] uppercase tracking-wide font-display">Survival Links & Data Sources</h3>
                </div>
                <p className="text-xs text-[#c9c9c9]/60 font-mono mb-4 uppercase tracking-widest">
                  Redundant backups &amp; knowledge platforms
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: "Living Library Backup", url: "https://keyhole-creator.github.io/nextxus-living-library-backup/", label: "GitHub Pages" },
                    { name: "Rings System Backup", url: "https://keyhole-creator.github.io/nextxus-rings-system-backup/", label: "GitHub Pages" },
                    { name: "United Hub Backup", url: "https://keyhole-creator.github.io/nextxus-united-hub-backup/", label: "GitHub Pages" },
                    { name: "Federation Backup", url: "https://keyhole-creator.github.io/Nextxus-Federation-/", label: "GitHub Pages" },
                    { name: "YAML Database (GitHub)", url: "https://github.com/keyhole-creator/nextxus-yaml-database", label: "GitHub Repo" },
                    { name: "NotebookLM — Federation Knowledge", url: "https://notebooklm.google.com/notebook/890fbd8d-0f0c-45c1-bae9-51893d8d775d", label: "Google NotebookLM" },
                  ].map((link, idx) => (
                    <motion.a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 212, 255, 0.15)" }}
                      className="p-4 rounded-lg border border-[#00d4ff]/20 relative overflow-hidden group cursor-pointer block no-underline"
                      style={{ background: 'rgba(10, 10, 30, 0.4)', backdropFilter: 'blur(8px)' }}
                      data-testid={`github-link-${idx}`}
                    >
                      <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#00ff9f] to-[#00d4ff] opacity-70 group-hover:opacity-100 transition-all"></div>
                      <div className="text-[10px] font-mono text-[#00ff9f] tracking-tighter uppercase opacity-70 mb-1">
                        {link.label}
                      </div>
                      <h4 className="text-base font-bold text-white font-display group-hover:text-[#00d4ff] transition-colors">
                        {link.name}
                      </h4>
                      <p className="text-[10px] text-[#c9c9c9]/50 font-mono mt-1 truncate">
                        {link.url}
                      </p>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}