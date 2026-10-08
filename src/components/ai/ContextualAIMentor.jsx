import { useState } from "react"
import { Sparkles, MessageSquare, ChevronRight, HelpCircle, Lightbulb, BookOpen, AlertCircle, X } from "lucide-react"

/**
 * Contextual AI Mentor Component Foundation
 * 
 * Appears contextually inside learning workflows (Lessons, Quizzes, Lab Workspaces, Explanations).
 * NOT a generic global chatbot. Focused on learning assistance:
 * - "Explain simply"
 * - "Give me an example"
 * - "Give me a hint"
 * - "Explain my mistake"
 * - "Ask AI"
 */
export function ContextualAIMentor({
  topic = "Current Concept",
  contextDescription = "Need guidance or clarification on this topic? Select a prompt below or ask a question.",
  suggestedActions = [
    { label: "Explain simply", icon: Lightbulb, id: "simple" },
    { label: "Give me an example", icon: BookOpen, id: "example" },
    { label: "Give me a hint", icon: HelpCircle, id: "hint" },
    { label: "Explain my mistake", icon: AlertCircle, id: "mistake" },
  ],
  compact = false,
  className = "",
}) {
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [customQuestion, setCustomQuestion] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  // Contextual simulated responses for visual demonstration
  const sampleResponses = {
    simple: {
      title: "Simplified Explanation",
      text: "Think of this concept like a security guard checking visitor IDs: if the guard checks both the name and badge against an official registry before unlocking the door, unauthorized guests can't just talk their way in.",
    },
    example: {
      title: "Real-World Practical Example",
      text: "In an e-commerce checkout, if a user enters \"admin' --\" into the login username field, an unprotected database query interprets the dashes as a comment and skips password checking entirely.",
    },
    hint: {
      title: "Guiding Hint",
      text: "Look closely at the input validation function. Is it sanitizing user inputs on the server side, or is it only checking on the frontend client?",
    },
    mistake: {
      title: "Common Pitfall Breakdown",
      text: "A frequent oversight is relying exclusively on client-side JavaScript regex. Attackers can bypass browser validations by sending direct HTTP requests using curl or Postman.",
    },
  }

  const handleActionClick = (actionId) => {
    setSelectedPrompt(actionId)
    setIsExpanded(true)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customQuestion.trim()) return
    setSelectedPrompt("custom")
    setIsExpanded(true)
  }

  return (
    <div
      className={`
        rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/60 to-white p-4
        shadow-xs transition-all duration-200
        ${className}
      `.trim()}
    >
      {/* Header: Mentor branding and current context */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-2xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 tracking-tight">AI Mentor</span>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/70 px-1.5 py-0.2 rounded-full">
                Contextual Helper
              </span>
            </div>
          </div>
        </div>

        {topic && (
          <span className="text-[11px] font-medium text-slate-500 truncate max-w-[200px]">
            Topic: <span className="font-semibold text-slate-700">{topic}</span>
          </span>
        )}
      </div>

      {!compact && (
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          {contextDescription}
        </p>
      )}

      {/* Contextual Action Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {suggestedActions.map((action) => {
          const Icon = action.icon
          const isSelected = selectedPrompt === action.id && isExpanded

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action.id)}
              className={`
                inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none
                ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white border border-slate-200/90 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700"
                }
              `}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Contextual Mentor Response Card (Visual Foundation) */}
      {isExpanded && selectedPrompt && (
        <div className="mb-3 rounded-lg border border-blue-200/70 bg-white p-3.5 text-xs shadow-2xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              {selectedPrompt === "custom"
                ? `Answering: "${customQuestion}"`
                : sampleResponses[selectedPrompt]?.title}
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              aria-label="Dismiss helper response"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-slate-600 leading-relaxed">
            {selectedPrompt === "custom"
              ? "In this security module, defensive best practices emphasize defense-in-depth: combine parameterized queries, strict role-based access, and automated security audit logs to eliminate single points of failure."
              : sampleResponses[selectedPrompt]?.text}
          </p>
        </div>
      )}

      {/* Ask AI Input */}
      <form onSubmit={handleCustomSubmit} className="relative flex items-center">
        <MessageSquare className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Ask a question about this step or concept..."
          className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8.5 pr-20 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          className="absolute right-1 px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition cursor-pointer inline-flex items-center gap-1"
        >
          <span>Ask AI</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </form>
    </div>
  )
}

export default ContextualAIMentor
