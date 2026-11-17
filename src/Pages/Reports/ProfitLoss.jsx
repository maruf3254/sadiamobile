import React, { useState } from 'react'
import { get } from '../../services/api'
import { toast } from 'react-hot-toast'
import PageHeader from '../../Components/common/PageHeader.jsx'
import StatCard from '../../Components/common/StatCard'
import {
  FiCalendar,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPackage,
  FiPercent,
  FiFileText,
  FiShoppingBag,
  FiRotateCcw,
  FiCreditCard,
  FiBarChart2
} from 'react-icons/fi'

const money = (value = 0) =>
  `৳${Number(value).toLocaleString('en-BD', {
    maximumFractionDigits: 2
  })}`

export default function ProfitLoss () {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .slice(0, 10)
  )

  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateReport = async () => {
    if (!startDate || !endDate || startDate > endDate) {
      return toast.error('Please select a valid date range.')
    }

    setLoading(true)

    try {
      const params = new URLSearchParams({ startDate, endDate })
      const result = await get(`/reports/profit-loss?${params}`)

      setReport(result.report)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const summaryItems = [
    {
      label: 'Sales Invoices',
      value: report?.totalInvoices ?? 0,
      icon: <FiFileText />
    },
    {
      label: 'Phones Sold',
      value: report?.totalQuantity ?? 0,
      icon: <FiShoppingBag />
    },
    {
      label: 'Phones Returned',
      value: report?.returnedQuantity ?? 0,
      icon: <FiRotateCcw />
    },
    {
      label: 'Refunded Amount',
      value: money(report?.refundedAmount),
      icon: <FiCreditCard />
    },
    {
      label: 'Revenue',
      value: money(report?.totalSales),
      icon: <FiDollarSign />
    },
    {
      label: 'Cost of Goods Sold',
      value: money(report?.costOfGoodsSold),
      icon: <FiPackage />
    },
    {
      label: 'Gross Profit',
      value: money(report?.grossProfit),
      icon: <FiTrendingUp />
    },
    {
      label: 'Operating Expenses',
      value: money(report?.totalExpenses),
      icon: <FiBarChart2 />
    },
    {
      label: 'Net Profit',
      value: money(report?.netProfit),
      icon:
        Number(report?.netProfit) >= 0 ? <FiTrendingUp /> : <FiTrendingDown />
    }
  ]

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Profit & Loss'
        description="Analyze your shop's financial performance and profitability."
      />

      {/* Date Filter */}
      <div className='bg-[#202E38] border border-[#33434E] rounded-2xl p-5 sm:p-6'>
        <div className='flex items-center gap-2 mb-5'>
          <div className='w-9 h-9 rounded-lg bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0]'>
            <FiCalendar size={18} />
          </div>

          <div>
            <h3 className='text-[#E6EDF2] font-semibold'>Report Period</h3>
            <p className='text-[#8FA3AF] text-xs mt-0.5'>
              Select a date range to generate your financial report.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end'>
          <div>
            <label className='block text-sm text-[#8FA3AF] mb-2'>
              Start Date
            </label>

            <input
              type='date'
              value={startDate}
              max={endDate}
              onChange={e => setStartDate(e.target.value)}
              className='w-full bg-[#101B24] border border-[#33434E] text-[#E6EDF2] rounded-xl px-4 py-3 outline-none focus:border-[#36B6A0] transition-colors color-scheme-dark'
            />
          </div>

          <div>
            <label className='block text-sm text-[#8FA3AF] mb-2'>
              End Date
            </label>

            <input
              type='date'
              value={endDate}
              min={startDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={e => setEndDate(e.target.value)}
              className='w-full bg-[#101B24] border border-[#33434E] text-[#E6EDF2] rounded-xl px-4 py-3 outline-none focus:border-[#36B6A0] transition-colors color-scheme-dark'
            />
          </div>

          <button
            disabled={loading}
            onClick={generateReport}
            className='w-full flex items-center justify-center gap-2 bg-[#36B6A0] hover:bg-[#2da18d] disabled:opacity-60 disabled:cursor-not-allowed text-[#101B24] font-semibold rounded-xl px-5 py-3 transition-colors'
          >
            <FiRefreshCw size={17} className={loading ? 'animate-spin' : ''} />

            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Report Content */}
      {report && (
        <>
          {/* Report Period */}
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <h3 className='text-[#E6EDF2] font-semibold text-lg'>
                Financial Overview
              </h3>

              <p className='text-[#8FA3AF] text-sm mt-1'>
                {startDate} to {endDate}
              </p>
            </div>

            <div className='flex items-center gap-2 bg-[#36B6A0]/10 text-[#36B6A0] px-3 py-2 rounded-lg text-xs font-semibold'>
              <FiCalendar />
              Report Generated
            </div>
          </div>

          {/* Financial Stat Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
            <StatCard
              title='Total Sales'
              value={money(report.totalSales)}
              icon='💰'
              color='green'
            />

            <StatCard
              title='Cost of Goods Sold'
              value={money(report.costOfGoodsSold)}
              icon='📦'
              color='orange'
            />

            <StatCard
              title='Gross Profit'
              value={money(report.grossProfit)}
              icon='📈'
              color='blue'
            />

            <StatCard
              title='Total Expenses'
              value={money(report.totalExpenses)}
              icon='💸'
              color='red'
            />

            <StatCard
              title='Net Profit'
              value={money(report.netProfit)}
              icon='🏆'
              color={report.netProfit >= 0 ? 'green' : 'red'}
            />

            <StatCard
              title='Profit Margin'
              value={`${report.profitMargin}%`}
              icon='📊'
              color='purple'
            />
          </div>

          {/* Profit / Loss Highlight */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 ${
              Number(report.netProfit) >= 0
                ? 'bg-[#36B6A0]/5 border-[#36B6A0]/30'
                : 'bg-red-500/5 border-red-500/30'
            }`}
          >
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    Number(report.netProfit) >= 0
                      ? 'bg-[#36B6A0]/15 text-[#36B6A0]'
                      : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {Number(report.netProfit) >= 0 ? (
                    <FiTrendingUp size={24} />
                  ) : (
                    <FiTrendingDown size={24} />
                  )}
                </div>

                <div>
                  <p className='text-[#8FA3AF] text-sm'>
                    Overall Business Result
                  </p>

                  <h3
                    className={`font-semibold text-lg ${
                      Number(report.netProfit) >= 0
                        ? 'text-[#36B6A0]'
                        : 'text-red-400'
                    }`}
                  >
                    {Number(report.netProfit) >= 0
                      ? 'Your shop is profitable'
                      : 'Your shop is running at a loss'}
                  </h3>
                </div>
              </div>

              <div className='sm:text-right'>
                <p className='text-[#8FA3AF] text-sm mb-1'>Net Profit / Loss</p>

                <p
                  className={`text-2xl sm:text-3xl font-bold ${
                    Number(report.netProfit) >= 0
                      ? 'text-[#36B6A0]'
                      : 'text-red-400'
                  }`}
                >
                  {money(report.netProfit)}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className='bg-[#202E38] border border-[#33434E] rounded-2xl overflow-hidden'>
            <div className='p-5 sm:p-6 border-b border-[#33434E]'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0]'>
                  <FiBarChart2 size={20} />
                </div>

                <div>
                  <h3 className='text-[#E6EDF2] font-semibold'>
                    Financial Summary
                  </h3>

                  <p className='text-[#8FA3AF] text-xs mt-1'>
                    Detailed breakdown of your shop's performance.
                  </p>
                </div>
              </div>
            </div>

            <div className='p-4 sm:p-6'>
              <div className='space-y-1'>
                {summaryItems.map(item => (
                  <div
                    key={item.label}
                    className='flex items-center justify-between gap-4 py-4 border-b border-[#33434E] last:border-0'
                  >
                    <div className='flex items-center gap-3 min-w-0'>
                      <div className='w-9 h-9 shrink-0 rounded-lg bg-[#101B24] flex items-center justify-center text-[#36B6A0]'>
                        {item.icon}
                      </div>

                      <span className='text-[#8FA3AF] text-sm'>
                        {item.label}
                      </span>
                    </div>

                    <strong className='text-[#E6EDF2] text-sm sm:text-base text-right break-all'>
                      {item.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!report && !loading && (
        <div className='bg-[#202E38] border border-[#33434E] border-dashed rounded-2xl p-8 sm:p-12 text-center'>
          <div className='w-16 h-16 mx-auto rounded-2xl bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0] mb-4'>
            <FiBarChart2 size={30} />
          </div>

          <h3 className='text-[#E6EDF2] font-semibold text-lg'>
            No Financial Report Yet
          </h3>

          <p className='text-[#8FA3AF] text-sm max-w-md mx-auto mt-2'>
            Select your preferred date range and click Generate Report to view
            your shop's sales, expenses, profit and loss.
          </p>
        </div>
      )}
    </div>
  )
}
