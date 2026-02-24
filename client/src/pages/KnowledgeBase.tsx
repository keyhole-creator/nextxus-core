import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function KnowledgeBase() {
  const [entries, setEntries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/knowledge")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        setEntries([]);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    setActiveSearch(search.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const tagCategories = [
    { label: "All", tag: "" },
    { label: "Books", tag: "yaml-book" },
    { label: "Directives", tag: "yaml-directive" },
    { label: "Entities", tag: "yaml-entity" },
    { label: "Apps", tag: "yaml-federation-app" },
    { label: "Podcasts", tag: "yaml-podcast" },
    { label: "Store", tag: "yaml-store" },
    { label: "Protocols", tag: "yaml-protocol" },
    { label: "AI Partners", tag: "yaml-ai-partner" },
  ];

  const filtered = entries.filter((entry) => {
    const matchesTag = selectedTags.length === 0 || selectedTags.some(t => entry.tags?.includes(t));
    if (!activeSearch) return matchesTag;
    const q = activeSearch.toLowerCase();
    const matchesSearch =
      entry.topic?.toLowerCase().includes(q) ||
      entry.content?.toLowerCase().includes(q) ||
      entry.tags?.some((t: string) => t.toLowerCase().includes(q));
    return matchesSearch && matchesTag;
  });

  const displayEntries = filtered.slice(0, 50);

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 relative min-h-screen" data-testid="knowledge-page">
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-50 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#00ff9f] font-mono text-sm uppercase tracking-widest transition-colors"
          data-testid="link-back-core"
        >
          ← Back to Core
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mt-6 mb-8"
        >
          <img
            src="/images/cosmic-atomic.jpeg"
            alt="Knowledge Base"
            className="w-12 h-12 rounded-full object-cover border border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest font-display" style={{ color: "#38bdf8" }}>
              KNOWLEDGE BASE
            </h1>
            <p className="text-xs font-mono text-[#38bdf8]/50 mt-1 uppercase tracking-widest">
              {entries.length} entries from the Living Library YAML Database
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask anything — e.g. 'What is Agent Zero?' or 'Ring of 12'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              data-testid="knowledge-search"
              className="flex-1 bg-black/40 border border-[#38bdf8]/30 text-[#38bdf8] placeholder-[#38bdf8]/40 px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:border-[#38bdf8]/60 transition-colors"
            />
            <button
              onClick={handleSearch}
              data-testid="knowledge-search-button"
              className="px-6 py-3 bg-[#38bdf8]/20 border border-[#38bdf8]/50 text-[#38bdf8] rounded-lg font-mono text-sm uppercase tracking-wider font-bold hover:bg-[#38bdf8]/30 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all active:scale-95"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {tagCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  if (cat.tag === "") {
                    setSelectedTags([]);
                  } else if (selectedTags.includes(cat.tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== cat.tag));
                  } else {
                    setSelectedTags([cat.tag]);
                  }
                }}
                data-testid={`filter-${cat.label.toLowerCase()}`}
                className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider border transition-all ${
                  (cat.tag === "" && selectedTags.length === 0) || selectedTags.includes(cat.tag)
                    ? "bg-[#38bdf8]/25 border-[#38bdf8]/60 text-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                    : "bg-black/20 border-[#38bdf8]/20 text-[#38bdf8]/50 hover:border-[#38bdf8]/40 hover:text-[#38bdf8]/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-[#38bdf8] font-mono text-sm uppercase tracking-widest animate-pulse">
              Loading knowledge base...
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-mono text-[#38bdf8]/50 uppercase tracking-widest">
                {activeSearch || selectedTags.length > 0
                  ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} found`
                  : `Showing ${displayEntries.length} of ${entries.length} entries — search or filter to explore`}
              </p>
              {activeSearch && (
                <button
                  onClick={() => { setSearch(""); setActiveSearch(""); }}
                  className="text-xs font-mono text-[#00ff9f]/60 hover:text-[#00ff9f] uppercase tracking-wider transition-colors"
                  data-testid="clear-search"
                >
                  Clear Search
                </button>
              )}
            </div>

            <div className="cyber-card">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {displayEntries.map((entry, idx) => (
                    <motion.div
                      key={entry.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.5), duration: 0.3 }}
                      data-testid={`knowledge-card-${idx}`}
                      className="rounded-xl border border-[#38bdf8]/20 p-5 hover:border-[#38bdf8]/40 transition-colors"
                      style={{ background: "rgba(10, 10, 30, 0.4)", backdropFilter: "blur(8px)" }}
                    >
                      <h3 className="text-base font-bold font-display uppercase tracking-wide text-[#38bdf8] mb-2 leading-tight">
                        {entry.topic}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed mb-3 line-clamp-4">
                        {entry.content}
                      </p>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.slice(0, 4).map((tag: string, tIdx: number) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filtered.length > 50 && (
                <div className="mt-6 text-center">
                  <p className="text-xs font-mono text-[#38bdf8]/40 uppercase tracking-widest">
                    Showing 50 of {filtered.length} results — refine your search to see more
                  </p>
                </div>
              )}

              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-lg font-mono text-[#38bdf8]/40 uppercase tracking-widest">
                    No results found
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try a different search term or filter
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
