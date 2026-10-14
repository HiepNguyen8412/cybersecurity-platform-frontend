import { X, CheckCircle2, Clock, Play, Award } from "lucide-react"

export function CourseSyllabusDrawer({ course, isOpen, onClose, onToggleLesson }) {
  if (!isOpen || !course) return null

  const completedCount = course.syllabus?.filter((s) => s.completed).length || 0
  const totalCount = course.syllabus?.length || 0
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {course.code || "COURSE"}
            </span>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white leading-snug">
            {course.title}
          </h2>

          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2 font-mono">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center space-x-1 text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>{course.cert || "Security Specialist"}</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-400">Tiến độ khóa học:</span>
              <span className="text-cyan-400 font-bold">{progressPercent}% ({completedCount}/{totalCount} bài)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Syllabus Lessons List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Giáo trình bài giảng & Thực hành
          </h3>

          {course.syllabus?.map((lesson, idx) => {
            const isCompleted = lesson.completed

            return (
              <div
                key={lesson.id || idx}
                onClick={() => onToggleLesson && onToggleLesson(course.id, lesson.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 group ${
                  isCompleted
                    ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50"
                    : "bg-slate-950/50 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40"
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-emerald-500 text-slate-950"
                      : "border border-slate-600 text-transparent group-hover:border-cyan-400"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Bài {idx + 1}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{lesson.duration}</span>
                    </span>
                  </div>
                  <h4 className={`text-sm font-semibold leading-snug ${isCompleted ? "text-slate-300 line-through opacity-75" : "text-white group-hover:text-cyan-400"}`}>
                    {lesson.title}
                  </h4>
                </div>
              </div>
            )
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onClose()
            }}
            className="flex-2 flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Tiếp Tục Học Ngay</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseSyllabusDrawer
