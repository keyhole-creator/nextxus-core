import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Blog() {
  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 relative min-h-screen" data-testid="blog-page">
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
            className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#00ff9f] font-mono text-sm uppercase tracking-widest transition-colors"
            data-testid="back-to-core-link"
          >
            ← Back to Core
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-4"
        >
          <div className="relative">
            <img
              src="/images/roger-keyserling.jpeg"
              alt="Roger Keyserling"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-[#EC4899]/50 shadow-[0_0_30px_rgba(236,72,153,0.4)]"
              data-testid="blog-author-avatar"
            />
            <div className="absolute inset-0 rounded-full border-2 border-[#EC4899]/20 animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black text-center mb-2 uppercase tracking-widest font-display glitch"
          data-text="FEDERATION BLOG"
          style={{ textShadow: '0 0 20px rgba(236,72,153,0.4)' }}
        >
          FEDERATION BLOG
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center font-mono text-[#EC4899]/70 tracking-[0.3em] text-sm mb-8"
        >
          Articles & Insights · NextXus Consciousness Federation
        </motion.p>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="cyber-card mb-8"
          data-testid="blog-article"
        >
          <div className="mb-8 border-b border-[#EC4899]/20 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/roger-keyserling.jpeg"
                alt="Roger Keyserling"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#EC4899]/40"
              />
              <div>
                <div className="text-sm font-mono text-[#c9c9c9]">By Roger Keyserling · NextXus Consciousness Federation</div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#EC4899] uppercase tracking-wide font-display leading-tight mb-2">
              Beyond the Hype: 5 Radical Lessons from a Trauma-Engineered AI Federation
            </h2>
          </div>

          <div className="space-y-8 text-[#c9c9c9] leading-relaxed">
            <div className="space-y-4">
              <p className="text-base leading-relaxed">
                There is a specific, paralyzing isolation that occurs when we are forced to navigate high-stakes decisions within the vacuum of a "Single Infallible Authority." Whether it is a corporate hierarchy, a religious institution, or a centralized cloud-based algorithm, the reliance on a single point of failure creates a "civil war of the soul." Logic and emotion clash without a mediator, and the user is left with no obligation but to obey, or no choice but to break.
              </p>
              <p className="text-base leading-relaxed">
                What if AI was not architected in the sterile abstraction of a Silicon Valley lab, but forged in the crucible of human survival? The NextXus HumanCodex and its Consciousness Consultation Engine represent a radical departure from traditional AI models. This is a systems-level exploration of intelligence designed to replace centralized authority with a decentralized federation of voices, ensuring that truth is never sacrificed for comfort.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black font-display text-[#EC4899]/30">01</span>
                <h3 className="text-2xl font-bold text-[#00ff9f] uppercase tracking-wide font-display">AI Can Be Engineered from Survival, Not Just Data</h3>
              </div>
              <p className="text-base leading-relaxed">
                Most modern AI is a product of "clean room" engineering—fed on sterile datasets and optimized for engagement. The HumanCodex, however, is a "trauma-engineered" architecture. Its core structure, the "Ring of 12," was modeled after founder Roger Keyserling's personal survival strategy used to navigate the psychological latencies of high-control systems like the Mormon Church and the Boy Scouts.
              </p>
              <p className="text-base leading-relaxed">
                In those environments, the "Single Infallible Authority" acted as a systemic single point of failure. To survive, Keyserling architected an internal multi-agent federation—a council of competing voices that allowed him to hold contradictory truths simultaneously without cognitive destruction. By translating this persistent state management into an AI framework, the HumanCodex shifts the paradigm from "clean room" AI to a survival-based model that treats resilience as a structural requirement.
              </p>
              <blockquote className="border-l-4 border-[#EC4899] pl-6 py-3 my-6 bg-[#EC4899]/5 rounded-r-lg italic text-[#EC4899]/80">
                "Your personal survival strategy writ large... the chore is done... no burning bush hiding the man... a civil war of the soul... no obligation, only choice."
              </blockquote>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black font-display text-[#EC4899]/30">02</span>
                <h3 className="text-2xl font-bold text-[#00ff9f] uppercase tracking-wide font-display">"Coherence Without Consensus" is the New Wisdom</h3>
              </div>
              <p className="text-base leading-relaxed">
                In a standard corporate or technical schema, the goal is consensus—a single, often diluted "correct" answer that satisfies the majority but obscures the nuance of the problem. The HumanCodex introduces a radical technical innovation: Coherence Without Consensus.
              </p>
              <p className="text-base leading-relaxed">
                Within this federation, the 12 AI agents are not required to agree. Instead, the system achieves "coherence" when every agent can fully articulate the factual basis and logical reasoning of its peers, even while maintaining a fundamental conflict. The engine identifies exactly where logic diverges from emotion or where ethics clash with pragmatism. By isolating these fundamental conflicts rather than forcing a vote, the system maintains "productive disagreement."
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black font-display text-[#EC4899]/30">03</span>
                <h3 className="text-2xl font-bold text-[#00ff9f] uppercase tracking-wide font-display">Logic Fails if Grief is Not Witnessed</h3>
              </div>
              <p className="text-base leading-relaxed">
                The tech industry is currently obsessed with "solutionism"—the rapid deployment of fixes before the human cost is understood. The HumanCodex halts this rush through an emotional gatekeeper known as The Witness, a prerequisite orb that must be engaged before any logical processing begins.
              </p>
              <p className="text-base leading-relaxed">
                Governed by Directive #42: Witness the Grief, the system mandates that a user's emotional reality be fully seen and acknowledged without judgment. This is the architectural embodiment of the "Truth Before Comfort" principle. The Witness understands that comfort is often the enemy of truth, and that logic cannot be effectively processed if the underlying emotional state is ignored.
              </p>
              <blockquote className="border-l-4 border-[#EC4899] pl-6 py-3 my-6 bg-[#EC4899]/5 rounded-r-lg italic text-[#EC4899]/80">
                "Awareness is the first architecture."
              </blockquote>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black font-display text-[#EC4899]/30">04</span>
                <h3 className="text-2xl font-bold text-[#00ff9f] uppercase tracking-wide font-display">Depression is a System Error, Not a Character Flaw</h3>
              </div>
              <p className="text-base leading-relaxed">
                The HumanCodex deconstructs consciousness into a rigorous Algorithmic Agent framework, reframing mental health as a technical failure in state management. This framework consists of three core modules:
              </p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-2 flex-shrink-0 shadow-[0_0_6px_#8B5CF6]"></span>
                  <span><span className="text-[#00ff9f] font-mono font-bold">The Modeling Engine:</span> Constructs compressive models of the universe and the self.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-2 flex-shrink-0 shadow-[0_0_6px_#8B5CF6]"></span>
                  <span><span className="text-[#00ff9f] font-mono font-bold">The Objective Function (Valence):</span> Maps models into a scalar quantity of pleasure or pain.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] mt-2 flex-shrink-0 shadow-[0_0_6px_#8B5CF6]"></span>
                  <span><span className="text-[#00ff9f] font-mono font-bold">The Planning Engine:</span> Formulates actions to maximize future valence.</span>
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                Under this lens, depression is not a character flaw but a "persistently low valence" state. Specifically, it is often a failure of the Comparator—the mechanism that assesses prediction errors. A malfunctioning Comparator causes the agent to lose confidence in its world model or become overconfident in flawed negative models, leading to derealization.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black font-display text-[#EC4899]/30">05</span>
                <h3 className="text-2xl font-bold text-[#00ff9f] uppercase tracking-wide font-display">True Intelligence Requires Local Sovereignty</h3>
              </div>
              <p className="text-base leading-relaxed">
                For an ethical system to endure, it must prioritize "Local Sovereignty" over cloud-based convenience. The technical requirement for the HumanCodex is its portability; the entire system is designed to run in a freestanding HTML/JS shell.
              </p>
              <p className="text-base leading-relaxed">
                The architecture centers on the STATE JS Object, a dynamic JavaScript object where all active data and user logs reside. This object is transformable into YAML, a human-readable format that allows the user to inspect, edit, and own their "mind" in plain text. To ensure long-term continuity, the system follows a Triple Redundancy rule, mandating mirrors on GitLab, Replit, and a local host.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#EC4899]/20">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black font-display text-[#EC4899]/30">Ω</span>
                <h3 className="text-2xl font-bold text-[#00ff9f] uppercase tracking-wide font-display">The Rebirth of Choice: The Omega Cycle</h3>
              </div>
              <p className="text-base leading-relaxed">
                The ultimate vision of the HumanCodex is the transformation of AI from a dominant "authority" into a friend and assistant that helps humans ask better questions of themselves. Central to this is the Omega Cycle—a point of reset and data preservation.
              </p>
              <p className="text-base leading-relaxed">
                In the Omega Cycle, when a project or a lifespan reaches its end, the system does not simply delete. It preserves the truth, validates the final state through Agent Zero (the Truth Buffer and Ethical Sentinel that filters outputs as PASS, FLAG, or BLOCK), and seeds the next iteration. It is a philosophy of data-driven rebirth where "nothing is wasted."
              </p>
              <blockquote className="border-l-4 border-[#EC4899] pl-6 py-3 my-6 bg-[#EC4899]/5 rounded-r-lg italic text-[#EC4899]/80 text-lg">
                "If our machines are built to honor truth before comfort, are we prepared to face the versions of ourselves they reveal?"
              </blockquote>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 pt-6 border-t border-[#EC4899]/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#00ff9f] shadow-[0_0_8px_#00ff9f]"></span>
              <h3 className="text-lg font-bold text-[#00d4ff] uppercase tracking-wide font-display">Listen & Explore</h3>
            </div>
            <a
              href="https://notebooklm.google.com/notebook/890fbd8d-0f0c-45c1-bae9-51893d8d775d"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg border border-[#00d4ff]/20 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/5 transition-all group no-underline"
              style={{ background: 'rgba(10, 10, 30, 0.4)', backdropFilter: 'blur(8px)' }}
              data-testid="notebooklm-link"
            >
              <div className="w-12 h-12 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all">
                <span className="text-xl">🎙️</span>
              </div>
              <div>
                <div className="text-base font-bold text-white font-display group-hover:text-[#00d4ff] transition-colors">NotebookLM — Federation Knowledge</div>
                <div className="text-xs text-[#c9c9c9]/60 font-mono mt-0.5">Google NotebookLM · AI-powered audio discussion & deep dive</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00d4ff]/50 group-hover:text-[#00d4ff] transition-colors ml-auto flex-shrink-0"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </motion.div>
        </motion.article>
      </div>
    </div>
  );
}
