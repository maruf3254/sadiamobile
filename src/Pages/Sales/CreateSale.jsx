import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { get, post } from '../../services/api'
import PageHeader from '../../Components/common/PageHeader.jsx'
import Loading from '../../Components/common/Loading.jsx'

import {
  FiCalendar,
  FiSearch,
  FiSmartphone,
  FiCheckCircle,
  FiShoppingCart,
  FiTag,
  FiDollarSign,
  FiFileText,
  FiX,
  FiArrowLeft,
  FiPackage,
  FiCreditCard
} from 'react-icons/fi'

const money = (value = 0) =>
  `৳${Number(value || 0).toLocaleString('en-BD', {
    maximumFractionDigits: 2
  })}`

export default function CreateSale () {
  const navigate = useNavigate()

  const [mobiles, setMobiles] = useState([])
  const [selected, setSelected] = useState([])
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState('')
  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    get('/mobile/all?status=IN_STOCK&limit=100')
      .then(result => setMobiles(result.mobiles || []))
      .catch(error => toast.error(error.message))
      .finally(() => setLoading(false))
  }, [])

  const togglePhone = id => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const selectedPhones = mobiles.filter(phone => selected.includes(phone._id))

  const subtotal = selectedPhones.reduce(
    (sum, phone) => sum + Number(phone.sellingPrice || 0),
    0
  )

  const finalDiscount = Number(discount) || 0
  const total = subtotal - finalDiscount

  const filtered = mobiles.filter(phone =>
    `${phone.brand} ${phone.model} ${phone.imei}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const handleSubmit = async e => {
    e.preventDefault()

    if (!selected.length) {
      return toast.error('Select at least one phone.')
    }

    if (finalDiscount < 0 || finalDiscount > subtotal) {
      return toast.error('Invalid discount.')
    }

    setSaving(true)

    try {
      const result = await post('/sales/create', {
        items: selected.map(id => ({ mobile: id })),
        discount: finalDiscount,
        saleDate,
        notes
      })

      toast.success(`Sale created: ${result.sale.invoiceNumber}`)
      navigate('/sales')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className='space-y-6'>
      <PageHeader
        title='New Sale'
        description='Select available phones and create a sales invoice.'
      />

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Sale Information */}
        <div className='bg-[#202E38] border border-[#33434E] rounded-2xl p-5 sm:p-6'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='w-10 h-10 rounded-xl bg-[#36B6A0]/10 text-[#36B6A0] flex items-center justify-center'>
              <FiFileText size={20} />
            </div>

            <div>
              <h3 className='text-[#E6EDF2] font-semibold'>Sale Information</h3>
              <p className='text-[#8FA3AF] text-xs mt-1'>
                Set the date and find phones for this sale.
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='flex items-center gap-2 text-sm text-[#8FA3AF] mb-2'>
                <FiCalendar className='text-[#36B6A0]' />
                Sale Date
              </label>

              <input
                type='date'
                value={saleDate}
                onChange={e => setSaleDate(e.target.value)}
                className='w-full bg-[#101B24] border border-[#33434E] rounded-xl px-4 py-3 text-sm text-[#E6EDF2] outline-none focus:border-[#36B6A0] transition color-scheme-dark'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm text-[#8FA3AF] mb-2'>
                <FiSearch className='text-[#36B6A0]' />
                Search Phone
              </label>

              <div className='relative'>
                <FiSearch
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-[#71838E]'
                  size={18}
                />

                <input
                  type='search'
                  placeholder='Search brand, model or IMEI...'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className='w-full bg-[#101B24] border border-[#33434E] rounded-xl pl-11 pr-4 py-3 text-sm text-[#E6EDF2] placeholder:text-[#71838E] outline-none focus:border-[#36B6A0] transition'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Available Phones */}
        <div className='bg-[#202E38] border border-[#33434E] rounded-2xl overflow-hidden'>
          <div className='p-5 sm:p-6 border-b border-[#33434E] flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-[#36B6A0]/10 text-[#36B6A0] flex items-center justify-center'>
                <FiSmartphone size={21} />
              </div>

              <div>
                <h3 className='text-[#E6EDF2] font-semibold'>
                  Available Phones
                </h3>

                <p className='text-[#8FA3AF] text-xs mt-1'>
                  Select phones to add to this invoice.
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <span className='px-3 py-1.5 rounded-lg bg-[#101B24] border border-[#33434E] text-[#8FA3AF] text-xs'>
                {filtered.length} Available
              </span>

              <span className='px-3 py-1.5 rounded-lg bg-[#36B6A0]/10 border border-[#36B6A0]/20 text-[#36B6A0] text-xs font-semibold'>
                {selected.length} Selected
              </span>
            </div>
          </div>

          <div className='divide-y divide-[#33434E]'>
            {filtered.map(phone => {
              const isSelected = selected.includes(phone._id)

              return (
                <label
                  key={phone._id}
                  className={`p-4 sm:px-6 flex items-center gap-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#36B6A0]/5' : 'hover:bg-[#101B24]/50'
                  }`}
                >
                  <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={() => togglePhone(phone._id)}
                    className='w-5 h-5 shrink-0 accent-[#36B6A0] cursor-pointer'
                  />

                  <div className='w-11 h-11 shrink-0 rounded-xl bg-[#101B24] flex items-center justify-center text-[#36B6A0]'>
                    <FiSmartphone size={21} />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-[#E6EDF2] text-sm sm:text-base'>
                      {phone.brand} {phone.model}
                    </p>

                    <p className='text-xs text-[#8FA3AF] mt-1 break-all'>
                      IMEI: {phone.imei}
                    </p>
                  </div>

                  <div className='text-right shrink-0'>
                    <p className='text-[#36B6A0] font-bold text-sm sm:text-base'>
                      {money(phone.sellingPrice)}
                    </p>

                    {isSelected && (
                      <span className='inline-flex items-center gap-1 text-[10px] text-[#36B6A0] mt-1'>
                        <FiCheckCircle size={11} />
                        Selected
                      </span>
                    )}
                  </div>
                </label>
              )
            })}

            {!filtered.length && (
              <div className='py-14 px-5 text-center'>
                <div className='w-14 h-14 rounded-2xl bg-[#101B24] flex items-center justify-center mx-auto text-[#71838E]'>
                  <FiPackage size={26} />
                </div>

                <h3 className='text-[#E6EDF2] font-semibold mt-4'>
                  No Available Phones
                </h3>

                <p className='text-[#8FA3AF] text-sm mt-1'>
                  No phones found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Phones */}
        {selectedPhones.length > 0 && (
          <div className='bg-[#202E38] border border-[#33434E] rounded-2xl overflow-hidden'>
            <div className='p-5 border-b border-[#33434E]'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 rounded-lg bg-[#36B6A0]/10 text-[#36B6A0] flex items-center justify-center'>
                  <FiCheckCircle size={19} />
                </div>

                <div>
                  <h3 className='text-[#E6EDF2] font-semibold'>
                    Selected Phones
                  </h3>
                  <p className='text-[#8FA3AF] text-xs mt-1'>
                    {selectedPhones.length} phone(s) added to this sale.
                  </p>
                </div>
              </div>
            </div>

            <div className='divide-y divide-[#33434E]'>
              {selectedPhones.map(phone => (
                <div
                  key={phone._id}
                  className='px-5 py-3 flex items-center gap-3'
                >
                  <FiSmartphone className='text-[#36B6A0] shrink-0' />

                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-[#E6EDF2] font-medium'>
                      {phone.brand} {phone.model}
                    </p>
                    <p className='text-xs text-[#8FA3AF]'>IMEI: {phone.imei}</p>
                  </div>

                  <strong className='text-sm text-[#E6EDF2]'>
                    {money(phone.sellingPrice)}
                  </strong>

                  <button
                    type='button'
                    onClick={() => togglePhone(phone._id)}
                    aria-label='Remove selected phone'
                    className='w-8 h-8 rounded-lg flex items-center justify-center text-[#8FA3AF] hover:text-red-400 hover:bg-red-500/10 transition'
                  >
                    <FiX size={17} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className='bg-[#202E38] border border-[#33434E] rounded-2xl overflow-hidden'>
          <div className='p-5 sm:p-6 border-b border-[#33434E] flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-[#36B6A0]/10 text-[#36B6A0] flex items-center justify-center'>
              <FiCreditCard size={21} />
            </div>

            <div>
              <h3 className='text-[#E6EDF2] font-semibold'>Payment Summary</h3>
              <p className='text-[#8FA3AF] text-xs mt-1'>
                Review the invoice amount before completing the sale.
              </p>
            </div>
          </div>

          <div className='p-5 sm:p-6 space-y-5'>
            {/* Selected Count */}
            <div className='flex items-center justify-between text-sm'>
              <span className='text-[#8FA3AF] flex items-center gap-2'>
                <FiSmartphone />
                Selected Phones
              </span>

              <strong className='text-[#E6EDF2]'>{selected.length}</strong>
            </div>

            {/* Subtotal */}
            <div className='flex items-center justify-between text-sm'>
              <span className='text-[#8FA3AF] flex items-center gap-2'>
                <FiDollarSign />
                Subtotal
              </span>

              <strong className='text-[#E6EDF2]'>{money(subtotal)}</strong>
            </div>

            {/* Discount */}
            <div>
              <label className='flex items-center gap-2 text-sm text-[#8FA3AF] mb-2'>
                <FiTag className='text-[#36B6A0]' />
                Discount Amount (৳)
              </label>

              <input
                type='number'
                min='0'
                max={subtotal}
                step='0.01'
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                className='w-full sm:max-w-sm bg-[#101B24] border border-[#33434E] rounded-xl px-4 py-3 text-sm text-[#E6EDF2] outline-none focus:border-[#36B6A0] transition'
                placeholder='Enter discount amount'
              />
            </div>

            {/* Total */}
            <div className='border-t border-[#33434E] pt-5'>
              <div className='bg-[#101B24] border border-[#36B6A0]/20 rounded-xl p-5'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-[#8FA3AF] text-sm'>Total Amount</p>

                    <p className='text-xs text-[#71838E] mt-1'>
                      After discount
                    </p>
                  </div>

                  <h2 className='text-2xl sm:text-3xl font-bold text-[#36B6A0]'>
                    {money(total)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className='flex items-center gap-2 text-sm text-[#8FA3AF] mb-2'>
                <FiFileText className='text-[#36B6A0]' />
                Sale Notes
              </label>

              <textarea
                rows='3'
                placeholder='Write any additional sale notes...'
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className='w-full resize-none bg-[#101B24] border border-[#33434E] rounded-xl px-4 py-3 text-sm text-[#E6EDF2] placeholder:text-[#71838E] outline-none focus:border-[#36B6A0] transition'
              />
            </div>

            {/* Actions */}
            <div className='flex flex-col-reverse sm:flex-row gap-3 pt-2'>
              <button
                type='button'
                onClick={() => navigate('/sales')}
                disabled={saving}
                className='flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#33434E] text-[#8FA3AF] hover:bg-[#101B24] hover:text-[#E6EDF2] transition disabled:opacity-50'
              >
                <FiArrowLeft size={17} />
                Cancel
              </button>

              <button
                type='submit'
                disabled={
                  saving ||
                  !selected.length ||
                  finalDiscount < 0 ||
                  finalDiscount > subtotal
                }
                className='flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#36B6A0] text-[#101B24] font-bold hover:bg-[#2DA58F] transition disabled:opacity-40 disabled:cursor-not-allowed'
              >
                <FiShoppingCart size={19} />

                {saving ? 'Processing Sale...' : 'Complete Sale'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
