import { useState } from "react"
import { Link } from "react-router-dom"
import { ShieldAlert, ArrowRight, HelpCircle, MessageSquare, X, Send } from "lucide-react"
import { Card, Button } from "../../../components/common"

/**
 * Tactical Security Advisory Card
 * 
 * Contextual security advisory assistant for the Dashboard.
 * Subtle, non-intrusive, integrated directly into the learning flow.
 */
export function AIMentorCard({
  guidance = {},
  className = "",
}) {
  const {
    contextTopic = "Web Security & Database Defense",
    recommendationMessage = "You're making good progress in Web Security. Try the next SQL Injection lab.",
    contextDetail = "Based on your 86% score in the Web Security Fundamentals quiz, practicing practical prepared statements will solidify your hands-on defense skills.",
    suggestedAction = { label: "Continue", path: "/labs" },
  } = guidance

  const [activeMode, setActiveMode] = useState(null) // 'hint' | 'ask' | null
  const [askQuestion, setAskQuestion] = useState("")
  const [submittedAnswer, setSubmittedAnswer] = useState(null)

  const handleHintToggle = () => {
    setActiveMode(activeMode === "hint" ? null : "hint")
    setSubmittedAnswer(null)
  }

  const handleAskToggle = () => {
    setActiveMode(activeMode === "ask" ? null : "ask")
    setSubmittedAnswer(null)
  }

  const handleAskSubmit = (e) => {
    e.preventDefault()
    if (!askQuestion.trim()) return

    setSubmittedAnswer(
      `SOC Advisory for "${askQuestion}": In prepared statements, query templates are parsed and compiled by the database driver before binding user input parameters. This prevents untrusted strings from altering the syntax structure of the execution tree.`
    )
  }

  return (
    <Card
      variant="default"
      className={`border-blue-200/80 dark:border-slate-800 bg-gradient-to-br from-blue-50/60 via-white to-white dark:from-slate-900/90 dark:via-slate-900/90 dark:to-slate-950 shadow-xs ${className}`.trim()}
    >
      <div className="space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xs">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                  Tactical Security Advisory
                </h2>
                <span className="font-mono-tech text-[10px] font-bold text-blue-700 dark:text-cyan-400 bg-blue-100/90 dark:bg-cyan-950/60 border border-blue-200 dark:border-cyan-800/40 px-1.5 py-0.5 rounded">
                  v2.4 INTEL
                </span>
              </div>
            </div>
          </div>

          {contextTopic && (
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 truncate max-w-[150px]">
              {contextTopic}
            </span>
          )}
        </div>

        {/* Core Recommendation Message */}
        <div className="space-y-1.5 rounded-xl bg-white/90 dark:bg-slate-950 border border-blue-100/80 dark:border-slate-800 p-3">
          <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
            &ldquo;{recommendationMessage}&rdquo;
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
            {contextDetail}
          </p>
        </div>

        {/* Expandable Hint Box */}
        {activeMode === "hint" && (
          <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 space-y-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <HelpCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                Defensive Coding Hint
              </span>
              <button
                type="button"
                onClick={() => setActiveMode(null)}
                className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 p-0.5 cursor-pointer"
                aria-label="Close hint"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              When sanitizing inputs, remember that blacklist filtering (e.g. stripping &quot;UNION&quot; or &quot;SELECT&quot;) is prone to case-sensitivity and nested token bypasses. Always favor type validation and SQL parameterization.
            </p>
          </div>
        )}

        {/* Expandable Ask Input & Answer */}
        {activeMode === "ask" && (
          <div className="space-y-2 p-3 rounded-xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-slate-800 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-cyan-400">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                Tra cứu chiến thuật phòng thủ
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveMode(null)
                  setSubmittedAnswer(null)
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                aria-label="Close ask box"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="flex gap-1.5">
              <input
                type="text"
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                placeholder="e.g. Vì sao Prepared Statements an toàn?"
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                <span>Tra cứu</span>
              </button>
            </form>

            {submittedAnswer && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg">
                {submittedAnswer}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleHintToggle}
              className={`
                px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none inline-flex items-center gap-1
                ${activeMode === "hint" ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}
              `}
            >
              <HelpCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span>Gợi ý code</span>
            </button>

            <button
              type="button"
              onClick={handleAskToggle}
              className={`
                px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none inline-flex items-center gap-1
                ${activeMode === "ask" ? "bg-blue-100 dark:bg-cyan-950/60 text-blue-800 dark:text-cyan-300" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}
              `}
            >
              <MessageSquare className="h-3 w-3 text-blue-600 dark:text-cyan-400" aria-hidden="true" />
              <span>Tra cứu Intel</span>
            </button>
          </div>

          <Link to={suggestedAction.path || "/labs"}>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="h-3 w-3" />}
            >
              {suggestedAction.label || "Continue"}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default AIMentorCard

