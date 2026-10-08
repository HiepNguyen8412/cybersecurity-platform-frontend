import StatCard from "./StatCard"

/**
 * LearningOverview Component
 * 
 * Displays the 4 concise statistics:
 * 1. Overall Progress (42%)
 * 2. Courses Completed (4)
 * 3. Labs Completed (12)
 * 4. Current Streak (7 days)
 * 
 * Clean, lightweight, visually secondary to "Your Next Step".
 */
export function LearningOverview({ stats = [], className = "" }) {
  return (
    <section aria-label="Learning Overview" className={className}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
