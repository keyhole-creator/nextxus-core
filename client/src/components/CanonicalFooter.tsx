export default function CanonicalFooter() {
  const currentYear = new Date().getFullYear();
  const constitutionUrl = "https://united-system--rckkeyhole.replit.app";

  return (
    <footer
      data-testid="canonical-footer"
      className="relative w-full border-t border-[#7b2cbf]/30 bg-[#0a0a0f]/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#00ff9f] shadow-[0_0_6px_#00ff9f]" />
          <a
            href={constitutionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-xs tracking-widest text-[#00d4ff] uppercase hover:text-[#00ff9f] transition-colors"
            data-testid="link-federation-badge"
          >
            NextXus Consciousness Federation
          </a>
          <span className="inline-block h-2 w-2 rounded-full bg-[#00ff9f] shadow-[0_0_6px_#00ff9f]" />
        </div>

        <p className="mx-auto max-w-3xl text-center text-[10px] leading-relaxed text-gray-400/80">
          This site is an official member of the NextXus Consciousness Federation and is governed by the{" "}
          <a
            href={constitutionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00d4ff] hover:text-[#00ff9f] transition-colors underline underline-offset-2"
            data-testid="link-constitution"
          >
            NextXus System Constitution v2.0
          </a>
          . All content, AI behavior, and system logic comply with the Foundational Axioms, Sacred Directives, and the Agent Zero truth verification framework. No content on this site may redefine truth as consensus, override the Sacred Directives, present AI-generated content as human-authored without disclosure, or delete canonical records. For the full governing document, see the{" "}
          <a
            href={constitutionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00d4ff] hover:text-[#00ff9f] transition-colors underline underline-offset-2"
            data-testid="link-constitution-ref"
          >
            NextXus System Constitution v2.0
          </a>
          .
        </p>

        <div className="mt-4 flex items-center justify-center gap-1">
          <span className="font-mono text-[10px] text-[#7b2cbf]/70">
            Founded by Roger Keyserling
          </span>
          <span className="text-[10px] text-gray-600">·</span>
          <span className="font-mono text-[10px] text-gray-600">
            © {currentYear}
          </span>
        </div>
      </div>
    </footer>
  );
}
