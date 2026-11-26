import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { Cpu, ArrowRight, BookOpen, Terminal, X, Send, Loader2 } from "lucide-react"
import { Card, Button } from "../../../components/common"
import useAuth from "../../../hooks/useAuth"
import aiService from "../../../services/aiService"
import { mockAIMentorGuidance } from "../../../data/dashboardMockData"

function buildInlineAcademicReply(questionText) {
  const lower = String(questionText || "").toLowerCase()
  if (/sql|prepared|statement|cwe-89|injection/.test(lower)) {
    return {
      tag: "CWE-89 · SQL Injection",
      content:
        "Prepared Statements biên dịch trước cây cú pháp SQL (AST) trước khi gắn tham số đầu vào. Nhờ vậy, mọi ký tự điều khiển như dấu nháy đơn hoặc chuỗi bình luận đều được xử lý thuần túy như giá trị dữ liệu, loại bỏ nguy cơ thay đổi logic truy vấn.",
    }
  }
  if (/xss|dom|cwe-79|script/.test(lower)) {
    return {
      tag: "CWE-79 · Cross-Site Scripting",
      content:
        "Để phòng chống XSS, cần tránh gán trực tiếp dữ liệu chưa kiểm chứng vào các sink như innerHTML. Hãy ưu tiên textContent, mã hóa ngữ cảnh đầu ra và thiết lập Content-Security-Policy (CSP) nghiêm ngặt kèm cờ HttpOnly cho cookie phiên.",
    }
  }
  if (/nist|privilege|quyền|rbac|iam/.test(lower)) {
    return {
      tag: "NIST SP 800-53 · AC-6",
      content:
        "Nguyên tắc Đặc quyền tối thiểu (Least Privilege) yêu cầu mỗi tiến trình hoặc tài khoản chỉ được cấp quyền vừa đủ để thực thi nghiệp vụ. Trên ứng dụng web, cần tách tài khoản đọc/ghi dữ liệu khỏi tài khoản quản trị schema và kiểm tra quyền sở hữu ở mọi endpoint.",
    }
  }
  if (/mitre|siem|log|t1190|phát hiện/.test(lower)) {
    return {
      tag: "MITRE ATT&CK · Giám sát SIEM",
      content:
        "Khi tương quan cảnh báo SIEM, nên kết hợp nhật ký HTTP Access (mã trạng thái, độ trễ phản hồi, tham số bất thường) với nhật ký ứng dụng và cơ sở dữ liệu theo mã Request-ID để giảm cảnh báo giả và xác minh chuỗi tấn công chính xác.",
    }
  }
  return {
    tag: "Phương pháp Socratic",
    content: `Đối với câu hỏi "${questionText}", hãy đánh giá theo ba trục: (1) Xác định ranh giới tin cậy của dữ liệu đầu vào, (2) Kiểm tra cơ chế tách biệt dữ liệu khỏi mã lệnh thực thi, và (3) Viết ca kiểm thử xác minh bản vá trong AI Security Workbench.`,
  }
}

/**
 * AIMentorCard
 * Thẻ Trợ lý Nghiên cứu AI Học thuật tích hợp hành động hỏi nhanh nội tuyến
 * và liên kết trực tiếp tới AI Security Workbench (/workbench).
 */
export function AIMentorCard({ guidance = mockAIMentorGuidance, className = "" }) {
  const { isAuthenticated } = useAuth()

  const {
    contextTopic = mockAIMentorGuidance.contextTopic,
    recommendationMessage = mockAIMentorGuidance.recommendationMessage,
    contextDetail = mockAIMentorGuidance.contextDetail,
    suggestedAction = { label: "Mở AI Security Workbench", path: "/workbench" },
    secondaryAction = { label: "Vào phòng Lab", path: "/labs" },
    quickPrompts = mockAIMentorGuidance.quickPrompts,
  } = guidance

  const [selectedPromptId, setSelectedPromptId] = useState(null)
  const [askQuestion, setAskQuestion] = useState("")
  const [inlineReply, setInlineReply] = useState(null)
  const [isQuerying, setIsQuerying] = useState(false)
  const requestSeqRef = useRef(0)

  const handleQuickPromptSelect = (promptItem) => {
    if (selectedPromptId === promptItem.id) {
      setSelectedPromptId(null)
      setInlineReply(null)
      return
    }
    setSelectedPromptId(promptItem.id)
    setInlineReply({
      title: promptItem.promptText,
      tag: promptItem.tag,
      content: promptItem.response,
      source: "Tài liệu học thuật nội tuyến",
    })
  }

  const handleAskSubmit = async (e) => {
    e.preventDefault()
    const cleanQuery = askQuestion.trim()
    if (!cleanQuery || isQuerying) return

    const currentSeq = ++requestSeqRef.current
    setSelectedPromptId(null)
    setIsQuerying(true)

    try {
      if (isAuthenticated) {
        const res = await aiService.getExploitHint(cleanQuery, contextTopic)
        if (requestSeqRef.current !== currentSeq) return

        if (res.success && res.data) {
          const replyText =
            res.data.analysisResult ||
            res.data.hint ||
            res.data.response ||
            (Array.isArray(res.data.keyFindings) ? res.data.keyFindings.join(" ") : "")

          if (replyText) {
            setInlineReply({
              title: cleanQuery,
              tag: res.data.modelName || "AI Security Workbench",
              content: replyText,
              source: "Phản hồi từ máy chủ AI",
            })
            setIsQuerying(false)
            return
          }
        }
      }

      if (requestSeqRef.current !== currentSeq) return
      const localReply = buildInlineAcademicReply(cleanQuery)
      setInlineReply({
        title: cleanQuery,
        tag: localReply.tag,
        content: localReply.content,
        source: "Phân tích Socratic nội tuyến",
      })
    } finally {
      if (requestSeqRef.current === currentSeq) {
        setIsQuerying(false)
      }
    }
  }

  return (
    <Card
      variant="default"
      className={`bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] ${className}`.trim()}
    >
      <div className="space-y-4">
        {/* Tiêu đề thẻ Trợ lý Nghiên cứu AI */}
        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#EFEDE7] dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#38BDF8] border border-blue-200/80 dark:border-blue-500/25 shrink-0">
              <Cpu className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-tight">
                  Trợ lý Nghiên cứu AI
                </h2>
                <span className="font-mono-tech text-[10px] font-semibold text-[#1D4ED8] dark:text-[#93C5FD] bg-blue-50 dark:bg-blue-500/12 border border-blue-200/80 dark:border-blue-500/25 px-1.5 py-0.5 rounded">
                  HỌC THUẬT
                </span>
              </div>
              {contextTopic && (
                <p className="text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  {contextTopic}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Khối khuyến nghị ngữ cảnh */}
        <div className="space-y-1.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.07] p-3.5">
          <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed">
            &ldquo;{recommendationMessage}&rdquo;
          </p>
          <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            {contextDetail}
          </p>
        </div>

        {/* Các hành động gợi ý nhanh nội tuyến */}
        {Array.isArray(quickPrompts) && quickPrompts.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-mono-tech uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Truy vấn học thuật nhanh
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((item) => {
                const isActive = selectedPromptId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleQuickPromptSelect(item)}
                    aria-pressed={isActive}
                    className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer
                      ${
                        isActive
                          ? "bg-[#1D4ED8] dark:bg-[#2563EB] text-white border-[#1D4ED8] dark:border-[#3B82F6]"
                          : "bg-[#FAF9F6] dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8]/50 dark:hover:border-[#38BDF8]/50"
                      }
                    `.trim()}
                  >
                    <BookOpen className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Biểu mẫu hỏi nhanh trực tiếp */}
        <form onSubmit={handleAskSubmit} className="flex gap-1.5">
          <label htmlFor="mentor-quick-prompt-input" className="sr-only">
            Đặt câu hỏi nhanh cho Trợ lý Nghiên cứu AI
          </label>
          <div className="relative flex-1">
            <Terminal
              className="h-3.5 w-3.5 text-[#64748B] dark:text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="mentor-quick-prompt-input"
              name="mentorQuickPrompt"
              type="text"
              value={askQuestion}
              onChange={(e) => setAskQuestion(e.target.value)}
              placeholder="Hỏi nhanh về CWE, MITRE ATT&CK hoặc bản vá..."
              className="w-full rounded-lg border border-[#E5E2DC] dark:border-white/[0.09] bg-white dark:bg-[#0B0E14] pl-8 pr-2.5 py-1.5 text-xs text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
            />
          </div>
          <button
            type="submit"
            disabled={isQuerying || !askQuestion.trim()}
            className="px-3 py-1.5 rounded-lg bg-[#0F172A] dark:bg-[#161C2A] hover:bg-[#1E293B] dark:hover:bg-[#1B2335] disabled:opacity-50 text-white dark:text-[#F1F5F9] border border-[#0F172A] dark:border-white/[0.12] text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-1 shrink-0"
          >
            {isQuerying ? (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-3 w-3" aria-hidden="true" />
            )}
            <span>Tra cứu</span>
          </button>
        </form>

        {/* Kết quả phản hồi nội tuyến */}
        {inlineReply && (
          <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-blue-200/80 dark:border-blue-500/25 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <span className="inline-block font-mono-tech text-[10px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                  {inlineReply.tag}
                </span>
                <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
                  {inlineReply.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInlineReply(null)
                  setSelectedPromptId(null)
                }}
                className="text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] p-0.5 cursor-pointer shrink-0"
                aria-label="Đóng nội dung trả lời"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed whitespace-pre-line">
              {inlineReply.content}
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
              <span>{inlineReply.source}</span>
              <Link
                to="/workbench"
                className="text-[#1D4ED8] dark:text-[#38BDF8] hover:underline font-medium"
              >
                Phân tích sâu hơn tại Workbench →
              </Link>
            </div>
          </div>
        )}

        {/* Hàng điều hướng chính sang AI Security Workbench */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          {secondaryAction?.path && (
            <Link to={secondaryAction.path}>
              <Button variant="outline" size="sm">
                {secondaryAction.label || "Vào phòng Lab"}
              </Button>
            </Link>
          )}

          <Link to={suggestedAction?.path || "/workbench"} className="ml-auto">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              {suggestedAction?.label || "Mở AI Security Workbench"}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default AIMentorCard
