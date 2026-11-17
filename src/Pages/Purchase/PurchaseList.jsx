import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get, put } from '../../services/api'
import { toast } from 'react-hot-toast'
import {
  FiShoppingBag,
  FiPlus,
  FiFileText,
  FiCalendar,
  FiPackage,
  FiDollarSign,
  FiXCircle,
  FiFilter
} from 'react-icons/fi'

import PageHeader from '../../Components/common/PageHeader.jsx'
import Loading from '../../Components/common/Loading.jsx'

const money = value => `৳${Number(value || 0).toLocaleString('en-BD')}`

const formatDate = date => {
  return new Date(date).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export default function PurchaseList () {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  const fetchPurchases = async () => {
    try {
      const result = await get('/purchases/all')
      setPurchases(result.purchases || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  const cancelPurchase = async id => {
    if (
      !window.confirm(
        'Cancel this purchase? This is allowed only if none of its phones have been sold.'
      )
    ) {
      return
    }

    setCancelling(id)

    try {
      await put(`/purchases/${id}/cancel`, {})
      toast.success('Purchase cancelled')
      await fetchPurchases()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCancelling(null)
    }
  }

  const totalQuantity = purchases.reduce(
    (sum, purchase) => sum + Number(purchase.totalQuantity || 0),
    0
  )

  const totalAmount = purchases.reduce(
    (sum, purchase) => sum + Number(purchase.totalAmount || 0),
    0
  )

  return (
    <div className='min-h-screen space-y-6 text-[#E6EDF2]'>
      {/* Header */}
      <PageHeader
        title='Purchases'
        description='Purchase history and stock entries.'
      >
        <Link
          to='/purchases/create'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#36B6A0] px-5 py-3 text-sm font-semibold text-[#101B24] shadow-lg shadow-[#36B6A0]/10 transition hover:bg-[#2DA38F]'
        >
          <FiPlus size={18} />
          New Purchase
        </Link>
      </PageHeader>

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Summary Cards */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Total Purchases */}
            <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#8FA3AF]'>Total Purchases</p>
                  <h3 className='mt-2 text-2xl font-bold text-[#E6EDF2]'>
                    {purchases.length}
                  </h3>
                </div>

                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                  <FiShoppingBag size={23} />
                </div>
              </div>
            </div>

            {/* Total Phones */}
            <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#8FA3AF]'>
                    Total Phones Purchased
                  </p>
                  <h3 className='mt-2 text-2xl font-bold text-[#E6EDF2]'>
                    {totalQuantity.toLocaleString('en-BD')}
                  </h3>
                </div>

                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                  <FiPackage size={23} />
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5 sm:col-span-2 lg:col-span-1'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#8FA3AF]'>
                    Total Purchase Amount
                  </p>
                  <h3 className='mt-2 text-2xl font-bold text-[#36B6A0]'>
                    {money(totalAmount)}
                  </h3>
                </div>

                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                  <FiDollarSign size={23} />
                </div>
              </div>
            </div>
          </div>

          {/* Purchase History */}
          <div className='overflow-hidden rounded-2xl border border-[#33434E] bg-[#202E38]'>
            {/* Section Header */}
            <div className='flex flex-col gap-2 border-b border-[#33434E] px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h3 className='font-semibold text-[#E6EDF2]'>
                  Purchase History
                </h3>
                <p className='mt-1 text-xs text-[#8FA3AF]'>
                  View and manage all purchase records
                </p>
              </div>

              <span className='w-fit rounded-lg bg-[#36B6A0]/10 px-3 py-1.5 text-xs font-semibold text-[#36B6A0]'>
                {purchases.length} Records
              </span>
            </div>

            {purchases.length === 0 ? (
              /* Empty State */
              <div className='flex flex-col items-center justify-center px-4 py-16 text-center'>
                <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                  <FiShoppingBag size={30} />
                </div>

                <h3 className='text-lg font-semibold text-[#E6EDF2]'>
                  No Purchases Found
                </h3>

                <p className='mt-2 max-w-sm text-sm text-[#8FA3AF]'>
                  You haven't added any purchases yet. Start by creating your
                  first purchase entry.
                </p>

                <Link
                  to='/purchases/create'
                  className='mt-5 inline-flex items-center gap-2 rounded-xl bg-[#36B6A0] px-5 py-3 text-sm font-semibold text-[#101B24] transition hover:bg-[#2DA38F]'
                >
                  <FiPlus size={17} />
                  Create Purchase
                </Link>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full min-w-[750px] text-left text-sm'>
                  <thead>
                    <tr className='border-b border-[#33434E] bg-[#101B24]/60 text-xs uppercase tracking-wider text-[#8FA3AF]'>
                      <th className='px-5 py-4 font-semibold'>Invoice</th>
                      <th className='px-5 py-4 font-semibold'>Date</th>
                      <th className='px-5 py-4 font-semibold'>Phones</th>
                      <th className='px-5 py-4 font-semibold'>Amount</th>
                      <th className='px-5 py-4 font-semibold'>Status</th>
                      <th className='px-5 py-4 text-center font-semibold'>
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className='divide-y divide-[#33434E]'>
                    {purchases.map(purchase => (
                      <tr
                        key={purchase._id}
                        className='transition hover:bg-[#101B24]/40'
                      >
                        {/* Invoice */}
                        <td className='px-5 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                              <FiFileText size={19} />
                            </div>

                            <div>
                              <p className='font-semibold text-[#E6EDF2]'>
                                {purchase.invoiceNumber}
                              </p>
                              <p className='mt-1 text-xs text-[#8FA3AF]'>
                                Purchase Invoice
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className='px-5 py-4'>
                          <div className='flex items-center gap-2 text-[#8FA3AF]'>
                            <FiCalendar size={15} className='text-[#36B6A0]' />
                            {formatDate(purchase.purchaseDate)}
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className='px-5 py-4'>
                          <span className='inline-flex items-center gap-2 rounded-lg bg-[#101B24] px-3 py-2 text-xs font-semibold text-[#E6EDF2]'>
                            <FiPackage className='text-[#36B6A0]' />
                            {purchase.totalQuantity}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className='px-5 py-4'>
                          <span className='font-bold text-[#36B6A0]'>
                            {money(purchase.totalAmount)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className='px-5 py-4'>
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              purchase.status === 'CANCELLED'
                                ? 'bg-red-400/10 text-red-400'
                                : 'bg-[#36B6A0]/10 text-[#36B6A0]'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                purchase.status === 'CANCELLED'
                                  ? 'bg-red-400'
                                  : 'bg-[#36B6A0]'
                              }`}
                            />
                            {purchase.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className='px-5 py-4'>
                          <div className='flex justify-center'>
                            <button
                              onClick={() => cancelPurchase(purchase._id)}
                              disabled={
                                cancelling === purchase._id ||
                                purchase.status === 'CANCELLED'
                              }
                              className='inline-flex items-center gap-2 rounded-lg border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-400 transition hover:border-red-400 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40'
                            >
                              <FiXCircle size={15} />
                              {cancelling === purchase._id
                                ? 'Cancelling...'
                                : purchase.status === 'CANCELLED'
                                ? 'Cancelled'
                                : 'Cancel'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {purchases.length > 0 && (
              <div className='border-t border-[#33434E] px-5 py-3'>
                <p className='text-xs text-[#8FA3AF]'>
                  Showing {purchases.length} purchase records
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
