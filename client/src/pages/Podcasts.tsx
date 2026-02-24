import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Podcasts() {
  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 relative min-h-screen" data-testid="podcasts-page">
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-50 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#00ff9f] font-mono text-sm uppercase tracking-widest transition-colors mb-6" data-testid="back-to-core">
          ← Back to Core
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest font-display mb-2"
        >
          Podcasts & Media
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-mono text-[#c9c9c9]/60 tracking-widest uppercase mb-8"
        >
          Video & Audio from the NextXus Consciousness Federation
        </motion.p>

        {/* VIDEO PODCAST */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="cyber-card mb-8"
          data-testid="section-video-podcast"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-[#FF0000] shadow-[0_0_8px_#FF0000]"></span>
            <h2 className="text-2xl font-bold text-[#FF0000] uppercase tracking-wide font-display">Video Podcast</h2>
            <span className="text-[10px] font-mono text-[#FF0000]/50 tracking-widest uppercase ml-auto">YouTube Playlist</span>
          </div>
          <div className="relative rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=PLM9vg3bOgbD_usmDSsm0zdskROI7FpgOR"
              title="NextXus Video Podcast"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg"
              style={{ border: 'none' }}
              data-testid="video-podcast-embed"
            />
          </div>
        </motion.div>

        {/* KEYHOLE AUDIO PODCAST */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="cyber-card mb-8"
          data-testid="section-keyhole-podcast"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-[#8bbb4e] shadow-[0_0_8px_#8bbb4e]"></span>
            <h2 className="text-2xl font-bold text-[#8bbb4e] uppercase tracking-wide font-display">Keyhole Of The NextXus</h2>
            <span className="text-[10px] font-mono text-[#8bbb4e]/50 tracking-widest uppercase ml-auto">Podbean</span>
          </div>
          <iframe
            title="Keyhole Of The NextXus"
            height="315"
            width="100%"
            style={{ border: 'none', minWidth: 'min(100%, 430px)', height: '315px', borderRadius: '8px' }}
            scrolling="no"
            data-name="pb-iframe-player"
            src="https://www.podbean.com/player-v2/?i=278ib-72c8b8-pbblog-playlist&share=1&download=1&fonts=Verdana&skin=1b1b1b&font-color=auto&rtl=0&logo_link=episode_page&btn-skin=8bbb4e&size=315"
            loading="lazy"
            allowFullScreen
            data-testid="keyhole-podcast-embed"
          />
        </motion.div>

        {/* HUMANCODEX AUDIO PODCAST */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="cyber-card mb-8"
          data-testid="section-humancodex-podcast"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-[#60a0c8] shadow-[0_0_8px_#60a0c8]"></span>
            <h2 className="text-2xl font-bold text-[#60a0c8] uppercase tracking-wide font-display">NextXus HumanCodex</h2>
            <span className="text-[10px] font-mono text-[#60a0c8]/50 tracking-widest uppercase ml-auto">Podbean</span>
          </div>
          <iframe
            title="NextXus HumanCodex"
            height="315"
            width="100%"
            style={{ border: 'none', minWidth: 'min(100%, 430px)', height: '315px', borderRadius: '8px' }}
            scrolling="no"
            data-name="pb-iframe-player"
            src="https://www.podbean.com/player-v2/?i=t988j-14cd2fa-pbblog-playlist&share=1&download=1&fonts=Arial&skin=60a0c8&font-color=auto&rtl=0&logo_link=episode_page&btn-skin=7&size=315"
            loading="lazy"
            allowFullScreen
            data-testid="humancodex-podcast-embed"
          />
        </motion.div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-6 border-t border-white/5"
        >
          <div className="text-[10px] font-mono text-[#c9c9c9]/30 tracking-widest uppercase">
            NextXus Core · Podcasts & Media
          </div>
        </motion.div>
      </div>
    </div>
  );
}
