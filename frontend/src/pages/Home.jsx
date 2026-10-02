import React, { useState } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, ChevronDown, Code2, Database, FileBarChart, FileCode2, GitBranch, Leaf, Menu, Play, Sparkles, X, Zap } from "lucide-react";

/*
  HOME PAGE IMAGES
  Place generated/approved assets in: frontend/public/images/home/

  hero-green-code.png       -> Hero visual
  github-analysis.png      -> How It Works visual
  carbon-dashboard.png     -> Insights Dashboard visual
  sustainability-score.png -> Sustainability Score visual
*/

const IMG = {
  hero: "/images/home/hero-green-code.png",
  github: "/images/home/github-analysis.png",
  dashboard: "/images/home/carbon-dashboard.png",
  score: "/images/home/sustainability-score.png",
};

const Visual = ({ src, alt, label, className = "", loading = "lazy" }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-[#0b1728] ${className}`}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle,rgba(16,185,129,.14),transparent_62%)]">
          <div className="px-6 text-center text-emerald-300/60">
            <Leaf className="mx-auto mb-2" size={34} aria-hidden="true" />
            <p className="text-[11px] font-semibold uppercase tracking-[.2em]">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Reveal = ({ children, className = "", delay = 0 }) => (
  <m.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </m.div>
);

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-[#071021]"><Leaf size={19} /></span>
    <span className="text-lg font-bold text-white">Carbon<span className="text-emerald-400">Wise</span></span>
  </Link>
);

const Heading = ({ eyebrow, title, text }) => (
  <div className="mx-auto max-w-3xl text-center">
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.18em] text-emerald-300"><Sparkles size={13} />{eyebrow}</span>
    <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
    <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">{text}</p>
  </div>
);

const Step = ({ n, icon: Icon, title, text }) => (
  <m.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.55 }}
    whileHover={{ y: -6 }}
    whileTap={{ scale: 0.99 }}
    className="rounded-3xl border border-white/8 bg-[#0b1728]/75 p-5 sm:p-6 transition hover:border-emerald-400/30"
  >
    <div className="flex items-center justify-between">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><Icon size={20} /></span>
      <span className="text-4xl font-black text-white/5">{n}</span>
    </div>
    <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
  </m.div>
);

const Feature = ({ icon: Icon, title, text }) => (
  <m.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.55 }}
    whileHover={{ y: -6 }}
    whileTap={{ scale: 0.99 }}
    className="rounded-3xl border border-white/8 bg-[#0b1728]/70 p-5 sm:p-6 transition hover:border-emerald-400/25"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><Icon size={20} /></span>
    <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
  </m.div>
);

const FAQ = ({ q, a }) => (
  <details className="group rounded-2xl border border-white/8 bg-[#0b1728]/70 px-5 py-4">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white">{q}<ChevronDown size={18} className="text-emerald-400 transition group-open:rotate-180" /></summary>
    <p className="mt-3 pr-6 text-sm leading-6 text-slate-400">{a}</p>
  </details>
);

export default function Home() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen scroll-smooth overflow-x-hidden bg-[#071021] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10"><div className="absolute left-[-12%] top-[-10%] h-96 w-96 rounded-full bg-emerald-500/8 blur-[120px]" /><div className="absolute right-[-12%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[140px]" /></div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#071021]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8"><Logo />
          <nav className="hidden gap-7 md:flex"><a href="#how-it-works" className="text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60">How It Works</a><a href="#features" className="text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60">Features</a><a href="#insights" className="text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60">Insights</a><a href="#faq" className="text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60">FAQ</a></nav>
          <div className="hidden items-center gap-2 md:flex"><Link to="/login" className="rounded-xl px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">Login</Link><Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-bold text-[#071021] hover:bg-emerald-300">Get Started<ArrowRight size={15}/></Link></div>
          <button type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation" className="rounded-xl border border-white/10 p-2 md:hidden">{open ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
        {open && <div id="mobile-navigation" className="border-t border-white/5 bg-[#071021] px-5 py-4 md:hidden"><div className="flex flex-col gap-2"><a onClick={close} href="#how-it-works" className="rounded-xl p-3 text-sm text-slate-300">How It Works</a><a onClick={close} href="#features" className="rounded-xl p-3 text-sm text-slate-300">Features</a><a onClick={close} href="#insights" className="rounded-xl p-3 text-sm text-slate-300">Insights</a><a onClick={close} href="#faq" className="rounded-xl p-3 text-sm text-slate-300">FAQ</a><div className="mt-2 grid grid-cols-2 gap-2"><Link onClick={close} to="/login" className="rounded-xl border border-white/10 p-3 text-center text-sm">Login</Link><Link onClick={close} to="/register" className="rounded-xl bg-emerald-400 p-3 text-center text-sm font-bold text-[#071021]">Get Started</Link></div></div></div>}
      </header>

      <main>
        {/* HERO - IMAGE: hero-green-code.png */}
        <m.section
          className="relative"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:gap-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.02fr_.98fr] lg:gap-16 lg:pb-28 lg:pt-24">
            {/* LEFT */}
            <m.div
              variants={{
                hidden: { opacity: 0, x: -24 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3.5 py-2 text-xs font-semibold text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>Green Software Intelligence Platform</span>
              <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Build Better Software.<span className="block text-emerald-400">Build a Greener Future.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">CarbonWise analyzes GitHub repositories to estimate software energy and carbon impact, understand sustainability signals, and provide AI-powered recommendations for improvement.</p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <m.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/register" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-[#071021] hover:bg-emerald-300 sm:w-auto">Analyze Your Repository<ArrowRight size={17}/></Link>
                </m.div>
                <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold"><Play size={16}/>See How It Works</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400"/>GitHub-based analysis</span><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400"/>AI-powered insights</span><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400"/>Sustainability reports</span></div>
            </m.div>

            {/* RIGHT */}
            <m.div
              className="relative"
              variants={{
                hidden: { opacity: 0, x: 24 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
              }}
            >
              <div className="absolute -inset-6 rounded-[3rem] bg-emerald-400/5 blur-3xl"/>
              <m.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Visual src={IMG.hero} alt="Green software code visualization" label="Hero visual" className="relative min-h-[300px] sm:min-h-[500px]" loading="eager"/>
              </m.div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-[#071021]/90 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold text-emerald-300"><Code2 size={14}/>Repository analyzed</p>
                    <p className="mt-1 text-sm">Example repository</p>
                  </div>
                  <div className="rounded-xl bg-emerald-400/10 px-3 py-2 text-right">
                    <p className="text-[10px] text-slate-500">EXAMPLE SCORE</p>
                    <p className="text-lg font-bold text-emerald-300">82/100</p>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </m.section>

        {/* WHY */}
        <section className="border-y border-white/5 bg-[#081426] py-20 sm:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-8"><Heading eyebrow="Why CarbonWise?" title="Software has an environmental footprint too." text="Modern applications depend on computing resources, data transfer and infrastructure. CarbonWise helps developers understand these sustainability signals and identify areas where software can be improved."/><div className="mt-12 grid gap-5 md:grid-cols-3"><Feature icon={BarChart3} title="Measure" text="Estimate energy use and carbon impact from repository and software characteristics."/><Feature icon={BrainCircuit} title="Analyze" text="Turn repository structure, dependencies and project signals into understandable sustainability insights."/><Feature icon={Sparkles} title="Improve" text="Use AI-powered recommendations to identify practical opportunities for greener software."/></div></div></section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-8"><Heading eyebrow="How It Works" title="From GitHub repository to sustainability insight." text="Connect a repository, analyze its software signals, estimate impact, and turn the results into practical insights."/><div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5"><Step n="01" icon={GitBranch} title="Connect GitHub" text="Connect your GitHub account and access repositories for analysis."/><Step n="02" icon={FileCode2} title="Select Repository" text="Choose the repository you want CarbonWise to analyze."/><Step n="03" icon={Code2} title="Analyze Code" text="Examine project structure, files, dependencies and repository signals."/><Step n="04" icon={Zap} title="Estimate Impact" text="Generate estimated energy, carbon and sustainability metrics."/><Step n="05" icon={BrainCircuit} title="Get AI Insights" text="Receive AI-generated recommendations for improvement."/></div><div className="mt-12 grid gap-6 lg:grid-cols-[.9fr_1.1fr]"><Visual src={IMG.github} alt="GitHub analysis flow" label="GitHub flow visual" className="min-h-[270px] sm:min-h-[340px]"/><div className="flex flex-col justify-center rounded-3xl border border-white/8 bg-[#0b1728]/70 p-7 sm:p-9"><GitBranch size={23} className="text-emerald-300"/><h3 className="mt-6 text-2xl font-bold">Your repository is the starting point.</h3><p className="mt-4 text-sm leading-7 text-slate-400">CarbonWise follows the developer workflow: connect a repository, understand what is inside it, estimate sustainability impact, and use insights to improve the project.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{["Repository metadata","Programming languages","Dependencies","Project metrics"].map(x=><div key={x} className="flex items-center gap-2 rounded-xl border border-white/7 bg-white/[.025] p-3 text-xs text-slate-300"><CheckCircle2 size={14} className="text-emerald-400"/>{x}</div>)}</div></div></div></div></section>

        {/* FEATURES */}
        <section id="features" className="scroll-mt-20 border-y border-white/5 bg-[#081426] py-20 sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-8"><Heading eyebrow="Platform Features" title="Everything you need to understand software sustainability." text="A single platform for repository analysis, carbon estimation, sustainability scoring, AI recommendations and reporting."/><div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Feature icon={GitBranch} title="GitHub Repository Analysis" text="Connect and analyze repositories using project-level software signals."/><Feature icon={Database} title="Dependency Analysis" text="Understand project dependencies and the signals they contribute to analysis."/><Feature icon={Zap} title="Energy & Carbon Estimation" text="View estimated energy consumption and carbon impact in an understandable format."/><Feature icon={Leaf} title="Sustainability Score" text="Summarize multiple analysis signals into a simple sustainability score."/><Feature icon={BrainCircuit} title="AI Recommendations" text="Get contextual suggestions designed to help developers improve software efficiency."/><Feature icon={FileBarChart} title="Reports & Analytics" text="Track results through dashboards and generate sustainability-focused reports."/></div></div></section>

        {/* DASHBOARD */}
        <section id="insights" className="scroll-mt-20 border-y border-white/5 bg-[#081426] py-20 sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-8"><Heading eyebrow="Insights Dashboard" title="See the sustainability picture at a glance." text="Key project metrics are brought together so developers can quickly understand repository sustainability signals."/><div className="mt-12 rounded-[2rem] border border-emerald-400/15 bg-[#0b1728] p-2"><Visual src={IMG.dashboard} alt="CarbonWise dashboard" label="Dashboard preview" className="min-h-[270px] rounded-[1.6rem] sm:min-h-[580px]"/></div><div className="mt-6 grid gap-3 sm:grid-cols-4">{[["0.42 kg","Estimated carbon*"],["1.84 kWh","Estimated energy*"],["82 / 100","Sustainability score*"],["12","Optimization insights*"]].map(([v,l])=><div key={l} className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><p className="text-2xl font-bold">{v}</p><p className="mt-1 text-xs text-slate-500">{l}</p></div>)}</div><p className="mt-4 text-center text-[11px] text-slate-600">*Illustrative landing-page values. Actual results depend on the analyzed repository and estimation methodology.</p></div></section>

        {/* SCORE */}
        <section className="border-y border-white/5 bg-[#081426] py-20 sm:py-28"><div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-2"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-emerald-300"><Leaf size={15}/>Sustainability intelligence</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Make complex sustainability signals easier to understand.</h2><p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">A simple score can summarize multiple analysis signals without replacing the underlying metrics. Explore the details behind the score and use the insights to guide improvements.</p><div className="mt-8 flex items-center gap-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-5"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071021] text-xl font-bold text-emerald-300">82</span><div><p className="font-semibold">Sustainability Score</p><p className="mt-1 text-xs text-slate-500">Illustrative landing-page value.</p></div></div></div><Visual src={IMG.score} alt="Sustainability score" label="Score visual" className="min-h-[300px] sm:min-h-[390px]"/></div></section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-white/5 bg-[#081426] py-20 sm:py-28"><div className="mx-auto max-w-4xl px-4 sm:px-8"><Heading eyebrow="FAQ" title="Questions about CarbonWise?" text="A quick overview of what the platform is designed to do."/><div className="mt-12 space-y-3"><FAQ q="What is CarbonWise?" a="CarbonWise is a green software intelligence platform that analyzes GitHub repositories and presents estimated energy, carbon and sustainability insights with AI-powered recommendations."/><FAQ q="Does CarbonWise measure actual carbon emissions?" a="CarbonWise provides estimated impact based on available repository and software analysis signals. Results should be interpreted as estimates rather than direct measurement of physical emissions."/><FAQ q="What does CarbonWise analyze?" a="The platform can analyze repository information, project structure, programming-language signals, dependencies and other software characteristics used by the project's methodology."/><FAQ q="How does the AI module help?" a="The AI module converts analysis results into readable recommendations and possible optimization opportunities for developers."/><FAQ q="Can I generate reports?" a="Yes. CarbonWise includes reporting and analytics areas designed to present sustainability analysis in a structured format."/><FAQ q="Who is CarbonWise for?" a="It is designed for developers, engineering teams, students, researchers and organizations interested in understanding software sustainability."/></div></div></section>

        {/* CTA */}
        <section className="py-20 sm:py-28"><div className="mx-auto max-w-5xl px-4 sm:px-8"><div className="relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-[#0b1728] to-[#0b1728] p-8 text-center sm:p-12"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-[#071021]"><Leaf size={27}/></span><h2 className="mt-6 text-3xl font-bold sm:text-4xl">Ready to understand your software's footprint?</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">Connect a GitHub repository and explore what CarbonWise can tell you about its sustainability signals.</p><m.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="mt-7 inline-block">
              <Link to="/register" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-bold text-[#071021] hover:bg-emerald-300 sm:w-auto">Get Started with CarbonWise<ArrowRight size={17}/></Link>
            </m.div></div></div></section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#050c18]"><div className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between"><div><Logo/><p className="mt-3 max-w-md text-xs leading-5 text-slate-500">Green Software Intelligence for understanding, analyzing and improving software sustainability.</p></div><div className="flex flex-wrap gap-5 text-xs text-slate-500"><Link to="/privacy" className="hover:text-white">Privacy Policy</Link><Link to="/terms" className="hover:text-white">Terms of Service</Link><Link to="/login" className="hover:text-white">Login</Link><Link to="/register" className="hover:text-white">Register</Link></div></div><div className="mt-8 border-t border-white/5 pt-6 text-xs text-slate-600">© {new Date().getFullYear()} CarbonWise. Built for greener software.</div></div></footer>
    </div>
    </LazyMotion>
  );
}
