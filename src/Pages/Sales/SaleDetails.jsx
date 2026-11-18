import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get, post } from '../../services/api'
import { toast } from 'react-hot-toast'
import PageHeader from '../../Components/common/PageHeader.jsx'
import Loading from '../../Components/common/Loading.jsx'

import {
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiPercent,
  FiRefreshCw,
  FiSmartphone,
  FiCheckCircle,
  FiAlertCircle,
  FiRotateCcw,
  FiPackage
} from 'react-icons/fi'

const money = (value = 0) =>
  `৳${Number(value || 0).toLocaleString('en-BD', {
    maximumFractionDigits: 2
  })}`

export default function SaleDetails () {
  const { id } = useParams()

  const [sale, setSale] = useState(null)
  const [loading, setLoading] = useState(true)
  const [returning, setReturning] = useState([])
  const [reason, setReason] = useState('')
  const [isReturning, setIsReturning] = useState(false)

  const fetchSale = async () => {
    try {
      const result = await get(`/sales/${id}`)
      setSale(result.sale)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSale()
  }, [id])

  const handleReturn = async () => {
    if (!returning.length) {
      return toast.error('Select a phone to return.')
    }

    if (!window.confirm('Confirm return of selected phones?')) return

    try {
      setIsReturning(true)

      await post(`/sales/${id}/return`, {
        imeis: returning,
        reason
      })

      toast.success('Return recorded successfully')

      setReturning([])
      setReason('')

      await fetchSale()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsReturning(false)
    }
  }

  if (loading) return <Loading />

  if (!sale) {
    return (
      <div className='bg-[#202E38] border border-[#33434E] rounded-2xl p-10 text-center'>
        <FiAlertCircle className='text-red-400 text-4xl mx-auto mb-3' />

        <h3 className='text-[#E6EDF2] font-semibold text-lg'>Sale Not Found</h3>

        <p className='text-[#8FA3AF] text-sm mt-2'>
          The requested sale information could not be found.
        </p>
      </div>
    )
  }

  const returned = new Set((sale.returnedItems || []).map(item => item.imei))

  const returnedCount = (sale.items || []).filter(item =>
    returned.has(item.imei)
  ).length

  const availableCount = (sale.items || []).length - returnedCount

  const stats = [
    {
      label: 'Sale Date',
      value: new Date(sale.saleDate).toLocaleDateString('en-BD'),
      icon: FiCalendar
    },
    {
      label: 'Subtotal',
      value: money(sale.subtotal),
      icon: FiDollarSign
    },
    {
      label: 'Discount',
      value: money(sale.discount),
      icon: FiPercent
    },
    {
      label: 'Refunded',
      value: money(sale.refundedAmount),
      icon: FiRefreshCw,
      valueColor: 'text-red-400'
    }
  ]

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Sale Details'
        description={`Invoice: ${sale.invoiceNumber}`}
      />

      {/* Invoice Overview */}
      <div className='bg-[#202E38] border border-[#33434E] rounded-2xl overflow-hidden'>
        {/* Invoice Header */}
        <div className='p-5 sm:p-6 border-b border-[#33434E] flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0]'>
              <FiFileText size={23} />
            </div>

            <div>
              <p className='text-xs text-[#8FA3AF] mb-1'>Invoice Number</p>

              <h3 className='text-[#E6EDF2] font-bold text-lg'>
                {sale.invoiceNumber}
              </h3>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold w-fit ${
              sale.status === 'RETURNED'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-[#36B6A0]/10 text-[#36B6A0] border border-[#36B6A0]/20'
            }`}
          >
            {sale.status === 'RETURNED' ? (
              <FiRotateCcw size={14} />
            ) : (
              <FiCheckCircle size={14} />
            )}

            {sale.status || 'COMPLETED'}
          </span>
        </div>

        {/* Invoice Statistics */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#33434E]'>
          {stats.map(stat => {
            const Icon = stat.icon

            return (
              <div key={stat.label} className='p-5'>
                <div className='flex items-center gap-2 text-[#8FA3AF] text-xs mb-3'>
                  <Icon size={15} className='text-[#36B6A0]' />
                  {stat.label}
                </div>

                <h3
                  className={`text-lg font-bold ${
                    stat.valueColor || 'text-[#E6EDF2]'
                  }`}
                >
                  {stat.value}
                </h3>
              </div>
            )
          })}
        </div>
      </div>

      {/* Phone Summary */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='bg-[#202E38] border border-[#33434E] rounded-xl p-5'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-[#8FA3AF]'>Total Phones</p>
            <FiPackage className='text-[#36B6A0]' size={20} />
          </div>

          <h3 className='text-2xl font-bold text-[#E6EDF2] mt-3'>
            {sale.items.length}
          </h3>
        </div>

        <div className='bg-[#202E38] border border-[#33434E] rounded-xl p-5'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-[#8FA3AF]'>Available for Return</p>
            <FiSmartphone className='text-blue-400' size={20} />
          </div>

          <h3 className='text-2xl font-bold text-[#E6EDF2] mt-3'>
            {availableCount}
          </h3>
        </div>

        <div className='bg-[#202E38] border border-[#33434E] rounded-xl p-5'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-[#8FA3AF]'>Returned Phones</p>
            <FiRotateCcw className='text-red-400' size={20} />
          </div>

          <h3 className='text-2xl font-bold text-[#E6EDF2] mt-3'>
            {returnedCount}
          </h3>
        </div>
      </div>

      {/* Phone Items */}
      <div className='bg-[#202E38] border border-[#33434E] rounded-2xl overflow-hidden'>
        {/* Table Header */}
        <div className='p-5 sm:p-6 border-b border-[#33434E]'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div>
              <h3 className='text-[#E6EDF2] font-semibold text-lg'>
                Purchased Phones
              </h3>

              <p className='text-[#8FA3AF] text-xs mt-1'>
                Select phones below to process a return.
              </p>
            </div>

            <span className='text-xs text-[#8FA3AF] bg-[#101B24] border border-[#33434E] px-3 py-2 rounded-lg'>
              {sale.items.length} Items
            </span>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[750px] text-sm'>
            <thead className='bg-[#101B24]'>
              <tr className='text-left text-[#8FA3AF]'>
                <th className='px-5 py-4 font-medium'>Return</th>
                <th className='px-5 py-4 font-medium'>Phone</th>
                <th className='px-5 py-4 font-medium'>IMEI</th>
                <th className='px-5 py-4 font-medium'>Selling Price</th>
                <th className='px-5 py-4 font-medium'>Net Amount</th>
                <th className='px-5 py-4 font-medium'>Status</th>
              </tr>
            </thead>

            <tbody>
              {sale.items.map(item => {
                const isReturned = returned.has(item.imei)
                const isSelected = returning.includes(item.imei)

                return (
                  <tr
                    key={item.imei}
                    className={`border-t border-[#33434E] transition-colors ${
                      isSelected ? 'bg-[#36B6A0]/5' : 'hover:bg-[#101B24]/50'
                    }`}
                  >
                    <td className='px-5 py-4'>
                      {!isReturned && sale.status !== 'RETURNED' ? (
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={() =>
                            setReturning(prev =>
                              prev.includes(item.imei)
                                ? prev.filter(v => v !== item.imei)
                                : [...prev, item.imei]
                            )
                          }
                          className='w-4 h-4 accent-[#36B6A0] cursor-pointer'
                        />
                      ) : (
                        <span className='text-[#71838E]'>—</span>
                      )}
                    </td>

                    <td className='px-5 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-lg bg-[#101B24] flex items-center justify-center text-[#36B6A0]'>
                          <FiSmartphone size={17} />
                        </div>

                        <span className='text-[#E6EDF2] font-medium'>
                          {item.brand} {item.model}
                        </span>
                      </div>
                    </td>

                    <td className='px-5 py-4 text-[#8FA3AF] font-mono text-xs'>
                      {item.imei}
                    </td>

                    <td className='px-5 py-4 text-[#E6EDF2] font-medium'>
                      {money(item.sellingPrice)}
                    </td>

                    <td className='px-5 py-4 text-[#E6EDF2] font-semibold'>
                      {money(item.netAmount)}
                    </td>

                    <td className='px-5 py-4'>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          isReturned
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-[#36B6A0]/10 text-[#36B6A0]'
                        }`}
                      >
                        {isReturned ? (
                          <FiRotateCcw size={12} />
                        ) : (
                          <FiCheckCircle size={12} />
                        )}

                        {isReturned ? 'Returned' : 'Sold'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {sale.items.length === 0 && (
          <div className='text-center py-12'>
            <FiPackage className='text-[#71838E] text-4xl mx-auto mb-3' />
            <p className='text-[#8FA3AF] text-sm'>No phone items found.</p>
          </div>
        )}
      </div>

      {/* Return Form */}
      {sale.status !== 'RETURNED' && (
        <div className='bg-[#202E38] border border-[#33434E] rounded-2xl overflow-hidden'>
          <div className='p-5 sm:p-6 border-b border-[#33434E]'>
            <div className='flex items-center gap-3'>
              <div className='w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400'>
                <FiRotateCcw size={21} />
              </div>

              <div>
                <h3 className='text-[#E6EDF2] font-semibold text-lg'>
                  Record Phone Return
                </h3>

                <p className='text-[#8FA3AF] text-xs mt-1'>
                  Select the phones and provide a return reason.
                </p>
              </div>
            </div>
          </div>

          <div className='p-5 sm:p-6 space-y-5'>
            {/* Selected Count */}
            <div className='flex items-center justify-between gap-3 bg-[#101B24] border border-[#33434E] rounded-xl p-4'>
              <div>
                <p className='text-xs text-[#8FA3AF]'>Selected Phones</p>

                <p className='text-[#E6EDF2] font-bold text-xl mt-1'>
                  {returning.length}
                </p>
              </div>

              <FiSmartphone size={25} className='text-[#36B6A0]' />
            </div>

            {/* Return Reason */}
            <div>
              <label className='block text-sm font-medium text-[#E6EDF2] mb-2'>
                Return Reason
              </label>

              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder='Enter the reason for returning the selected phones...'
                rows={4}
                className='w-full bg-[#101B24] border border-[#33434E] rounded-xl px-4 py-3 text-sm text-[#E6EDF2] placeholder:text-[#71838E] outline-none focus:border-[#36B6A0] focus:ring-2 focus:ring-[#36B6A0]/10 transition resize-none'
              />
            </div>

            {/* Return Button */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#33434E]'>
              <p className='text-xs text-[#8FA3AF]'>
                Please verify the selected phones before confirming.
              </p>

              <button
                onClick={handleReturn}
                disabled={!returning.length || isReturning}
                className='flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed'
              >
                <FiRotateCcw
                  size={17}
                  className={isReturning ? 'animate-spin' : ''}
                />

                {isReturning
                  ? 'Processing Return...'
                  : `Confirm Return (${returning.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
