import { useState } from "react"
import { Link } from "react-router-dom"
import { Sparkles, ArrowRight, HelpCircle, MessageSquare, X, Send } from "lucide-react"
import { Card, Button } from "../../../components/common"

/**
 * AIMentorCard Component
 * 
 * Contextual AI learning assistant for the Dashboard.
 * Subtle, non-intrusive, integrated directly into the learning flow.
 * Provides:
 * - Direct recommendation message
 * - "Continue" CTA
 * - "Get a hint" interactive popdown
 * - "Ask AI" inline query input
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
      `CyberMentor recommendation for "${askQuestion}": In prepared statements, query templates are parsed and compiled by the database driver before binding user input parameters. This prevents untrusted strings from altering the syntax structure of the execution tree.`
    )
  }

  return (
    <Card
      variant="default"
      className={`border-blue-200/90 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white shadow-xs ${className}`.trim()}
    >
      <div className="space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xs">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-slate-900 tracking-tight">
                  Security AI Co-Pilot
                </h2>
                <span className="font-mono-tech text-[10px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded">
                  v2.4 INTEL
                </span>
              </div>
            </div>
          </div>

          {contextTopic && (
            <span className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">
              {contextTopic}
            </span>
          )}
        </div>

        {/* Core Recommendation Message */}
        <div className="space-y-1.5 rounded-lg bg-white/80 border border-blue-100/80 p-3">
          <p className="text-xs font-semibold text-slate-900 leading-relaxed">
            &ldquo;{recommendationMessage}&rdquo;
          </p>
          <p className="text-[11px] text-slate-600 leading-normal">
            {contextDetail}
          </p>
        </div>

        {/* Expandable Hint Box */}
        {activeMode === "hint" && (
          <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-amber-800">
                <HelpCircle className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                Defensive Coding Hint
              </span>
              <button
                type="button"
                onClick={() => setActiveMode(null)}
                className="text-amber-500 hover:text-amber-700 p-0.5 cursor-pointer"
                aria-label="Close hint"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              When sanitizing inputs, remember that blacklist filtering (e.g. stripping &quot;UNION&quot; or &quot;SELECT&quot;) is prone to case-sensitivity and nested token bypasses. Always favor type validation and SQL parameterization.
            </p>
          </div>
        )}

        {/* Expandable Ask AI Input & Answer */}
        {activeMode === "ask" && (
          <div className="space-y-2 p-3 rounded-lg bg-white border border-blue-200 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                Ask a security question
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveMode(null)
                  setSubmittedAnswer(null)
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
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
                placeholder="e.g. Why are prepared statements safe?"
                className="flex-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                <span>Ask</span>
              </button>
            </form>

            {submittedAnswer && (
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded">
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
                px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer select-none inline-flex items-center gap-1
                ${activeMode === "hint" ? "bg-amber-100 text-amber-800" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}
              `}
            >
              <HelpCircle className="h-3 w-3 text-amber-600" aria-hidden="true" />
              <span>Get a hint</span>
            </button>

            <button
              type="button"
              onClick={handleAskToggle}
              className={`
                px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer select-none inline-flex items-center gap-1
                ${activeMode === "ask" ? "bg-blue-100 text-blue-800" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}
              `}
            >
              <MessageSquare className="h-3 w-3 text-blue-600" aria-hidden="true" />
              <span>Ask AI</span>
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

