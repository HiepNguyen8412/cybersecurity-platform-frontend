import StatCard from "./StatCard"

/**
 * LearningOverview
 * Hiển thị lưới 4 chỉ số KPI tiến độ học tập cốt lõi.
 */
export function LearningOverview({ stats = [], className = "" }) {
  return (
    <section aria-label="Tổng quan tiến độ học tập" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id || stat.label}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            subtitle={stat.subtitle}
            icon={stat.icon}
            variant={stat.variant}
            trend={stat.trend}
            hasProgressBar={stat.hasProgressBar}
          />
        ))}
      </div>
    </section>
  )
}

export default LearningOverview
