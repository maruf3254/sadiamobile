import React from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../Components/common/PageHeader.jsx'
import {
  FiTrendingUp,
  FiShoppingCart,
  FiSmartphone,
  FiArrowUpRight,
  FiFileText
} from 'react-icons/fi'

const reports = [
  {
    title: 'Profit & Loss',
    description:
      'Analyze revenue, cost of goods sold, operating expenses and net profit.',
    path: '/profit-loss',
    icon: FiTrendingUp,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-[#36B6A0]',
    accent: 'group-hover:border-[#36B6A0]'
  },
  {
    title: 'Sales Report',
    description:
      'Explore phone sales, sales invoices and overall sales performance.',
    path: '/reports/sales',
    icon: FiShoppingCart,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    accent: 'group-hover:border-blue-400'
  },
  {
    title: 'Inventory Report',
    description:
      "Monitor available phones and review your shop's inventory value.",
    path: '/reports/inventory',
    icon: FiSmartphone,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    accent: 'group-hover:border-purple-400'
  }
]

export default function Reports () {
  return (
    <div className='space-y-6'>
      <PageHeader
        title='Reports'
        description="Business reports and analytics for Sadia's Mobile."
      />

      {/* Report Overview */}
      <div className='bg-[#202E38] border border-[#33434E] rounded-2xl p-5 sm:p-6'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0]'>
            <FiFileText size={24} />
          </div>

          <div>
            <h3 className='text-[#E6EDF2] font-semibold text-lg'>
              Business Reports
            </h3>
            <p className='text-[#8FA3AF] text-sm mt-1'>
              Select a report to view detailed business information.
            </p>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        {reports.map(report => {
          const Icon = report.icon

          return (
            <Link
              key={report.path}
              to={report.path}
              className={`group relative bg-[#202E38] border border-[#33434E] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${report.accent}`}
            >
              {/* Icon & Arrow */}
              <div className='flex items-center justify-between'>
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${report.iconBg} ${report.iconColor}`}
                >
                  <Icon size={27} />
                </div>

                <div className='w-9 h-9 rounded-lg bg-[#101B24] flex items-center justify-center text-[#8FA3AF] group-hover:text-[#36B6A0] transition-colors'>
                  <FiArrowUpRight size={20} />
                </div>
              </div>

              {/* Content */}
              <div className='mt-6'>
                <h3 className='text-[#E6EDF2] text-lg font-semibold group-hover:text-[#36B6A0] transition-colors'>
                  {report.title}
                </h3>

                <p className='text-[#8FA3AF] text-sm leading-6 mt-2 min-h-[48px]'>
                  {report.description}
                </p>
              </div>

              {/* Action */}
              <div className='flex items-center gap-2 mt-6 pt-4 border-t border-[#33434E]'>
                <span className='text-[#36B6A0] text-sm font-semibold'>
                  View Report
                </span>

                <FiArrowUpRight
                  size={16}
                  className='text-[#36B6A0] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
