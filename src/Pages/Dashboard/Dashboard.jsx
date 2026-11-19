import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { get } from '../../services/api'

import StatCard from '../../Components/common/StatCard'
import PageHeader from '../../Components/common/PageHeader.jsx'
import Loading from '../../Components/common/Loading.jsx'

import {
  FaMobileAlt,
  FaBoxes,
  FaShoppingCart,
  FaWallet,
  FaMoneyBillWave,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaSyncAlt,
  FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

const money = (value = 0) =>
  `৳ ${Number(value || 0).toLocaleString('en-BD', {
    maximumFractionDigits: 2
  })}`

const sectionTitle = 'text-lg font-semibold text-[#E6EDF2] tracking-wide'

const cardStyle =
  'min-w-0 overflow-hidden bg-[#202E38] border border-[#34434D] rounded-2xl p-4 sm:p-5 shadow-lg shadow-black/10'

const tooltipStyle = {
  backgroundColor: '#172630',
  border: '1px solid #34434D',
  borderRadius: '10px',
  color: '#E6EDF2',
  fontSize: '12px'
}

const pieColors = ['#60A5FA', '#F59E0B', '#36B6A0']

const formatAxisValue = value => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }

  return value
}

const ChartCard = ({ title, description, children }) => (
  <div className={cardStyle}>
    <div className='mb-5'>
      <h3 className='text-base font-semibold text-[#E6EDF2]'>{title}</h3>
      <p className='mt-1 text-xs text-[#8FA3AF]'>{description}</p>
    </div>

    {children}
  </div>
)

export default function Dashboard () {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const result = await get('/dashboard/overview')

      setData(result?.data ?? result)
    } catch (error) {
      console.error(error)
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Failed to load dashboard.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) return <Loading />

  if (!data) {
    return (
      <div className='min-h-[50vh] flex flex-col items-center justify-center text-center px-4'>
        <div className='w-16 h-16 rounded-2xl bg-[#202E38] flex items-center justify-center mb-4'>
          <FaExclamationTriangle className='text-[#36B6A0] text-2xl' />
        </div>

        <h2 className='text-lg font-semibold text-[#E6EDF2]'>
          Unable to load dashboard
        </h2>

        <p className='text-sm text-[#8FA3AF] mt-2'>
          Please check your connection and try again.
        </p>

        <button
          onClick={() => fetchDashboard()}
          className='mt-5 px-5 py-2.5 rounded-xl bg-[#36B6A0] text-[#101B24] font-semibold text-sm hover:bg-[#2FA58F] transition'
        >
          Try Again
        </button>
      </div>
    )
  }

  const { inventory = {}, today = {}, monthly = {}, charts = {} } = data

  const monthlyPie = charts.monthlyPie?.data || []
  const yearlyChart = charts.yearlyChart || []

  const inventoryStats = [
    {
      title: 'Total Phones',
      value: inventory.totalMobiles ?? 0,
      icon: FaMobileAlt,
      color: 'teal',
      description: 'Total registered phones'
    },
    {
      title: 'Available Phones',
      value: inventory.availableMobiles ?? 0,
      icon: FaBoxes,
      color: 'blue',
      description: 'Currently in stock'
    },
    {
      title: 'Sold Phones',
      value: inventory.soldMobiles ?? 0,
      icon: FaShoppingCart,
      color: 'purple',
      description: 'Total phones sold'
    },
    {
      title: 'Inventory Purchase Value',
      value: money(inventory.purchaseValue),
      icon: FaWallet,
      color: 'orange',
      description: 'Total stock purchase value'
    }
  ]

  const todayStats = [
    {
      title: "Today's Sales",
      value: money(today.revenue),
      icon: FaMoneyBillWave,
      color: 'teal',
      description: `${today.invoices || 0} invoices`
    },
    {
      title: "Today's Gross Profit",
      value: money(today.grossProfit),
      icon: FaChartLine,
      color: 'blue',
      description: 'Before expenses'
    },
    {
      title: "Today's Expenses",
      value: money(today.expenses),
      icon: FaArrowDown,
      color: 'red',
      description: "Today's total expenses"
    },
    {
      title: "Today's Net Profit",
      value: money(today.netProfit),
      icon: FaArrowUp,
      color: 'purple',
      description: 'After expenses'
    }
  ]

  const monthlyStats = [
    {
      title: 'Monthly Sales',
      value: money(monthly.revenue),
      icon: FaMoneyBillWave,
      color: 'teal',
      description: `${monthly.invoices || 0} invoices`
    },
    {
      title: 'Monthly Gross Profit',
      value: money(monthly.grossProfit),
      icon: FaChartLine,
      color: 'blue',
      description: 'Before expenses'
    },
    {
      title: 'Monthly Expenses',
      value: money(monthly.expenses),
      icon: FaArrowDown,
      color: 'red',
      description: "This month's expenses"
    },
    {
      title: 'Monthly Net Profit',
      value: money(monthly.netProfit),
      icon: FaArrowUp,
      color: 'purple',
      description: 'After expenses'
    }
  ]

  const renderStats = stats => (
    <div className='grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4'>
      {stats.map(item => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
          description={item.description}
        />
      ))}
    </div>
  )

  return (
    <div className='w-full min-w-0 space-y-7 sm:space-y-8'>
      {/* Page Header */}
      <PageHeader
        title='Dashboard'
        description='Monitor your mobile shop performance and business activities.'
      >
        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className='inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#34434D] bg-[#202E38] text-[#E6EDF2] text-sm font-medium hover:border-[#36B6A0] hover:text-[#36B6A0] transition disabled:opacity-50'
        >
          <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </PageHeader>

      {/* Inventory Overview */}
      <section className='space-y-4 min-w-0'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 shrink-0 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center'>
            <FaMobileAlt className='text-[#36B6A0] text-lg' />
          </div>

          <div className='min-w-0'>
            <h2 className={sectionTitle}>Inventory Overview</h2>
            <p className='text-xs text-[#8FA3AF] mt-0.5'>
              Your current mobile stock summary
            </p>
          </div>
        </div>

        {renderStats(inventoryStats)}
      </section>

      {/* Today's Business */}
      <section className='space-y-4 min-w-0'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 shrink-0 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center'>
            <FaCalendarAlt className='text-[#36B6A0] text-lg' />
          </div>

          <div className='min-w-0'>
            <h2 className={sectionTitle}>Today's Business</h2>
            <p className='text-xs text-[#8FA3AF] mt-0.5'>
              Daily sales, expenses and profit
            </p>
          </div>
        </div>

        {renderStats(todayStats)}
      </section>

      {/* Monthly Business */}
      <section className='space-y-4 min-w-0'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 shrink-0 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center'>
            <FaChartLine className='text-[#36B6A0] text-lg' />
          </div>

          <div className='min-w-0'>
            <h2 className={sectionTitle}>This Month</h2>
            <p className='text-xs text-[#8FA3AF] mt-0.5'>
              Monthly financial performance
            </p>
          </div>
        </div>

        {renderStats(monthlyStats)}
      </section>

      {/* Charts */}
      <section className='space-y-4 min-w-0'>
        <div>
          <h2 className={sectionTitle}>Business Analytics</h2>
          <p className='text-xs text-[#8FA3AF] mt-1'>
            Monthly breakdown and yearly performance
          </p>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 min-w-0'>
          {/* Monthly Pie Chart */}
          <ChartCard
            title='Monthly Financial Breakdown'
            description='Cost, expenses and net profit for this month'
          >
            {monthlyPie.length > 0 &&
            monthlyPie.some(item => Number(item.value) > 0) ? (
              <>
                <div className='h-[240px] sm:h-[280px] w-full min-w-0'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={monthlyPie}
                        dataKey='value'
                        nameKey='name'
                        cx='50%'
                        cy='50%'
                        innerRadius='48%'
                        outerRadius='76%'
                        paddingAngle={3}
                        stroke='none'
                      >
                        {monthlyPie.map((item, index) => (
                          <Cell
                            key={item.name}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={value => money(value)}
                        contentStyle={tooltipStyle}
                      />

                      <Legend
                        verticalAlign='bottom'
                        height={30}
                        wrapperStyle={{
                          fontSize: '11px',
                          color: '#A8B6BF'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className='mt-3 grid grid-cols-2 gap-3'>
                  <div className='rounded-xl bg-[#101B24] p-3'>
                    <p className='text-xs text-[#8FA3AF]'>Monthly Revenue</p>
                    <p className='mt-1 text-sm sm:text-base font-bold text-[#E6EDF2] break-words'>
                      {money(charts.monthlyPie?.revenue)}
                    </p>
                  </div>

                  <div className='rounded-xl bg-[#101B24] p-3'>
                    <p className='text-xs text-[#8FA3AF]'>Net Profit / Loss</p>
                    <p
                      className={`mt-1 text-sm sm:text-base font-bold break-words ${
                        charts.monthlyPie?.netLoss > 0
                          ? 'text-red-400'
                          : 'text-[#36B6A0]'
                      }`}
                    >
                      {charts.monthlyPie?.netLoss > 0
                        ? `-${money(charts.monthlyPie.netLoss)}`
                        : money(monthly.netProfit)}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className='h-[280px] flex flex-col items-center justify-center text-center'>
                <FaChartLine className='text-3xl text-[#536773] mb-3' />
                <p className='text-sm text-[#8FA3AF]'>
                  No financial data available this month.
                </p>
              </div>
            )}
          </ChartCard>

          {/* Yearly Bar Chart */}
          <ChartCard
            title={`Yearly Performance - ${new Date().getFullYear()}`}
            description='January to December sales, expenses and profit'
          >
            {yearlyChart.length > 0 ? (
              <div className='h-[280px] sm:h-[320px] w-full min-w-0'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={yearlyChart}
                    margin={{
                      top: 10,
                      right: 0,
                      left: -20,
                      bottom: 0
                    }}
                    barGap={3}
                  >
                    <CartesianGrid
                      stroke='#34434D'
                      strokeDasharray='3 3'
                      vertical={false}
                    />

                    <XAxis
                      dataKey='label'
                      stroke='#8FA3AF'
                      tick={{
                        fill: '#A8B6BF',
                        fontSize: 10
                      }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                    />

                    <YAxis
                      stroke='#8FA3AF'
                      tick={{
                        fill: '#A8B6BF',
                        fontSize: 10
                      }}
                      tickFormatter={formatAxisValue}
                      tickLine={false}
                      axisLine={false}
                      width={48}
                    />

                    <Tooltip
                      formatter={value => money(value)}
                      contentStyle={tooltipStyle}
                      cursor={{ fill: '#34434D', opacity: 0.3 }}
                    />

                    <Legend
                      wrapperStyle={{
                        fontSize: '11px',
                        color: '#A8B6BF'
                      }}
                    />

                    <Bar
                      dataKey='revenue'
                      name='Sales'
                      fill='#36B6A0'
                      radius={[4, 4, 0, 0]}
                      maxBarSize={25}
                    />

                    <Bar
                      dataKey='expenses'
                      name='Expenses'
                      fill='#F59E0B'
                      radius={[4, 4, 0, 0]}
                      maxBarSize={25}
                    />

                    <Bar
                      dataKey='netProfit'
                      name='Net Profit'
                      fill='#60A5FA'
                      radius={[4, 4, 0, 0]}
                      maxBarSize={25}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className='h-[280px] flex flex-col items-center justify-center text-center'>
                <FaChartLine className='text-3xl text-[#536773] mb-3' />
                <p className='text-sm text-[#8FA3AF]'>
                  No yearly data available.
                </p>
              </div>
            )}
          </ChartCard>
        </div>
      </section>

      {/* Recent Sales & Low Stock */}
      <section className='grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 min-w-0'>
        {/* Recent Sales */}
        <div className={cardStyle}>
          <div className='flex items-center justify-between gap-3 mb-5'>
            <div className='min-w-0'>
              <h3 className='text-base font-semibold text-[#E6EDF2]'>
                Recent Sales
              </h3>
              <p className='text-xs text-[#8FA3AF] mt-1'>
                Latest sales transactions
              </p>
            </div>

            <div className='w-10 h-10 shrink-0 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center'>
              <FaShoppingCart className='text-[#36B6A0]' />
            </div>
          </div>

          {data.recentSales?.length ? (
            <>
              {/* Mobile cards */}
              <div className='space-y-3 sm:hidden'>
                {data.recentSales.map(sale => (
                  <div
                    key={sale._id}
                    className='rounded-xl border border-[#34434D] bg-[#101B24]/40 p-3'
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <p className='text-sm font-semibold text-[#E6EDF2]'>
                        {sale.invoiceNumber}
                      </p>

                      <span className='text-[10px] rounded-full px-2 py-1 bg-[#36B6A0]/10 text-[#36B6A0]'>
                        {sale.status || 'COMPLETED'}
                      </span>
                    </div>

                    <div className='mt-3 flex items-center justify-between gap-2'>
                      <span className='text-xs text-[#8FA3AF]'>
                        {sale.saleDate
                          ? new Date(sale.saleDate).toLocaleDateString('en-BD')
                          : 'N/A'}
                      </span>

                      <span className='text-sm font-bold text-[#36B6A0]'>
                        {money(sale.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className='hidden sm:block overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='text-left text-[#8FA3AF] border-b border-[#34434D]'>
                      <th className='py-3 font-medium'>Invoice</th>
                      <th className='py-3 font-medium'>Date</th>
                      <th className='py-3 font-medium text-right'>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.recentSales.map(sale => (
                      <tr
                        key={sale._id}
                        className='border-b border-[#34434D]/70 last:border-0 hover:bg-[#101B24]/40 transition'
                      >
                        <td className='py-4 text-[#E6EDF2] font-medium whitespace-nowrap'>
                          {sale.invoiceNumber}
                        </td>

                        <td className='py-4 text-[#A8B6BF] whitespace-nowrap'>
                          {sale.saleDate
                            ? new Date(sale.saleDate).toLocaleDateString(
                                'en-BD'
                              )
                            : 'N/A'}
                        </td>

                        <td className='py-4 text-right text-[#36B6A0] font-semibold whitespace-nowrap'>
                          {money(sale.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className='py-10 text-center'>
              <FaShoppingCart className='mx-auto text-3xl text-[#536773] mb-3' />
              <p className='text-sm text-[#8FA3AF]'>
                No sales transactions yet.
              </p>
            </div>
          )}
        </div>

        {/* Lowest Stock */}
        <div className={cardStyle}>
          <div className='flex items-center justify-between gap-3 mb-5'>
            <div className='min-w-0'>
              <h3 className='text-base font-semibold text-[#E6EDF2]'>
                Lowest Stock Models
              </h3>
              <p className='text-xs text-[#8FA3AF] mt-1'>
                Models with the lowest available quantity
              </p>
            </div>

            <div className='w-10 h-10 shrink-0 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center'>
              <FaBoxes className='text-[#36B6A0]' />
            </div>
          </div>

          {data.lowStock?.length ? (
            <div className='space-y-1'>
              {data.lowStock.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center gap-3 py-4 border-b border-[#34434D]/70 last:border-0'
                >
                  <div className='min-w-0'>
                    <p className='font-medium text-[#E6EDF2] text-sm truncate'>
                      {item._id?.brand} {item._id?.model}
                    </p>

                    <p className='text-xs text-[#82949F] mt-1'>Mobile model</p>
                  </div>

                  <span className='shrink-0 inline-flex items-center gap-2 bg-[#36B6A0]/10 text-[#36B6A0] border border-[#36B6A0]/20 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold'>
                    <FaExclamationTriangle size={11} />
                    {item.quantity} available
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-10 text-center'>
              <FaBoxes className='mx-auto text-3xl text-[#536773] mb-3' />
              <p className='text-sm text-[#8FA3AF]'>No inventory available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className='flex items-center justify-center gap-2 pt-2 pb-2'>
        <span className='w-2 h-2 rounded-full bg-[#36B6A0]' />
        <p className='text-xs text-[#71838E]'>Mobile Shop Management System</p>
      </div>
    </div>
  )
}
