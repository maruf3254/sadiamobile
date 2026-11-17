import React, { useEffect, useState } from 'react'
import { get } from '../../services/api'
import { toast } from 'react-hot-toast'
import {
  FiSmartphone,
  FiDollarSign,
  FiTrendingUp,
  FiPackage,
  FiHash,
  FiRefreshCw,
  FiLayers
} from 'react-icons/fi'

import PageHeader from '../../Components/common/PageHeader.jsx'
import Loading from '../../Components/common/Loading.jsx'

export default function InventoryReport () {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    get('/reports/inventory')
      .then(setData)
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false))
  }, [])

  const formatCurrency = amount =>
    `৳${Number(amount || 0).toLocaleString('en-BD')}`

  if (loading) return <Loading />

  if (!data) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title='Inventory Report'
          description='Current available phone inventory.'
        />

        <div className='rounded-2xl border border-[#33434E] bg-[#202E38] px-5 py-16 text-center'>
          <FiPackage size={40} className='mx-auto text-[#8FA3AF]' />

          <h3 className='mt-4 text-lg font-semibold text-[#E6EDF2]'>
            Unable to Load Inventory Report
          </h3>

          <p className='mt-2 text-sm text-[#8FA3AF]'>
            Something went wrong while fetching inventory data.
          </p>

          <button
            onClick={() => {
              setLoading(true)
              get('/reports/inventory')
                .then(setData)
                .catch(error => toast.error(error.message))
                .finally(() => setLoading(false))
            }}
            className='mt-5 inline-flex items-center gap-2 rounded-xl bg-[#36B6A0] px-5 py-3 text-sm font-semibold text-[#101B24] transition hover:bg-[#2da58f]'
          >
            <FiRefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { summary, stock } = data

  const summaryCards = [
    {
      title: 'Available Phones',
      value: Number(summary.totalPhones || 0).toLocaleString('en-BD'),
      description: 'Total phones in current stock',
      icon: FiSmartphone,
      color: 'text-[#36B6A0]',
      bg: 'bg-[#36B6A0]/10'
    },
    {
      title: 'Purchase Value',
      value: formatCurrency(summary.totalPurchaseValue),
      description: 'Total inventory purchase cost',
      icon: FiDollarSign,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Potential Selling Value',
      value: formatCurrency(summary.totalSellingValue),
      description: 'Expected value from current stock',
      icon: FiTrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    }
  ]

  return (
    <div className='space-y-6 pb-6'>
      <PageHeader
        title='Inventory Report'
        description='Monitor available phone inventory, purchase value and selling value.'
      />

      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {summaryCards.map(card => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5 transition hover:border-[#36B6A0]/50'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-[#8FA3AF]'>
                    {card.title}
                  </p>

                  <h2 className='mt-3 break-words text-2xl font-bold text-[#E6EDF2]'>
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
                >
                  <Icon size={23} />
                </div>
              </div>

              <p className='mt-4 text-xs text-[#8FA3AF]'>{card.description}</p>
            </div>
          )
        })}
      </div>

      {/* Inventory Table */}
      <div className='overflow-hidden rounded-2xl border border-[#33434E] bg-[#202E38]'>
        <div className='flex flex-col gap-3 border-b border-[#33434E] p-5 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-[#E6EDF2]'>
              Available Phone Inventory
            </h3>

            <p className='mt-1 text-sm text-[#8FA3AF]'>
              Detailed information about phones currently in stock.
            </p>
          </div>

          <div className='flex w-fit items-center gap-2 rounded-lg bg-[#36B6A0]/10 px-3 py-2 text-sm font-medium text-[#36B6A0]'>
            <FiLayers size={16} />
            {stock.length} Phones
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full min-w-[800px] text-left text-sm'>
            <thead className='bg-[#101B24] text-xs uppercase tracking-wider text-[#8FA3AF]'>
              <tr>
                <th className='px-5 py-4 font-semibold'>Brand</th>
                <th className='px-5 py-4 font-semibold'>Model</th>
                <th className='px-5 py-4 font-semibold'>IMEI</th>
                <th className='px-5 py-4 font-semibold'>Color</th>
                <th className='px-5 py-4 text-right font-semibold'>
                  Purchase Price
                </th>
                <th className='px-5 py-4 text-right font-semibold'>
                  Selling Price
                </th>
              </tr>
            </thead>

            <tbody className='divide-y divide-[#33434E]'>
              {stock.length > 0 ? (
                stock.map(phone => (
                  <tr
                    key={phone._id}
                    className='transition hover:bg-[#101B24]/50'
                  >
                    <td className='px-5 py-4'>
                      <span className='inline-flex items-center gap-2 font-medium text-[#E6EDF2]'>
                        <FiSmartphone className='shrink-0 text-[#36B6A0]' />
                        {phone.brand}
                      </span>
                    </td>

                    <td className='px-5 py-4 font-medium text-[#E6EDF2]'>
                      {phone.model}
                    </td>

                    <td className='px-5 py-4'>
                      <span className='inline-flex items-center gap-2 rounded-lg bg-[#101B24] px-3 py-1.5 font-mono text-xs text-[#8FA3AF]'>
                        <FiHash size={13} />
                        {phone.imei}
                      </span>
                    </td>

                    <td className='px-5 py-4 text-[#8FA3AF]'>{phone.color}</td>

                    <td className='whitespace-nowrap px-5 py-4 text-right text-[#8FA3AF]'>
                      {formatCurrency(phone.purchasePrice)}
                    </td>

                    <td className='whitespace-nowrap px-5 py-4 text-right font-semibold text-[#36B6A0]'>
                      {formatCurrency(phone.sellingPrice)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='px-5 py-16 text-center'>
                    <FiPackage
                      size={38}
                      className='mx-auto mb-3 text-[#8FA3AF]'
                    />

                    <p className='font-medium text-[#E6EDF2]'>
                      No Inventory Found
                    </p>

                    <p className='mt-1 text-sm text-[#8FA3AF]'>
                      There are currently no phones available in stock.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='flex flex-col gap-2 border-t border-[#33434E] px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-xs text-[#8FA3AF]'>
            Showing {stock.length} available phones
          </p>

          <p className='text-xs text-[#8FA3AF]'>Inventory Overview</p>
        </div>
      </div>
    </div>
  )
}
