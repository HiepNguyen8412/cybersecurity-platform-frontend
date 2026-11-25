import { BookOpen, ExternalLink, FileText, GraduationCap, Shield } from "lucide-react"

const BLOOM_META = {
  "nhận biết": {
    tier: "BẬC 01",
    label: "Nhận biết",
    hint: "Ghi nhớ khái niệm, định danh lỗ hổng và thuật ngữ chuẩn",
    tone: "bg-[#F3F1EC] text-[#475569] border-[#E5E2DC] dark:bg-[#161C2A] dark:text-[#94A3B8] dark:border-white/[0.1]",
  },
  "thông hiểu": {
    tier: "BẬC 02",
    label: "Thông hiểu",
    hint: "Diễn giải cơ chế vận hành giao thức và nguyên nhân gốc rễ",
    tone: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/12 dark:text-sky-300 dark:border-sky-500/25",
  },
  "vận dụng": {
    tier: "BẬC 03",
    label: "Vận dụng",
    hint: "Thực thi kiểm thử và triển khai biện pháp kiểm soát trong Sandbox",
    tone: "bg-blue-50 text-[#1D4ED8] border-blue-200 dark:bg-blue-500/12 dark:text-[#93C5FD] dark:border-blue-500/25",
  },
  "phân tích": {
    tier: "BẬC 04",
    label: "Phân tích",
    hint: "Bóc tách luồng tấn công, ranh giới tin cậy và cây cú pháp",
    tone: "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-500/12 dark:text-indigo-300 dark:border-indigo-500/25",
  },
  "tổng hợp": {
    tier: "BẬC 05",
    label: "Tổng hợp",
    hint: "Thiết kế kiến trúc phòng thủ đa tầng và quy tắc phát hiện",
    tone: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25",
  },
  "đánh giá": {
    tier: "BẬC 06",
    label: "Đánh giá",
    hint: "Thẩm định rủi ro, biện minh giải pháp vá lỗi theo chuẩn NIST",
    tone: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/12 dark:text-amber-300 dark:border-amber-500/25",
  },
}

function resolveBloomBadge(bloomLevel) {
  if (!bloomLevel || typeof bloomLevel !== "string") return null
  const normalized = bloomLevel.trim().toLowerCase()
  for (const [key, meta] of Object.entries(BLOOM_META)) {
    if (normalized.includes(key)) {
      return { ...meta, raw: bloomLevel.trim() }
    }
  }
  return {
    tier: "BLOOM",
    label: bloomLevel.trim(),
    hint: "Phân tầng mục tiêu nhận thức học thuật",
    tone: "bg-blue-50 text-[#1D4ED8] border-blue-200 dark:bg-blue-500/12 dark:text-[#93C5FD] dark:border-blue-500/25",
    raw: bloomLevel.trim(),
  }
}

function isSafeReferenceUrl(url) {
  if (typeof url !== "string") return false
  const trimmed = url.trim()
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/")
  )
}

function normalizeReferences(references) {
  if (!Array.isArray(references)) return []
  return references
    .map((item, idx) => {
      if (typeof item === "string") {
        return {
          key: `ref-${idx}`,
          code: `REF-${String(idx + 1).padStart(2, "0")}`,
          title: item,
          url: "",
        }
      }
      if (!item || typeof item !== "object") return null
      const code = item.code || item.tag || `REF-${String(idx + 1).padStart(2, "0")}`
      const title = item.title || item.label || item.name || code
      const url = item.url || item.href || ""
      return {
        key: `${code}-${idx}`,
        code,
        title,
        url,
      }
    })
    .filter(Boolean)
}

export function AcademicCitationBlock({
  mitre = "",
  cve = "",
  rfc = "",
  bloomLevel = "",
  references = [],
  className = "",
}) {
  const bloom = resolveBloomBadge(bloomLevel)
  const normalizedRefs = normalizeReferences(references)

  const citationItems = [
    mitre
      ? {
          id: "mitre",
          label: "MITRE ATT&CK®",
          value: mitre,
          icon: Shield,
        }
      : null,
    cve
      ? {
          id: "cve",
          label: "CWE / CVE",
          value: cve,
          icon: FileText,
        }
      : null,
    rfc
      ? {
          id: "rfc",
          label: "IETF RFC / CHUẨN",
          value: rfc,
          icon: BookOpen,
        }
      : null,
  ].filter(Boolean)

  const hasContent = citationItems.length > 0 || bloom || normalizedRefs.length > 0

  return (
    <aside
      aria-label="Trích dẫn chuẩn mực học thuật và tài liệu tham chiếu"
      className={`rounded-xl bg-[#FAF9F6] dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] overflow-hidden ${className}`.trim()}
    >
      {/* Archival Header */}
      <div className="px-4 sm:px-5 py-3 bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen
            className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0"
            strokeWidth={1.6}
          />
          <h4 className="font-serif-editorial text-base font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">
            Hồ sơ Trích dẫn &amp; Chuẩn mực Tham chiếu
          </h4>
        </div>

        {bloom && (
          <span
            title={bloom.hint}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono-tech text-[11px] font-semibold whitespace-nowrap ${bloom.tone}`}
          >
            <GraduationCap className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
            <span>
              {bloom.tier} · {bloom.label}
            </span>
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {!hasContent ? (
          <p className="font-sans text-xs text-[#64748B] dark:text-[#94A3B8]">
            Chưa có dữ liệu định danh chuẩn MITRE/CVE/RFC cho mục này.
          </p>
        ) : (
          <>
            {/* Primary Identifiers Grid */}
            {citationItems.length > 0 && (
              <div
                className={`grid grid-cols-1 ${
                  citationItems.length === 2
                    ? "sm:grid-cols-2"
                    : citationItems.length >= 3
                    ? "sm:grid-cols-3"
                    : ""
                } gap-2.5`}
              >
                {citationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-white dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-1"
                    >
                      <div className="flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                        <Icon
                          className="h-3 w-3 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0"
                          strokeWidth={1.6}
                        />
                        <span>{item.label}</span>
                      </div>
                      <div className="font-mono-tech text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] break-words leading-snug">
                        {item.value}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Bloom Descriptor */}
            {bloom && (
              <div className="px-3.5 py-2.5 rounded-lg bg-[#F3F1EC]/70 dark:bg-[#161C2A]/70 border border-[#EFEDE7] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono-tech text-[11px] font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                  Phân loại nhận thức Bloom: {bloom.raw}
                </span>
                <span className="font-sans text-[#475569] dark:text-[#94A3B8]">
                  {bloom.hint}
                </span>
              </div>
            )}

            {/* Primary Reading List */}
            {normalizedRefs.length > 0 && (
              <div className="space-y-2">
                <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-semibold">
                  Tài liệu gốc &amp; Đặc tả kỹ thuật liên quan
                </div>
                <ul className="divide-y divide-[#EFEDE7] dark:divide-white/[0.06] rounded-lg bg-white dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08]">
                  {normalizedRefs.map((ref) => {
                    const safeUrl = isSafeReferenceUrl(ref.url)
                    return (
                      <li
                        key={ref.key}
                        className="px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-baseline gap-2.5 min-w-0">
                          <span className="font-mono-tech text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8] shrink-0">
                            [{ref.code}]
                          </span>
                          <span className="font-sans text-[#0F172A] dark:text-[#F1F5F9] leading-snug break-words">
                            {ref.title}
                          </span>
                        </div>

                        {safeUrl && (
                          <a
                            href={ref.url}
                            target={ref.url.startsWith("/") ? undefined : "_blank"}
                            rel={ref.url.startsWith("/") ? undefined : "noopener noreferrer"}
                            className="inline-flex items-center gap-1 font-mono-tech text-[11px] text-[#1D4ED8] dark:text-[#38BDF8] hover:underline whitespace-nowrap shrink-0"
                          >
                            <span>Xem tài liệu</span>
                            <ExternalLink className="h-3 w-3 shrink-0" strokeWidth={1.7} />
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  )
}

export default AcademicCitationBlock
