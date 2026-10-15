import { createPortal } from "react-dom"
import { X, CheckCircle2, Clock, Play, Award, Terminal, ArrowRight } from "lucide-react"
import useLearningStore from "../../../stores/useLearningStore"

export function CourseSyllabusDrawer({ course, isOpen, onClose }) {
  const {
    completedLessons,
    toggleLesson,
    openLessonModal,
    launchLessonLab,
    getCourseProgress,
  } = useLearningStore()

  if (!isOpen || !course) return null

  const courseCompletedList = completedLessons[course.id] || []
  const completedCount = courseCompletedList.length
  const totalCount = course.syllabus?.length || 0
  const progressPercent = getCourseProgress(course.id)

  const handleLessonSelect = (lessonId) => {
    onClose()
    openLessonModal(course.id, lessonId)
  }

  const handleContinueStudy = () => {
    onClose()
    openLessonModal(course.id)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-full bg-slate-900 border-l border-cyan-500/20 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {course.code || "COURSE"}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">
                {course.track || "Security Specialization"}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white leading-snug">
            {course.title}
          </h2>

          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2 font-mono">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
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
              <span className="text-slate-400">Tiến độ module thực chiến:</span>
              <span className="text-cyan-400 font-bold">{progressPercent}% ({completedCount}/{totalCount} bài)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Syllabus Lessons List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Giáo trình bài giảng & Phòng Lab ({totalCount} Bài Học)
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">
              Nhấp để mở bài học
            </span>
          </div>

          {course.syllabus?.map((lesson, idx) => {
            const isCompleted = courseCompletedList.includes(lesson.id)

            return (
              <div
                key={lesson.id || idx}
                className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 group relative ${
                  isCompleted
                    ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50"
                    : "bg-slate-950/50 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40"
                }`}
              >
                {/* Toggle Completion Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLesson(course.id, lesson.id)
                  }}
                  title={isCompleted ? "Đánh dấu chưa hoàn thành" : "Đánh dấu đã hoàn thành"}
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    isCompleted
                      ? "bg-emerald-500 text-slate-950"
                      : "border border-slate-600 text-transparent hover:border-cyan-400 hover:text-cyan-400"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Lesson Info Clickable to open player */}
                <div
                  onClick={() => handleLessonSelect(lesson.id)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="text-cyan-400/90 font-bold">Bài {String(idx + 1).padStart(2, "0")}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{lesson.duration}</span>
                    </span>
                  </div>
                  <h4 className={`text-sm font-semibold leading-snug transition-colors ${
                    isCompleted ? "text-slate-300 line-through opacity-75" : "text-white group-hover:text-cyan-400"
                  }`}>
                    {lesson.title}
                  </h4>
                  {lesson.mitre && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-amber-300 border border-slate-700">
                        {lesson.mitre.split(" - ")[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Open icon arrow */}
                <button
                  onClick={() => handleLessonSelect(lesson.id)}
                  className="p-1 rounded text-slate-500 group-hover:text-cyan-400 transition-colors cursor-pointer"
                  title="Mở bài học"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/70 space-y-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose()
                launchLessonLab(course.labId)
              }}
              className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors cursor-pointer border border-slate-700"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bật Sandbox</span>
            </button>

            <button
              onClick={handleContinueStudy}
              className="flex-2 flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Tiếp Tục Học Ngay</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}

export default CourseSyllabusDrawer
