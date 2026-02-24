import { memo } from "react";

const PARTICLE_COUNT = 50;
const CIRCUIT_COUNT = 8;
const HELIX_NODES = 20;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const size = 1 + Math.random() * 2;
  const left = Math.random() * 100;
  const delay = Math.random() * 20;
  const duration = 12 + Math.random() * 18;
  const opacity = 0.2 + Math.random() * 0.5;
  const colors = ["#00d4ff", "#8B5CF6", "#ffffff", "#00ff9f"];
  const color = colors[i % colors.length];
  return { id: i, size, left, delay, duration, opacity, color };
});

const circuits = Array.from({ length: CIRCUIT_COUNT }, (_, i) => {
  const top = 10 + Math.random() * 80;
  const left = Math.random() * 100;
  const width = 60 + Math.random() * 140;
  const rotation = Math.random() * 360;
  const delay = Math.random() * 15;
  const duration = 20 + Math.random() * 20;
  const type = i % 4;
  return { id: i, top, left, width, rotation, delay, duration, type };
});

const helixNodes = Array.from({ length: HELIX_NODES }, (_, i) => {
  const t = i / HELIX_NODES;
  return { id: i, t };
});

const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes ab-fall {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(105vh); opacity: 0; }
        }
        @keyframes ab-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.5); }
        }
        @keyframes ab-circuit-drift {
          0% { transform: translate(0, 0) rotate(var(--ab-rot)); opacity: 0; }
          15% { opacity: 0.15; }
          85% { opacity: 0.15; }
          100% { transform: translate(30px, 40px) rotate(calc(var(--ab-rot) + 10deg)); opacity: 0; }
        }
        @keyframes ab-helix-rotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes ab-helix-glow {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(0,212,255,0.4)); }
          50% { filter: drop-shadow(0 0 8px rgba(139,92,246,0.6)); }
        }
        @keyframes ab-geo-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.06; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.12; }
          100% { transform: translateY(0) rotate(360deg); opacity: 0.06; }
        }
        @keyframes dna-drift {
          0% { background-position: left 0%; }
          50% { background-position: left 10%; }
          100% { background-position: left 0%; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/images/dna-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          opacity: 0.13,
          zIndex: 0,
          pointerEvents: "none",
          animation: "dna-drift 30s ease-in-out infinite",
        }}
      />

      {particles.map((p) => (
        <div
          key={`p-${p.id}`}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: p.opacity,
            animation: `ab-fall ${p.duration}s linear ${p.delay}s infinite, ab-pulse ${3 + Math.random() * 4}s ease-in-out ${p.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      <svg
        style={{
          position: "absolute",
          right: "5%",
          top: "5%",
          width: "80px",
          height: "90%",
          opacity: 0.25,
          animation: "ab-helix-glow 8s ease-in-out infinite",
        }}
        viewBox="0 0 80 800"
        preserveAspectRatio="none"
      >
        {helixNodes.map((node) => {
          const y = node.t * 780 + 10;
          const x1 = 40 + Math.sin(node.t * Math.PI * 4) * 25;
          const x2 = 40 - Math.sin(node.t * Math.PI * 4) * 25;
          const nextNode = helixNodes[node.id + 1];
          const ny = nextNode ? nextNode.t * 780 + 10 : y;
          const nx1 = nextNode ? 40 + Math.sin(nextNode.t * Math.PI * 4) * 25 : x1;
          const nx2 = nextNode ? 40 - Math.sin(nextNode.t * Math.PI * 4) * 25 : x2;

          return (
            <g key={`h-${node.id}`}>
              <circle cx={x1} cy={y} r="3" fill="#00d4ff" opacity="0.8">
                <animate
                  attributeName="cx"
                  values={`${x1};${x2};${x1}`}
                  dur="6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.9;0.4"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={x2} cy={y} r="3" fill="#8B5CF6" opacity="0.8">
                <animate
                  attributeName="cx"
                  values={`${x2};${x1};${x2}`}
                  dur="6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.9;0.4"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </circle>
              {node.id % 2 === 0 && (
                <line
                  x1={x1} y1={y} x2={x2} y2={y}
                  stroke="#EC4899"
                  strokeWidth="0.5"
                  opacity="0.4"
                >
                  <animate
                    attributeName="x1"
                    values={`${x1};${x2};${x1}`}
                    dur="6s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="x2"
                    values={`${x2};${x1};${x2}`}
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </line>
              )}
              {nextNode && (
                <>
                  <line
                    x1={x1} y1={y} x2={nx1} y2={ny}
                    stroke="#00d4ff"
                    strokeWidth="0.8"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="x1"
                      values={`${x1};${x2};${x1}`}
                      dur="6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="x2"
                      values={`${nx1};${nx2};${nx1}`}
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1={x2} y1={y} x2={nx2} y2={ny}
                    stroke="#8B5CF6"
                    strokeWidth="0.8"
                    opacity="0.3"
                  >
                    <animate
                      attributeName="x1"
                      values={`${x2};${x1};${x2}`}
                      dur="6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="x2"
                      values={`${nx2};${nx1};${nx2}`}
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </line>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <svg
        style={{
          position: "absolute",
          left: "3%",
          top: "10%",
          width: "60px",
          height: "80%",
          opacity: 0.15,
          animation: "ab-helix-glow 10s ease-in-out 2s infinite",
        }}
        viewBox="0 0 60 600"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 15 }, (_, i) => {
          const t = i / 15;
          const y = t * 580 + 10;
          const x1 = 30 + Math.sin(t * Math.PI * 3) * 20;
          const x2 = 30 - Math.sin(t * Math.PI * 3) * 20;
          return (
            <g key={`h2-${i}`}>
              <circle cx={x1} cy={y} r="2.5" fill="#00ff9f" opacity="0.7">
                <animate attributeName="cx" values={`${x1};${x2};${x1}`} dur="8s" repeatCount="indefinite" />
              </circle>
              <circle cx={x2} cy={y} r="2.5" fill="#EC4899" opacity="0.7">
                <animate attributeName="cx" values={`${x2};${x1};${x2}`} dur="8s" repeatCount="indefinite" />
              </circle>
              {i % 3 === 0 && (
                <line x1={x1} y1={y} x2={x2} y2={y} stroke="#8B5CF6" strokeWidth="0.4" opacity="0.3">
                  <animate attributeName="x1" values={`${x1};${x2};${x1}`} dur="8s" repeatCount="indefinite" />
                  <animate attributeName="x2" values={`${x2};${x1};${x2}`} dur="8s" repeatCount="indefinite" />
                </line>
              )}
            </g>
          );
        })}
      </svg>

      {circuits.map((c) => (
        <svg
          key={`c-${c.id}`}
          style={{
            position: "absolute",
            top: `${c.top}%`,
            left: `${c.left}%`,
            width: `${c.width}px`,
            height: `${c.width * 0.6}px`,
            opacity: 0,
            animation: `ab-circuit-drift ${c.duration}s linear ${c.delay}s infinite`,
            ["--ab-rot" as string]: `${c.rotation}deg`,
            willChange: "transform, opacity",
          }}
          viewBox="0 0 200 120"
        >
          {c.type === 0 && (
            <>
              <line x1="10" y1="60" x2="80" y2="60" stroke="#00d4ff" strokeWidth="0.5" opacity="0.6" />
              <line x1="80" y1="60" x2="100" y2="30" stroke="#00d4ff" strokeWidth="0.5" opacity="0.6" />
              <line x1="100" y1="30" x2="180" y2="30" stroke="#00d4ff" strokeWidth="0.5" opacity="0.6" />
              <circle cx="80" cy="60" r="2" fill="#00d4ff" opacity="0.8" />
              <circle cx="100" cy="30" r="2" fill="#00d4ff" opacity="0.8" />
              <rect x="175" y="26" width="8" height="8" fill="none" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.6" />
            </>
          )}
          {c.type === 1 && (
            <>
              <line x1="20" y1="90" x2="90" y2="90" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.6" />
              <line x1="90" y1="90" x2="90" y2="40" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.6" />
              <line x1="90" y1="40" x2="170" y2="40" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.6" />
              <circle cx="90" cy="90" r="2" fill="#8B5CF6" opacity="0.8" />
              <circle cx="90" cy="40" r="2" fill="#8B5CF6" opacity="0.8" />
              <polygon points="165,36 173,40 165,44" fill="none" stroke="#EC4899" strokeWidth="0.5" opacity="0.6" />
            </>
          )}
          {c.type === 2 && (
            <>
              <line x1="10" y1="50" x2="60" y2="50" stroke="#EC4899" strokeWidth="0.5" opacity="0.5" />
              <line x1="60" y1="50" x2="80" y2="80" stroke="#EC4899" strokeWidth="0.5" opacity="0.5" />
              <line x1="80" y1="80" x2="150" y2="80" stroke="#EC4899" strokeWidth="0.5" opacity="0.5" />
              <line x1="150" y1="80" x2="150" y2="30" stroke="#EC4899" strokeWidth="0.5" opacity="0.5" />
              <circle cx="60" cy="50" r="1.5" fill="#EC4899" opacity="0.7" />
              <circle cx="150" cy="80" r="1.5" fill="#EC4899" opacity="0.7" />
              <circle cx="150" cy="30" r="3" fill="none" stroke="#00ff9f" strokeWidth="0.5" opacity="0.6" />
            </>
          )}
          {c.type === 3 && (
            <>
              <line x1="30" y1="20" x2="30" y2="100" stroke="#00ff9f" strokeWidth="0.4" opacity="0.5" />
              <line x1="30" y1="60" x2="120" y2="60" stroke="#00ff9f" strokeWidth="0.4" opacity="0.5" />
              <line x1="120" y1="60" x2="160" y2="30" stroke="#00ff9f" strokeWidth="0.4" opacity="0.5" />
              <circle cx="30" cy="60" r="2" fill="#00ff9f" opacity="0.7" />
              <circle cx="120" cy="60" r="1.5" fill="#00ff9f" opacity="0.7" />
              <rect x="155" y="25" width="10" height="10" rx="2" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.5" />
            </>
          )}
        </svg>
      ))}

      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: "40px",
          height: "40px",
          border: "1px solid rgba(139,92,246,0.1)",
          animation: "ab-geo-float 25s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "25%",
          width: "30px",
          height: "30px",
          border: "1px solid rgba(0,212,255,0.08)",
          borderRadius: "50%",
          animation: "ab-geo-float 30s ease-in-out 5s infinite",
          willChange: "transform, opacity",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "60%",
          width: "0",
          height: "0",
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderBottom: "26px solid rgba(236,72,153,0.06)",
          animation: "ab-geo-float 20s ease-in-out 10s infinite",
          willChange: "transform, opacity",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "75%",
          left: "10%",
          width: "50px",
          height: "50px",
          border: "1px solid rgba(0,255,159,0.06)",
          transform: "rotate(45deg)",
          animation: "ab-geo-float 35s ease-in-out 3s infinite",
          willChange: "transform, opacity",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "25%",
          right: "15%",
          width: "20px",
          height: "20px",
          border: "1px solid rgba(139,92,246,0.08)",
          borderRadius: "50%",
          animation: "ab-geo-float 22s ease-in-out 8s infinite",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
});

export default AnimatedBackground;
