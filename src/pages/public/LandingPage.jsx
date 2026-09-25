import { Link } from "react-router-dom"
import {
  Sparkles,
  FlaskConical,
  Flame,
  CheckCircle2,
  BookOpen,
  Terminal,
  Brain,
  Shield,
  Globe,
  Crosshair,
  Key,
  ChevronRight,
  Bot,
} from "lucide-react"

export function LandingPage() {
  const skillProgress = [
    { name: "Network Security", percent: 68, color: "bg-blue-600" },
    { name: "Web Security", percent: 45, color: "bg-indigo-600" },
    { name: "Linux Basics", percent: 82, color: "bg-emerald-500" },
    { name: "Cryptography", percent: 30, color: "bg-amber-500" },
  ]

  const featureCards = [
    {
      title: "Structured Courses",
      description:
        "Follow expert-designed paths covering fundamentals through advanced attack and defense techniques.",
      icon: BookOpen,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Hands-on Labs",
      description:
        "Practice in real sandboxed environments with guided objectives, flags, and skill checkpoints.",
      icon: Terminal,
      iconBg: "bg-cyan-50 text-cyan-600",
    },
    {
      title: "AI Learning Companion",
      description:
        "Get hints, concept explanations, and personalized study recommendations as you progress.",
      icon: Brain,
      iconBg: "bg-purple-50 text-purple-600",
    },
  ]

  const learningPaths = [
    {
      title: "Security Analyst",
      courses: "8 courses · 42h",
      icon: Shield,
      iconBg: "bg-blue-50 text-blue-600",
      path: "/learning-paths",
    },
    {
      title: "Web Pen Testing",
      courses: "6 courses · 35h",
      icon: Globe,
      iconBg: "bg-purple-50 text-purple-600",
      path: "/learning-paths",
    },
    {
      title: "SOC Operations",
      courses: "7 courses · 38h",
      icon: Crosshair,
      iconBg: "bg-cyan-50 text-cyan-600",
      path: "/learning-paths",
    },
    {
      title: "Cryptography",
      courses: "4 courses · 18h",
      icon: Key,
      iconBg: "bg-amber-50 text-amber-600",
      path: "/learning-paths",
    },
  ]

  return (
    <div className="w-full">
      {/* ====================================================================
          1. HERO SECTION
         ==================================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle, CTAs & Metrics */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>AI-powered learning assistant — now live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Learn <br />
              Cybersecurity. <br />
              <span className="text-blue-600">Build Real Skills.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
              Follow structured paths, practice in real lab environments, and track your progress toward a cybersecurity career — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center font-semibold rounded-xl px-5 py-3 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
              >
                Start Learning Free
              </Link>
              <Link
                to="/labs"
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-5 py-3 text-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
              >
                <FlaskConical className="h-4 w-4 text-slate-600" />
                <span>Explore Labs</span>
              </Link>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-8 sm:gap-12 pt-6 border-t border-slate-100">
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  2,400+
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  Students enrolled
                </div>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  85+
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  Expert courses
                </div>
              </div>

              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  120+
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  Hands-on labs
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dashboard Preview */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Top Right Floating Streak Badge */}
            <div className="absolute -top-3.5 right-2 sm:right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200 shadow-sm text-xs font-bold text-slate-800">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>7-day streak</span>
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>

            {/* Dashboard Mockup Card */}
            <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 sm:p-6 relative">
              {/* Window Header Dots */}
              <div className="flex items-center gap-1.5 pb-4 border-b border-slate-100">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs font-medium text-slate-400 ml-2 select-none">
                  Your Dashboard
                </span>
              </div>

              {/* Inner Skill Progress Container */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-900">Skill Progress</span>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Level 4
                  </span>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3.5">
                  {skillProgress.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700">{skill.name}</span>
                        <span className="font-semibold text-slate-500">{skill.percent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${skill.color} transition-all duration-500`}
                          style={{ width: `${skill.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contextual AI Assistant Box */}
              <div className="mt-3.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white mt-0.5">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-indigo-900 leading-tight">
                    AI Assistant
                  </div>
                  <div className="text-xs text-indigo-800/90 mt-0.5 leading-snug">
                    "Great progress! Ready to try the SQL Injection lab?"
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Left Floating Lab Completed Badge */}
            <div className="absolute -bottom-3.5 left-2 sm:left-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-emerald-200 shadow-sm text-xs font-semibold text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Lab completed!</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. EVERYTHING YOU NEED SECTION
         ==================================================================== */}
      <section className="border-t border-slate-100 bg-white py-16 sm:py-20">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to learn cybersecurity
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl mx-auto">
            Structured paths, real labs, and AI guidance — no prior experience required.
          </p>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
            {featureCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all duration-200"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
                  >
                    <Icon className="h-5 w-5 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-4 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. POPULAR LEARNING PATHS SECTION
         ==================================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Popular learning paths
          </h2>
          <Link
            to="/learning-paths"
            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-0.5 transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4 Path Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {learningPaths.map((path) => {
            const Icon = path.icon
            return (
              <Link
                key={path.title}
                to={path.path}
                className="group p-5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all duration-200"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${path.iconBg}`}
                >
                  <Icon className="h-5 w-5 stroke-[2]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
                  {path.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{path.courses}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ====================================================================
          4. BLUE BANNER CTA SECTION
         ==================================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-2xl bg-blue-600 text-white p-8 sm:p-12 text-center shadow-md">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Start your cybersecurity journey today
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 mb-6 max-w-lg mx-auto">
            Free to join. No credit card required. Learn at your own pace.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
          >
            <span>Create free account</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
