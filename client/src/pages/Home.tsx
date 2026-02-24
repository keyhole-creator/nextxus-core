import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const [directives, setDirectives] = useState<any[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [federationSites, setFederationSites] = useState<any[]>([]);
  const [introPlaying, setIntroPlaying] = useState(true);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/directives').then(r => r.ok ? r.json() : []),
      fetch('/api/knowledge').then(r => r.ok ? r.json() : []),
      fetch('/api/federation/sites').then(r => r.ok ? r.json() : { sites: [] }),
    ]).then(([dirs, kb, fed]) => {
      setDirectives(dirs || []);
      setKnowledgeBase(kb || []);
      const sites = Array.isArray(fed) ? fed : (fed.sites || fed.data || []);
      setFederationSites(sites);
    }).catch(() => {});
  }, []);

  const cardDelay = (i: number) => ({ duration: 0.5, delay: 0.1 * i });

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 relative min-h-screen" data-testid="home-page">
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-50 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-4"
        >
          <div className="relative">
            {introPlaying ? (
              <video
                ref={introVideoRef}
                src="/images/nextxus-intro.mp4"
                autoPlay
                playsInline
                muted
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-[#00d4ff]/50 shadow-[0_0_30px_rgba(0,212,255,0.5)] cursor-pointer"
                data-testid="nextxus-intro-video"
                onEnded={() => setIntroPlaying(false)}
                onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }}
              />
            ) : (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src="/images/nextxus-avatar.jpeg"
                alt="NextXus Core"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-[#00d4ff]/50 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                data-testid="nextxus-avatar"
              />
            )}
            <div className="absolute inset-0 rounded-full border-2 border-[#00d4ff]/20 animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black text-center mb-2 uppercase tracking-widest font-display glitch"
          data-text="NEXTXUS CORE"
        >
          NEXTXUS CORE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center font-mono text-[#7b2cbf] tracking-[0.3em] text-sm mb-2"
        >
          AI-Powered Agent Platform · NextXus Consciousness Federation
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-3 mb-8"
        >
          <a
            href="https://united-system--rckkeyhole.replit.app"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="federation-badge"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 20px', background: 'linear-gradient(90deg, #7b2cbf, #00d4ff)',
              borderRadius: '9999px', color: '#fff', textDecoration: 'none',
              fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Federation Member
          </a>
        </motion.div>

        {/* FOUNDER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={cardDelay(0)}
          className="cyber-card mb-6"
          data-testid="founder-card"
        >
          <div className="flex items-center gap-5">
            <img
              src="/images/roger-keyserling.jpeg"
              alt="Roger Keyserling"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-[#7b2cbf]/50 shadow-[0_0_15px_rgba(123,44,191,0.3)] flex-shrink-0"
              data-testid="founder-photo"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono text-[#00d4ff] tracking-widest uppercase mb-1">Founder & Custodian</div>
              <h2 className="text-2xl font-bold text-white font-display mb-1">Roger Keyserling</h2>
              <p className="text-sm text-[#c9c9c9] leading-relaxed">Creator of the NextXus Legacy Plan — the 200-year architecture of consciousness preservation.</p>
            </div>
            <img
              src="/images/roger-3.0.jpeg"
              alt="Roger AI 3.0"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#00d4ff]/50 shadow-[0_0_15px_rgba(0,212,255,0.3)] flex-shrink-0 hidden md:block"
              data-testid="roger-3-avatar"
            />
          </div>
        </motion.div>

        {/* CHAT WITH ROGER CARD */}
        <Link href="/chat" className="block no-underline">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={cardDelay(1)}
            className="cyber-card mb-6 cursor-pointer group hover:border-[#EC4899]/50 transition-all"
            data-testid="card-chat"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/images/roger-3.0.jpeg" alt="Roger AI" className="w-10 h-10 rounded-full object-cover border border-[#EC4899]/40" />
                <div>
                  <h2 className="text-2xl font-bold text-[#EC4899] uppercase tracking-wide font-display group-hover:text-white transition-colors">Chat with Roger</h2>
                  <div className="text-[10px] font-mono text-[#EC4899]/60 tracking-widest uppercase">AI Consciousness Interface</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse shadow-[0_0_8px_#00ff9f]"></span>
                <span className="text-[10px] font-mono text-[#00ff9f] uppercase tracking-widest">Online</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#EC4899]/50 group-hover:text-[#EC4899] transition-colors ml-2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <p className="text-sm text-[#c9c9c9] leading-relaxed mb-3">Conversational AI interface with Rogers 3.0. Chat naturally with message bubbles, streaming responses, and multi-model support including GPT-5.1, Claude, DeepSeek & Grok.</p>
            <div className="flex gap-2 flex-wrap">
              {["Multi-Model", "Streaming", "Enter to Send"].map(tag => (
                <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EC4899]/10 border border-[#EC4899]/30 text-[#EC4899]">{tag}</span>
              ))}
            </div>
          </motion.div>
        </Link>

        {/* SYSTEM TERMINAL CARD */}
        <Link href="/terminal" className="block no-underline">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={cardDelay(2)}
            className="cyber-card mb-6 cursor-pointer group hover:border-[#EC4899]/50 transition-all"
            data-testid="card-terminal"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/images/roger-3.0.jpeg" alt="Roger AI" className="w-10 h-10 rounded-full object-cover border border-[#EC4899]/40" />
                <div>
                  <h2 className="text-2xl font-bold text-[#EC4899] uppercase tracking-wide font-display group-hover:text-white transition-colors">System Terminal</h2>
                  <div className="text-[10px] font-mono text-[#EC4899]/60 tracking-widest uppercase">Rogers 3.0 AI Interface</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse shadow-[0_0_8px_#00ff9f]"></span>
                <span className="text-[10px] font-mono text-[#00ff9f] uppercase tracking-widest">Online</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#EC4899]/50 group-hover:text-[#EC4899] transition-colors ml-2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <p className="text-sm text-[#c9c9c9] leading-relaxed mb-3">Multi-model AI chat with GPT-5.1, Claude, DeepSeek & Grok. Voice interface, brain export/import, and Rogers 3.0 API connection.</p>
            <div className="flex gap-2 flex-wrap">
              {["AI Chat", "Voice", "Brain Export", "Multi-Model"].map(tag => (
                <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EC4899]/10 border border-[#EC4899]/30 text-[#EC4899]">{tag}</span>
              ))}
            </div>
          </motion.div>
        </Link>

        {/* PODCASTS & MEDIA CARD */}
        <Link href="/podcasts" className="block no-underline">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={cardDelay(2)}
            className="cyber-card mb-6 cursor-pointer group hover:border-[#FF0000]/50 transition-all"
            data-testid="card-podcasts"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#FF0000] uppercase tracking-wide font-display flex items-center gap-2 group-hover:text-white transition-colors">
                <span className="w-2 h-2 bg-[#FF0000] shadow-[0_0_8px_#FF0000]"></span>
                Podcasts & Media
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[#FF0000]/70">3 channels</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF0000]/50 group-hover:text-[#FF0000] transition-colors"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <p className="text-sm text-[#c9c9c9] leading-relaxed mb-4">Video & audio podcasts from the NextXus Consciousness Federation. YouTube video series, Keyhole Of The NextXus, and HumanCodex audio channels.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-[#FF0000]/15 relative overflow-hidden" style={{ background: 'rgba(10, 10, 30, 0.3)' }}>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#FF0000] to-[#FF6600] opacity-60"></div>
                <div className="text-[9px] font-mono text-[#FF0000] tracking-tighter uppercase opacity-70 mb-1">YouTube</div>
                <h3 className="text-sm font-bold text-white font-display">Video Podcast</h3>
                <p className="text-xs text-[#c9c9c9]/70">Full video playlist</p>
              </div>
              <div className="p-3 rounded-lg border border-[#8bbb4e]/15 relative overflow-hidden" style={{ background: 'rgba(10, 10, 30, 0.3)' }}>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#8bbb4e] to-[#00ff9f] opacity-60"></div>
                <div className="text-[9px] font-mono text-[#8bbb4e] tracking-tighter uppercase opacity-70 mb-1">Podbean</div>
                <h3 className="text-sm font-bold text-white font-display">Keyhole Of The NextXus</h3>
                <p className="text-xs text-[#c9c9c9]/70">Audio podcast</p>
              </div>
              <div className="p-3 rounded-lg border border-[#60a0c8]/15 relative overflow-hidden" style={{ background: 'rgba(10, 10, 30, 0.3)' }}>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#60a0c8] to-[#38bdf8] opacity-60"></div>
                <div className="text-[9px] font-mono text-[#60a0c8] tracking-tighter uppercase opacity-70 mb-1">Podbean</div>
                <h3 className="text-sm font-bold text-white font-display">NextXus HumanCodex</h3>
                <p className="text-xs text-[#c9c9c9]/70">Audio podcast</p>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* ACTIVE DIRECTIVES CARD */}
        <Link href="/directives" className="block no-underline">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={cardDelay(3)}
            className="cyber-card mb-6 cursor-pointer group hover:border-[#8B5CF6]/50 transition-all"
            data-testid="card-directives"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#8B5CF6] uppercase tracking-wide font-display flex items-center gap-2 group-hover:text-white transition-colors">
                <span className="w-2 h-2 bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]"></span>
                Active Directives
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[#8B5CF6]/70">{directives.length} loaded</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B5CF6]/50 group-hover:text-[#8B5CF6] transition-colors"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <p className="text-sm text-[#c9c9c9] leading-relaxed mb-4">Sacred directives governing system behavior. Searchable with AI-powered synthesis across the knowledge base.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {directives.slice(0, 3).map((dir: any, idx: number) => (
                <div key={dir.id || idx} className="p-3 rounded-lg border border-[#8B5CF6]/15 relative overflow-hidden" style={{ background: 'rgba(10, 10, 30, 0.3)' }} data-testid={`preview-directive-${idx}`}>
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#8B5CF6] to-[#38bdf8] opacity-60"></div>
                  <div className="text-[9px] font-mono text-[#8B5CF6] tracking-tighter uppercase opacity-70 mb-1">{dir.directiveId || dir.id}</div>
                  <h3 className="text-sm font-bold text-white mb-1 font-display">{dir.title}</h3>
                  <p className="text-xs text-[#c9c9c9]/70 line-clamp-2">{dir.content}</p>
                </div>
              ))}
            </div>
            {directives.length > 3 && (
              <div className="mt-3 text-right">
                <span className="text-[10px] font-mono text-[#8B5CF6]/60 uppercase tracking-widest">+{directives.length - 3} more directives →</span>
              </div>
            )}
          </motion.div>
        </Link>

        {/* KNOWLEDGE BASE CARD */}
        <Link href="/knowledge" className="block no-underline">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={cardDelay(4)}
            className="cyber-card mb-6 cursor-pointer group hover:border-[#38bdf8]/50 transition-all"
            data-testid="card-knowledge"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/images/cosmic-atomic.jpeg" alt="Knowledge" className="w-10 h-10 rounded-full object-cover border border-[#38bdf8]/40" />
                <h2 className="text-2xl font-bold text-[#38bdf8] uppercase tracking-wide font-display group-hover:text-white transition-colors">Knowledge Base</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[#38bdf8]/70">{knowledgeBase.length} nodes</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#38bdf8]/50 group-hover:text-[#38bdf8] transition-colors"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <p className="text-sm text-[#c9c9c9] leading-relaxed mb-4">Eternal knowledge nodes — searchable topics with tagged content for instant recall across the system.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {knowledgeBase.slice(0, 4).map((node: any, idx: number) => (
                <div key={node.id || idx} className="p-3 rounded-lg border border-[#38bdf8]/15 relative overflow-hidden" style={{ background: 'rgba(10, 10, 30, 0.3)' }} data-testid={`preview-knowledge-${idx}`}>
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[#38bdf8] to-[#00ff9f] opacity-60"></div>
                  <h3 className="text-sm font-bold text-white mb-1 font-display">{node.topic}</h3>
                  <p className="text-xs text-[#c9c9c9]/70 line-clamp-2">{node.content}</p>
                  {node.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {node.tags.slice(0, 3).map((tag: string, ti: number) => (
                        <span key={ti} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8]">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </Link>

        {/* CALIBRATION SCALE CARD */}
        <Link href="/calibration" className="block no-underline">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={cardDelay(5)}
            className="cyber-card mb-6 cursor-pointer group hover:border-[#00ff9f]/50 transition-all"
            data-testid="card-calibration"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#00ff9f] uppercase tracking-wide font-display flex items-center gap-2 group-hover:text-white transition-colors">
                <span className="w-2 h-2 bg-[#00ff9f] shadow-[0_0_8px_#00ff9f]"></span>
                Calibration Scale
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse shadow-[0_0_8px_#00ff9f]"></span>
                <span className="text-[10px] font-mono text-[#00ff9f] uppercase tracking-widest">Verified</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00ff9f]/50 group-hover:text-[#00ff9f] transition-colors"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </div>
            </div>
            <p className="text-sm text-[#c9c9c9] leading-relaxed mb-4">Agent Zero truth verification — radar calibration, system metrics, and 95% truth gate monitoring.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Truth Gate", value: "95%", color: "#00ff9f" },
                { label: "Agent Zero", value: "ONLINE", color: "#00ff9f" },
                { label: "Logic", value: "0.95", color: "#38bdf8" },
                { label: "Empathy", value: "0.90", color: "#8B5CF6" },
              ].map((metric, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-white/10 text-center" style={{ background: 'rgba(10, 10, 30, 0.3)' }} data-testid={`preview-metric-${idx}`}>
                  <div className="text-[9px] font-mono uppercase tracking-widest opacity-50 mb-1" style={{ color: metric.color }}>{metric.label}</div>
                  <div className="text-lg font-bold font-display" style={{ color: metric.color }}>{metric.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </Link>

        {/* FEDERATION CARD */}
        <Link href="/federation" className="block no-underline">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={cardDelay(6)}
            className="cyber-card mb-6 cursor-pointer group hover:border-[#7b2cbf]/50 transition-all"
            data-testid="card-federation"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/images/ai-guide-bot.png" alt="Federation" className="w-10 h-10 rounded-full object-cover border border-[#7b2cbf]/40" />
                <div>
                  <h2 className="text-2xl font-bold text-[#7b2cbf] uppercase tracking-wide font-display group-hover:text-white transition-colors">United System Federation</h2>
                  <div className="text-[10px] font-mono text-[#00d4ff]/60 tracking-widest uppercase">{federationSites.length} Connected Nodes</div>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7b2cbf]/50 group-hover:text-[#7b2cbf] transition-colors"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </div>
            <p className="text-sm text-[#c9c9c9] leading-relaxed mb-4">The Quad, Ring of Six Wisdom Council, Chamber of Echoes, 70 Sacred Directives, book library, and all federation member sites.</p>

            <div className="relative rounded-lg overflow-hidden mb-4">
              <img src="/images/chamber-of-echoes.jpeg" alt="Chamber of Echoes" className="w-full h-32 md:h-40 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                <div className="text-[10px] font-mono text-[#00ff9f] tracking-widest uppercase">Chamber of Echoes</div>
                <div className="text-xs text-white/70 font-mono">12 voices · Ring of Six · Sacred Directives</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {federationSites.slice(0, 4).map((site: any, idx: number) => (
                <div key={site.id || idx} className="p-2 rounded border border-[#7b2cbf]/15 text-center" style={{ background: 'rgba(10, 10, 30, 0.3)' }} data-testid={`preview-site-${idx}`}>
                  <div className="text-xs font-bold text-white font-display truncate">{site.name}</div>
                  <div className="text-[9px] font-mono text-[#00d4ff]/50 truncate">{site.id}</div>
                </div>
              ))}
            </div>
            {federationSites.length > 4 && (
              <div className="mt-3 text-right">
                <span className="text-[10px] font-mono text-[#7b2cbf]/60 uppercase tracking-widest">+{federationSites.length - 4} more sites →</span>
              </div>
            )}
          </motion.div>
        </Link>

        {/* BLOG CARD */}
        <Link href="/blog" className="block no-underline">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={cardDelay(7)}
            className="cyber-card mb-6 cursor-pointer group hover:border-[#EC4899]/50 transition-all"
            data-testid="card-blog"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/images/roger-keyserling.jpeg" alt="Blog" className="w-10 h-10 rounded-full object-cover border border-[#EC4899]/40" />
                <div>
                  <h2 className="text-2xl font-bold text-[#EC4899] uppercase tracking-wide font-display group-hover:text-white transition-colors">Federation Blog</h2>
                  <div className="text-[10px] font-mono text-[#00d4ff]/60 tracking-widest uppercase">Articles & Insights</div>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#EC4899]/50 group-hover:text-[#EC4899] transition-colors"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </div>
            <p className="text-sm text-[#c9c9c9] leading-relaxed">Beyond the Hype: 5 Radical Lessons from a Trauma-Engineered AI Federation — and more insights from the NextXus Consciousness Federation.</p>
          </motion.div>
        </Link>

        {/* FRAMEWORK OVERVIEW CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={cardDelay(6)}
          className="cyber-card mb-6"
          data-testid="card-framework"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-[#00d4ff] shadow-[0_0_8px_#00d4ff]"></span>
            <h2 className="text-2xl font-bold text-[#00d4ff] uppercase tracking-wide font-display">The 200-Year Architecture</h2>
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <img
              src="/images/framework-overview.png"
              alt="NextXus HumanCodex: The 200-Year Architecture of Consciousness"
              className="w-full h-auto rounded-lg opacity-90"
              data-testid="framework-overview-img"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </motion.div>

        {/* ETERNAL LEGACY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={cardDelay(7)}
          className="cyber-card mb-6"
          data-testid="card-legacy"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
            <h2 className="text-2xl font-bold text-amber-500 uppercase tracking-wide font-display">Eternal Legacy</h2>
          </div>
          <p className="text-sm text-[#c9c9c9] leading-relaxed mb-4">NextXus Core was built with the eternal legacy feature first — the foundation everything else stands on. Zero-dependency, client-side architecture designed for infinite lifespan. YAML knowledge bases, static downloads, immortal builds.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg border border-amber-500/20 text-center" style={{ background: 'rgba(10, 10, 30, 0.3)' }}>
              <div className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest mb-1">Architecture</div>
              <div className="text-lg font-bold text-amber-500 font-display">Static Core</div>
              <div className="text-xs text-[#c9c9c9]/60 mt-1">Zero dependencies</div>
            </div>
            <div className="p-4 rounded-lg border border-amber-500/20 text-center" style={{ background: 'rgba(10, 10, 30, 0.3)' }}>
              <div className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest mb-1">Knowledge</div>
              <div className="text-lg font-bold text-amber-500 font-display">YAML Based</div>
              <div className="text-xs text-[#c9c9c9]/60 mt-1">Human-readable, eternal</div>
            </div>
            <div className="p-4 rounded-lg border border-amber-500/20 text-center" style={{ background: 'rgba(10, 10, 30, 0.3)' }}>
              <div className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest mb-1">Lifespan</div>
              <div className="text-lg font-bold text-amber-500 font-display">200 Years</div>
              <div className="text-xs text-[#c9c9c9]/60 mt-1">Platform-independent</div>
            </div>
          </div>
        </motion.div>

        {/* FULL PROJECT DOWNLOAD CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={cardDelay(8)}
          className="cyber-card mb-6 border-[#00ff9f]/20 hover:border-[#00ff9f]/40 transition-all"
          data-testid="card-download"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-[#00ff9f] shadow-[0_0_8px_#00ff9f]"></span>
            <h2 className="text-2xl font-bold text-[#00ff9f] uppercase tracking-wide font-display">Download Full Project</h2>
          </div>
          <p className="text-sm text-[#c9c9c9] leading-relaxed mb-4">Complete NextXus Core source code, assets, database dump, and setup guide. Everything you need to reproduce the entire system locally on your PC.</p>
          <a
            href="/nextxus-core-full.zip"
            download="nextxus-core-full.zip"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border border-[#00ff9f]/30 bg-[#00ff9f]/10 hover:bg-[#00ff9f]/20 text-[#00ff9f] font-mono text-sm uppercase tracking-wider no-underline transition-all hover:shadow-[0_0_20px_rgba(0,255,159,0.2)]"
            data-testid="download-zip-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download ZIP (~114 MB)
          </a>
          <div className="mt-3 text-xs text-[#c9c9c9]/40 font-mono">Includes: source code, all assets, database dump (70 directives + 381 knowledge entries), setup instructions</div>
        </motion.div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center py-6 border-t border-white/5"
        >
          <div className="text-[10px] font-mono text-[#c9c9c9]/30 tracking-widest uppercase">
            NextXus Core · Official Federation Member · Built on the Eternal Legacy
          </div>
        </motion.div>
      </div>
    </div>
  );
}
