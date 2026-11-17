import React, { useState } from 'react'
import { get } from '../../services/api'
import { toast } from 'react-hot-toast'
import {
  FiCalendar,
  FiTrendingUp,
  FiDollarSign,
  FiFileText,
  FiFilter,
  FiRefreshCw,
  FiShoppingBag,
  FiArrowUpRight,
  FiPackage
} from 'react-icons/fi'

import PageHeader from '../../Components/common/PageHeader.jsx'
import Loading from '../../Components/common/Loading.jsx'

export default function SalesReport () {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (startDate && endDate && startDate > endDate) {
      return toast.error('Invalid date range')
    }

    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)

      setData(await get(`/reports/sales?${params}`))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = amount =>
    `৳${Number(amount || 0).toLocaleString('en-BD')}`

  const formatDate = date =>
    new Date(date).toLocaleDateString('en-BD', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })

  const summaryCards = [
    {
      title: 'Total Sales',
      value: formatCurrency(data?.totalSales),
      icon: FiDollarSign,
      color: 'text-[#36B6A0]',
      bg: 'bg-[#36B6A0]/10',
      description: 'Total revenue generated'
    },
    {
      title: 'Total Profit',
      value: formatCurrency(data?.totalProfit),
      icon: FiTrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      description: 'Profit from sales'
    },
    {
      title: 'Total Invoices',
      value: Number(data?.total || 0).toLocaleString('en-BD'),
      icon: FiFileText,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      description: 'Completed sales invoices'
    }
  ]

  return (
    <div className='space-y-6 pb-6'>
      <PageHeader
        title='Sales Report'
        description='Monitor sales performance, revenue and profit by invoice.'
      />

      {/* Date Filter */}
      <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-4 sm:p-5'>
        <div className='mb-5 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
            <FiFilter size={19} />
          </div>

          <div>
            <h3 className='font-semibold text-[#E6EDF2]'>
              Filter Sales Report
            </h3>
            <p className='text-xs text-[#8FA3AF]'>
              Select a date range to generate your report.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end'>
          <div>
            <label className='mb-2 block text-sm font-medium text-[#8FA3AF]'>
              Start Date
            </label>
            <div className='relative'>
              <FiCalendar
                className='absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA3AF]'
                size={17}
              />
              <input
                type='date'
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className='w-full rounded-xl border border-[#33434E] bg-[#101B24] py-3 pl-10 pr-3 text-sm text-[#E6EDF2] outline-none transition focus:border-[#36B6A0] focus:ring-2 focus:ring-[#36B6A0]/20'
              />
            </div>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-[#8FA3AF]'>
              End Date
            </label>
            <div className='relative'>
              <FiCalendar
                className='absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA3AF]'
                size={17}
              />
              <input
                type='date'
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate || undefined}
                className='w-full rounded-xl border border-[#33434E] bg-[#101B24] py-3 pl-10 pr-3 text-sm text-[#E6EDF2] outline-none transition focus:border-[#36B6A0] focus:ring-2 focus:ring-[#36B6A0]/20'
              />
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className='flex items-center justify-center gap-2 rounded-xl bg-[#36B6A0] px-6 py-3 text-sm font-semibold text-[#101B24] transition hover:bg-[#2da58f] disabled:cursor-not-allowed disabled:opacity-60'
          >
            <FiTrendingUp size={17} />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>

          <button
            onClick={() => {
              setStartDate('')
              setEndDate('')
              setData(null)
            }}
            className='flex items-center justify-center gap-2 rounded-xl border border-[#33434E] px-5 py-3 text-sm font-medium text-[#8FA3AF] transition hover:border-[#36B6A0] hover:text-[#36B6A0]'
          >
            <FiRefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {loading && <Loading />}

      {/* Report Content */}
      {!loading && data && (
        <>
          {/* Summary Cards */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {summaryCards.map(card => {
              const Icon = card.icon

              return (
                <div
                  key={card.title}
                  className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5 transition hover:border-[#36B6A0]/50'
                >
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-sm font-medium text-[#8FA3AF]'>
                        {card.title}
                      </p>
                      <h2 className='mt-3 text-2xl font-bold text-[#E6EDF2]'>
                        {card.value}
                      </h2>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
                    >
                      <Icon size={23} />
                    </div>
                  </div>

                  <div className='mt-4 flex items-center gap-2 text-xs text-[#8FA3AF]'>
                    <FiArrowUpRight className={card.color} />
                    {card.description}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sales Table */}
          <div className='overflow-hidden rounded-2xl border border-[#33434E] bg-[#202E38]'>
            <div className='flex flex-col gap-3 border-b border-[#33434E] p-5 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-[#E6EDF2]'>
                  Sales Transactions
                </h3>
                <p className='mt-1 text-sm text-[#8FA3AF]'>
                  Invoice-wise sales and profit details.
                </p>
              </div>

              <div className='flex w-fit items-center gap-2 rounded-lg bg-[#36B6A0]/10 px-3 py-2 text-sm font-medium text-[#36B6A0]'>
                <FiShoppingBag size={16} />
                {data.sales?.length || 0} Records
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full min-w-[750px] text-left text-sm'>
                <thead className='bg-[#101B24] text-xs uppercase tracking-wider text-[#8FA3AF]'>
                  <tr>
                    <th className='px-5 py-4 font-semibold'>Invoice</th>
                    <th className='px-5 py-4 font-semibold'>Date</th>
                    <th className='px-5 py-4 text-center font-semibold'>
                      Quantity
                    </th>
                    <th className='px-5 py-4 text-right font-semibold'>
                      Sales
                    </th>
                    <th className='px-5 py-4 text-right font-semibold'>Cost</th>
                    <th className='px-5 py-4 text-right font-semibold'>
                      Profit
                    </th>
                  </tr>
                </thead>

                <tbody className='divide-y divide-[#33434E]'>
                  {data.sales?.length > 0 ? (
                    data.sales.map(sale => (
                      <tr
                        key={sale.invoiceNumber}
                        className='transition hover:bg-[#101B24]/50'
                      >
                        <td className='px-5 py-4'>
                          <span className='font-semibold text-[#36B6A0]'>
                            {sale.invoiceNumber}
                          </span>
                        </td>

                        <td className='whitespace-nowrap px-5 py-4 text-[#8FA3AF]'>
                          {formatDate(sale.saleDate)}
                        </td>

                        <td className='px-5 py-4 text-center text-[#E6EDF2]'>
                          {sale.totalQuantity}
                        </td>

                        <td className='whitespace-nowrap px-5 py-4 text-right font-medium text-[#E6EDF2]'>
                          {formatCurrency(sale.totalSales)}
                        </td>

                        <td className='whitespace-nowrap px-5 py-4 text-right text-[#8FA3AF]'>
                          {formatCurrency(sale.cost)}
                        </td>

                        <td className='whitespace-nowrap px-5 py-4 text-right font-semibold text-[#36B6A0]'>
                          {formatCurrency(sale.profit)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='6' className='px-5 py-16 text-center'>
                        <FiPackage
                          size={35}
                          className='mx-auto mb-3 text-[#8FA3AF]'
                        />
                        <p className='font-medium text-[#E6EDF2]'>
                          No sales records found
                        </p>
                        <p className='mt-1 text-sm text-[#8FA3AF]'>
                          Try selecting a different date range.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className='border-t border-[#33434E] px-5 py-4'>
              <p className='text-xs text-[#8FA3AF]'>
                Showing {data.sales?.length || 0} sales records
              </p>
            </div>
          </div>
        </>
      )}

      {/* Initial State */}
      {!loading && !data && (
        <div className='rounded-2xl border border-dashed border-[#33434E] bg-[#202E38]/50 px-5 py-16 text-center'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#36B6A0]/10 text-[#36B6A0]'>
            <FiFileText size={30} />
          </div>

          <h3 className='mt-5 text-lg font-semibold text-[#E6EDF2]'>
            Generate Your Sales Report
          </h3>

          <p className='mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8FA3AF]'>
            Select your preferred date range and generate a detailed report of
            your shop's sales, revenue and profit.
          </p>
        </div>
      )}
    </div>
  )
}
