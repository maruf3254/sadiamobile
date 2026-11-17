import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../../services/api'
import { toast } from 'react-hot-toast'
import {
  FiShoppingCart,
  FiPlus,
  FiFileText,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiPercent,
  FiEye,
  FiArrowUpRight
} from 'react-icons/fi'

import PageHeader from '../../Components/common/PageHeader.jsx'
import Loading from '../../Components/common/Loading.jsx'

const money = value => `৳${Number(value || 0).toLocaleString('en-BD')}`

const formatDate = date =>
  new Date(date).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

export default function SalesList () {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    get('/sales/all?limit=100')
      .then(result => setSales(result.sales || []))
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false))
  }, [])

  const totalQuantity = sales.reduce(
    (sum, sale) => sum + Number(sale.totalQuantity || 0),
    0
  )

  const totalSubtotal = sales.reduce(
    (sum, sale) => sum + Number(sale.subtotal || 0),
    0
  )

  const totalDiscount = sales.reduce(
    (sum, sale) => sum + Number(sale.discount || 0),
    0
  )

  return (
    <div className='min-h-screen space-y-6 text-[#E6EDF2]'>
      {/* Page Header */}
      <PageHeader title='Sales' description='View and manage sales invoices.'>
        <Link
          to='/sales/create'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#36B6A0] px-5 py-3 text-sm font-semibold text-[#101B24] shadow-lg shadow-[#36B6A0]/10 transition hover:bg-[#2DA38F]'
        >
          <FiPlus size={18} />
          New Sale
        </Link>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Summary Cards */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {/* Total Sales */}
            <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#8FA3AF]'>Total Sales Invoices</p>
                  <h3 className='mt-2 text-2xl font-bold text-[#E6EDF2]'>
                    {sales.length}
                  </h3>
                </div>

                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                  <FiShoppingCart size={23} />
                </div>
              </div>
            </div>

            {/* Total Phones Sold */}
            <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#8FA3AF]'>Total Phones Sold</p>
                  <h3 className='mt-2 text-2xl font-bold text-[#E6EDF2]'>
                    {totalQuantity.toLocaleString('en-BD')}
                  </h3>
                </div>

                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                  <FiPackage size={23} />
                </div>
              </div>
            </div>

            {/* Total Subtotal */}
            <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#8FA3AF]'>Total Subtotal</p>
                  <h3 className='mt-2 text-2xl font-bold text-[#36B6A0]'>
                    {money(totalSubtotal)}
                  </h3>
                </div>

                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                  <FiDollarSign size={23} />
                </div>
              </div>
            </div>

            {/* Total Discount */}
            <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5 sm:col-span-2 xl:col-span-1'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#8FA3AF]'>Total Discount</p>
                  <h3 className='mt-2 text-2xl font-bold text-[#E6EDF2]'>
                    {money(totalDiscount)}
                  </h3>
                </div>

                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400'>
                  <FiPercent size={23} />
                </div>
              </div>
            </div>
          </div>

          {/* Sales History */}
          <div className='overflow-hidden rounded-2xl border border-[#33434E] bg-[#202E38]'>
            {/* Table Header */}
            <div className='flex flex-col gap-2 border-b border-[#33434E] px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h3 className='font-semibold text-[#E6EDF2]'>Sales History</h3>
                <p className='mt-1 text-xs text-[#8FA3AF]'>
                  All sales invoices and transaction records
                </p>
              </div>

              <span className='w-fit rounded-lg bg-[#36B6A0]/10 px-3 py-1.5 text-xs font-semibold text-[#36B6A0]'>
                {sales.length} Records
              </span>
            </div>

            {sales.length === 0 ? (
              /* Empty State */
              <div className='flex flex-col items-center justify-center px-4 py-16 text-center'>
                <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                  <FiShoppingCart size={30} />
                </div>

                <h3 className='text-lg font-semibold text-[#E6EDF2]'>
                  No Sales Found
                </h3>

                <p className='mt-2 max-w-sm text-sm text-[#8FA3AF]'>
                  No sales invoices are available yet. Create your first sale to
                  get started.
                </p>

                <Link
                  to='/sales/create'
                  className='mt-5 inline-flex items-center gap-2 rounded-xl bg-[#36B6A0] px-5 py-3 text-sm font-semibold text-[#101B24] transition hover:bg-[#2DA38F]'
                >
                  <FiPlus size={17} />
                  Create Sale
                </Link>
              </div>
            ) : (
              /* Sales Table */
              <div className='overflow-x-auto'>
                <table className='w-full min-w-[850px] text-left text-sm'>
                  <thead>
                    <tr className='border-b border-[#33434E] bg-[#101B24]/60 text-xs uppercase tracking-wider text-[#8FA3AF]'>
                      <th className='px-5 py-4 font-semibold'>Invoice</th>
                      <th className='px-5 py-4 font-semibold'>Date</th>
                      <th className='px-5 py-4 font-semibold'>Phones</th>
                      <th className='px-5 py-4 font-semibold'>Subtotal</th>
                      <th className='px-5 py-4 font-semibold'>Discount</th>
                      <th className='px-5 py-4 font-semibold'>Status</th>
                      <th className='px-5 py-4 text-center font-semibold'>
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody className='divide-y divide-[#33434E]'>
                    {sales.map(sale => (
                      <tr
                        key={sale._id}
                        className='transition hover:bg-[#101B24]/40'
                      >
                        {/* Invoice */}
                        <td className='px-5 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                              <FiFileText size={19} />
                            </div>

                            <div>
                              <p className='font-semibold text-[#E6EDF2]'>
                                {sale.invoiceNumber}
                              </p>
                              <p className='mt-1 text-xs text-[#8FA3AF]'>
                                Sales Invoice
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className='px-5 py-4'>
                          <div className='flex items-center gap-2 text-[#8FA3AF]'>
                            <FiCalendar size={15} className='text-[#36B6A0]' />
                            {formatDate(sale.saleDate)}
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className='px-5 py-4'>
                          <span className='inline-flex items-center gap-2 rounded-lg bg-[#101B24] px-3 py-2 text-xs font-semibold text-[#E6EDF2]'>
                            <FiPackage className='text-[#36B6A0]' />
                            {sale.totalQuantity}
                          </span>
                        </td>

                        {/* Subtotal */}
                        <td className='px-5 py-4 font-semibold text-[#E6EDF2]'>
                          {money(sale.subtotal)}
                        </td>

                        {/* Discount */}
                        <td className='px-5 py-4 font-medium text-amber-400'>
                          {money(sale.discount)}
                        </td>

                        {/* Status */}
                        <td className='px-5 py-4'>
                          <span className='inline-flex items-center gap-2 rounded-full bg-[#36B6A0]/10 px-3 py-1.5 text-xs font-semibold text-[#36B6A0]'>
                            <span className='h-1.5 w-1.5 rounded-full bg-[#36B6A0]' />
                            {sale.status}
                          </span>
                        </td>

                        {/* Details */}
                        <td className='px-5 py-4'>
                          <div className='flex justify-center'>
                            <Link
                              to={`/sales/${sale._id}`}
                              className='inline-flex items-center gap-2 rounded-lg border border-[#33434E] px-3 py-2 text-xs font-semibold text-[#36B6A0] transition hover:border-[#36B6A0] hover:bg-[#36B6A0]/10'
                            >
                              <FiEye size={15} />
                              View
                              <FiArrowUpRight size={13} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {sales.length > 0 && (
              <div className='border-t border-[#33434E] px-5 py-3'>
                <p className='text-xs text-[#8FA3AF]'>
                  Showing {sales.length} sales records
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
