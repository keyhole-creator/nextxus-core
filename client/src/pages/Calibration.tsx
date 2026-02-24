import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

const radarData = [
  { subject: "Logic (Primary)", A: 0.95, fullMark: 1 },
  { subject: "Empathy", A: 0.9, fullMark: 1 },
  { subject: "Action", A: 0.93, fullMark: 1 },
  { subject: "Logic (Secondary)", A: 0.95, fullMark: 1 },
];

const truthGateData = [
  { name: "Truth Gate", value: 95, fill: "#00ff9f" },
];

const metrics = [
  { name: "truth-gate", label: "Truth Gate", value: "95%", color: "#00ff9f", hasRadial: true },
  { name: "agent-zero", label: "Agent Zero Status", value: "ONLINE", color: "#00ff9f", dot: true },
  { name: "uptime", label: "System Uptime", value: "Active", color: "#38bdf8" },
  { name: "neural-link", label: "Neural Link", value: "Connected", color: "#8B5CF6" },
];

export default function Calibration() {
  return (
    <div
      className="max-w-[1400px] mx-auto p-6 md:p-8 relative min-h-screen"
      data-testid="calibration-page"
    >
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-50 z-0"></div>
      <div className="scanline"></div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#00d4ff] hover:text-[#00ff9f] font-mono text-sm uppercase tracking-widest transition-colors"
            data-testid="link-back-core"
          >
            ← Back to Core
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-center my-8 uppercase tracking-widest font-display"
          style={{ color: "#38bdf8" }}
        >
          CALIBRATION SCALE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl font-bold text-center mb-8 p-3 rounded-xl uppercase tracking-wider font-display border-[2px] border-[#00ff9f]/50 text-[#00ff9f] bg-[#00ff9f]/5 backdrop-blur-md relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-[#00ff9f]/10"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="inline-block w-4 h-4 rounded-full bg-[#00ff9f] shadow-[0_0_10px_#00ff9f] animate-pulse"></span>
            AGENT ZERO: TRUTH VERIFIED — GATE ACTIVE
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="cyber-card p-6 mb-8"
          data-testid="calibration-chart"
          style={{ minHeight: "500px" }}
        >
          <h2
            className="text-lg font-mono uppercase tracking-wider mb-4 text-center"
            style={{ color: "#38bdf8" }}
          >
            Neural Calibration Matrix
          </h2>
          <ResponsiveContainer width="100%" height={460}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
              <PolarGrid stroke="rgba(56, 189, 248, 0.2)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#38bdf8", fontSize: 14, fontFamily: "monospace" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 1]}
                tick={{ fill: "#666", fontSize: 11 }}
                tickCount={5}
              />
              <Radar
                name="Calibration"
                dataKey="A"
                stroke="#00ff9f"
                fill="#00ff9f"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              className="rounded-xl border border-white/10 p-5 text-center"
              style={{
                background: "rgba(10, 10, 30, 0.4)",
                backdropFilter: "blur(8px)",
              }}
              data-testid={`calibration-metric-${metric.name}`}
            >
              <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-3">
                {metric.label}
              </div>
              {metric.hasRadial ? (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={truthGateData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          dataKey="value"
                          cornerRadius={10}
                          background={{ fill: "rgba(255,255,255,0.05)" }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div
                    className="text-2xl font-black font-mono mt-1"
                    style={{ color: metric.color }}
                  >
                    {metric.value}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {metric.dot && (
                    <span
                      className="inline-block w-3 h-3 rounded-full animate-pulse"
                      style={{
                        backgroundColor: metric.color,
                        boxShadow: `0 0 8px ${metric.color}`,
                      }}
                    ></span>
                  )}
                  <span
                    className="text-2xl font-black font-mono"
                    style={{ color: metric.color }}
                  >
                    {metric.value}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
