import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Header } from './components/Header';
import { LiveCommunicationPage } from './components/pages/LiveCommunicationPage';
import {
  Sparkles,
  MessageSquare,
  Hand,
  Layers,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Users,
  Globe,
  Clock3,
  BadgeCheck,
  Bot,
  Mic,
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'live'>('landing');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0, scale: 0.98 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const metrics = [
    { value: '24/7', label: 'real-time support' },
    { value: '1.8s', label: 'average response time' },
    { value: '96%', label: 'translation clarity' },
  ];

  const featureCards = [
    {
      icon: MessageSquare,
      title: 'Speech-to-ISL Translation',
      description: 'Convert spoken English to clear visual sign sequences in real time.',
      tone: 'blue',
    },
    {
      icon: Hand,
      title: 'Live Sign Recognition',
      description: 'Interpret gestures from a user camera and present meaningful text output.',
      tone: 'teal',
    },
    {
      icon: ShieldCheck,
      title: 'Accessible by Design',
      description: 'Built for clarity, inclusive interaction, and dependable everyday use.',
      tone: 'indigo',
    },
  ];

  const trustPoints = [
    'Accessible communication for classrooms and services',
    'Designed for Deaf and hearing communities together',
    'Simple interface for live cross-language collaboration',
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative overflow-x-hidden flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-200/40 via-indigo-200/20 to-transparent blur-[130px] animate-ambient-1" />
        <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-teal-200/35 via-cyan-100/30 to-transparent blur-[150px] animate-ambient-2" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full bg-gradient-to-r from-blue-100/25 via-indigo-100/20 to-teal-100/20 blur-[170px]" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-blue-400/40 animate-pulse" />
          <div className="absolute top-1/2 right-1/5 w-3 h-3 rounded-full bg-teal-400/30 animate-pulse delay-700" />
          <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-indigo-400/30 animate-pulse delay-1000" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Header activeView={activeView} onViewChange={setActiveView} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 sm:py-10 flex flex-col items-center">
          {activeView === 'live' ? (
            <LiveCommunicationPage />
          ) : (
            <motion.div
              className="w-full flex flex-col items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.section
                variants={itemVariants}
                className="w-full rounded-[2rem] border border-slate-200/80 bg-white/70 backdrop-blur-xl shadow-[0_25px_80px_rgba(15,23,42,0.08)] p-6 sm:p-8 lg:p-12 overflow-hidden relative"
              >
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-100/40 via-indigo-50/20 to-transparent" />
                <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-[0.18em] uppercase shadow-xs mb-6">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                      <span>Inclusive communication</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-heading leading-[1.05] max-w-xl">
                      Breaking barriers between
                      <span className="block bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                        Deaf and hearing worlds.
                      </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
                      BeyondSilence creates real-time Indian Sign Language experiences that help people communicate clearly, confidently, and with dignity in everyday life.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => setActiveView('live')}
                        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 font-bold text-sm shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5"
                      >
                        Open live studio
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white text-slate-700 px-5 py-3.5 font-semibold text-sm shadow-sm hover:border-blue-200 hover:text-blue-700 transition-all"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Watch demo
                      </button>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-500 uppercase tracking-[0.14em]">
                      <span className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        trusted for accessibility
                      </span>
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        inclusive digital experiences
                      </span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="relative"
                  >
                    <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-4 shadow-[0_30px_60px_rgba(15,23,42,0.18)]">
                      <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-5 text-white">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                              <Bot className="w-5 h-5 text-blue-300" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold">Live translation</div>
                              <div className="text-[11px] text-slate-300">ISL communication engine</div>
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]">
                            online
                          </span>
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                            <div className="text-[10px] uppercase tracking-[0.15em] text-slate-300 mb-2">spoken input</div>
                            <div className="text-base font-medium text-white">“I need water and a seat nearby.”</div>
                          </div>

                          <div className="rounded-2xl bg-blue-500/10 border border-blue-400/30 p-4">
                            <div className="text-[10px] uppercase tracking-[0.15em] text-blue-200 mb-2">system output</div>
                            <div className="flex items-center gap-2 text-base font-medium text-blue-100">
                              <Hand className="w-4 h-4 text-blue-200" />
                              translated to ISL visual sequence
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                          {metrics.map((metric) => (
                            <div key={metric.label} className="rounded-xl bg-white/5 border border-white/10 p-3">
                              <div className="text-lg font-bold text-white">{metric.value}</div>
                              <div className="text-[9px] uppercase tracking-[0.12em] text-slate-300 mt-1">{metric.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="w-full mt-12">
                <div className="grid gap-4 md:grid-cols-3">
                  {featureCards.map(({ icon: Icon, title, description, tone }) => (
                    <motion.article
                      key={title}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-[1.75rem] border bg-white/80 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.05)] ${
                        tone === 'blue'
                          ? 'border-blue-100'
                          : tone === 'teal'
                            ? 'border-teal-100'
                            : 'border-indigo-100'
                      }`}
                    >
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                          tone === 'blue'
                            ? 'bg-blue-50 text-blue-700'
                            : tone === 'teal'
                              ? 'bg-teal-50 text-teal-700'
                              : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 font-heading">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                    </motion.article>
                  ))}
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="w-full mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-7 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold tracking-[0.18em] uppercase">
                    <Users className="w-3.5 h-3.5" />
                    Built for real life
                  </div>

                  <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
                    Designed for communities, services, and daily conversations.
                  </h2>

                  <div className="mt-6 space-y-4">
                    {trustPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
                        <CheckCircle2 className="mt-0.5 w-5 h-5 text-emerald-600 shrink-0" />
                        <p className="text-sm text-slate-700 leading-6">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-7 text-white shadow-[0_30px_70px_rgba(15,23,42,0.12)]">
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-300">workflow</div>
                      <h3 className="mt-1 text-2xl font-bold font-heading">Translation flow</h3>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-200">
                      <Clock3 className="w-3.5 h-3.5 text-blue-300" />
                      live
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                          <Mic className="w-4 h-4 text-blue-200" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Audio capture</div>
                          <div className="text-[11px] text-slate-300">Hear and recognize spoken words</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-indigo-200" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Language processing</div>
                          <div className="text-[11px] text-slate-300">Translate context to sign-ready guidance</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                          <Layers className="w-4 h-4 text-teal-200" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">ISL output</div>
                          <div className="text-[11px] text-slate-300">Visual sign sequence ready for display</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants} className="w-full mt-14 rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 p-7 sm:p-9 shadow-[0_20px_55px_rgba(59,130,246,0.08)]">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-blue-200 text-blue-700 text-[10px] font-bold tracking-[0.18em] uppercase">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      human-centered design
                    </div>
                    <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-heading">
                      Ready to build a clearer communication experience?
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveView('live')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white px-6 py-3.5 font-bold text-sm shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Launch platform
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.section>
            </motion.div>
          )}
        </main>
      </div>

      <footer className="relative z-10 border-t border-slate-200/70 bg-white/60 backdrop-blur-md py-6 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-heading">BeyondSilence</span>
            <span>•</span>
            <span>Indian Sign Language Platform</span>
          </div>

          <p className="text-slate-400 text-[11px]">Accessible • Human • Modern • Technology-focused</p>
        </div>
      </footer>
    </div>
  );
}
