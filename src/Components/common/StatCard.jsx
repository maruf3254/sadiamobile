import React from 'react'

const colorStyles = {
  teal: {
    icon: 'bg-[#36B6A0]/10 text-[#36B6A0]',
    border: 'hover:border-[#36B6A0]/50'
  },
  blue: {
    icon: 'bg-blue-500/10 text-blue-400',
    border: 'hover:border-blue-400/50'
  },
  purple: {
    icon: 'bg-purple-500/10 text-purple-400',
    border: 'hover:border-purple-400/50'
  },
  orange: {
    icon: 'bg-orange-500/10 text-orange-400',
    border: 'hover:border-orange-400/50'
  },
  red: {
    icon: 'bg-red-500/10 text-red-400',
    border: 'hover:border-red-400/50'
  },
  green: {
    icon: 'bg-[#36B6A0]/10 text-[#36B6A0]',
    border: 'hover:border-[#36B6A0]/50'
  }
}

export default function StatCard ({
  title,
  value,
  icon,
  color = 'teal',
  description
}) {
  const styles = colorStyles[color] || colorStyles.teal

  const isReactComponent = typeof icon === 'function'
  const Icon = isReactComponent ? icon : null

  return (
    <div
      className={`bg-[#202E38] border border-[#34434D] ${styles.border}
  rounded-2xl p-4 sm:p-5 transition-all duration-200
  hover:-translate-y-1 shadow-lg shadow-black/10`}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-sm text-[#A8B6BF] font-medium'>{title}</p>

          <h3 className='text-xl sm:text-2xl font-bold text-[#E6EDF2] mt-3 break-words'>
            {value ?? 0}
          </h3>

          {description && (
            <p className='text-xs text-[#82949F] mt-2'>{description}</p>
          )}
        </div>

        <div
          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${styles.icon}`}
        >
          {isReactComponent ? (
            <Icon size={19} />
          ) : (
            icon && <span className='text-xl'>{icon}</span>
          )}
        </div>
      </div>
    </div>
  )
}
