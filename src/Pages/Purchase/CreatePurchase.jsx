import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { post } from '../../services/api'
import PageHeader from '../../Components/common/PageHeader.jsx'

import {
  FiCalendar,
  FiPlus,
  FiTrash2,
  FiSmartphone,
  FiDollarSign,
  FiPackage,
  FiFileText,
  FiSave,
  FiArrowLeft,
  FiShield
} from 'react-icons/fi'

const emptyPhone = () => ({
  brand: '',
  model: '',
  imei: '',
  imei2: '',
  color: '',
  ram: '',
  storage: '',
  purchasePrice: '',
  sellingPrice: '',
  warrantyMonths: 0
})

const money = (value = 0) =>
  `৳${Number(value).toLocaleString('en-BD', {
    maximumFractionDigits: 2
  })}`

export default function CreatePurchase () {
  const navigate = useNavigate()

  const [items, setItems] = useState([emptyPhone()])

  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const updateItem = (index, field, value) => {
    setItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const addPhone = () => {
    setItems(prev => [...prev, emptyPhone()])
  }

  const removePhone = index => {
    if (items.length === 1) return

    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const total = items.reduce(
    (sum, item) => sum + (Number(item.purchasePrice) || 0),
    0
  )

  const handleSubmit = async e => {
    e.preventDefault()

    const invalid = items.some(
      item =>
        !item.brand.trim() ||
        !item.model.trim() ||
        !item.imei.trim() ||
        item.purchasePrice === '' ||
        item.sellingPrice === '' ||
        !Number.isFinite(Number(item.purchasePrice)) ||
        !Number.isFinite(Number(item.sellingPrice)) ||
        Number(item.purchasePrice) < 0 ||
        Number(item.sellingPrice) < 0
    )

    if (invalid) {
      return toast.error('Please complete all required phone information.')
    }

    setLoading(true)

    try {
      const result = await post('/purchases/create', {
        purchaseDate,
        notes,
        items: items.map(item => ({
          ...item,
          purchasePrice: Number(item.purchasePrice),
          sellingPrice: Number(item.sellingPrice),
          warrantyMonths: Number(item.warrantyMonths)
        }))
      })

      toast.success(`Purchase created: ${result.purchase.invoiceNumber}`)

      navigate('/purchases')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    ['brand', 'Brand *'],
    ['model', 'Model *'],
    ['imei', 'IMEI 1 *'],
    ['imei2', 'IMEI 2'],
    ['color', 'Color'],
    ['ram', 'RAM'],
    ['storage', 'Storage'],
    ['purchasePrice', 'Purchase Price *'],
    ['sellingPrice', 'Selling Price *'],
    ['warrantyMonths', 'Warranty (Months)']
  ]

  const inputClass =
    'w-full bg-[#101B24] border border-[#33434E] rounded-xl px-4 py-3 text-sm text-[#E6EDF2] placeholder:text-[#71838E] outline-none focus:border-[#36B6A0] focus:ring-2 focus:ring-[#36B6A0]/10 transition-all'

  const labelClass = 'block text-xs font-medium text-[#8FA3AF] mb-2'

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <PageHeader
          title='New Purchase'
          description='Record newly purchased mobile phones in your inventory.'
        />

        <button
          type='button'
          onClick={() => navigate('/purchases')}
          className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#33434E] text-[#8FA3AF] hover:text-[#36B6A0] hover:border-[#36B6A0]/40 transition text-sm font-medium'
        >
          <FiArrowLeft size={17} />
          Back to Purchases
        </button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Purchase Information */}
        <div className='bg-[#202E38] border border-[#33434E] rounded-2xl p-5 sm:p-6'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='w-10 h-10 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0]'>
              <FiCalendar size={20} />
            </div>

            <div>
              <h3 className='text-[#E6EDF2] font-semibold'>
                Purchase Information
              </h3>
              <p className='text-[#8FA3AF] text-xs mt-1'>
                Enter the purchase date.
              </p>
            </div>
          </div>

          <div className='max-w-md'>
            <label className={labelClass}>Purchase Date *</label>

            <input
              type='date'
              required
              value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
              className={`${inputClass} color-scheme-dark`}
            />
          </div>
        </div>

        {/* Phone Items */}
        <div className='space-y-5'>
          {items.map((item, index) => (
            <div
              key={index}
              className='bg-[#202E38] border border-[#33434E] rounded-2xl overflow-hidden'
            >
              {/* Phone Header */}
              <div className='flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-[#33434E] bg-[#202E38]'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-xl bg-[#36B6A0]/10 text-[#36B6A0] flex items-center justify-center'>
                    <FiSmartphone size={20} />
                  </div>

                  <div>
                    <h3 className='text-[#E6EDF2] font-semibold'>
                      Phone #{index + 1}
                    </h3>
                    <p className='text-[#8FA3AF] text-xs mt-1'>
                      Mobile device information
                    </p>
                  </div>
                </div>

                {items.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removePhone(index)}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition text-xs font-semibold'
                  >
                    <FiTrash2 size={15} />
                    <span className='hidden sm:inline'>Remove</span>
                  </button>
                )}
              </div>

              {/* Phone Form */}
              <div className='p-5 sm:p-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                  {fields.map(([field, label]) => {
                    const isNumber = [
                      'purchasePrice',
                      'sellingPrice',
                      'warrantyMonths'
                    ].includes(field)

                    return (
                      <div key={field}>
                        <label className={labelClass}>{label}</label>

                        <input
                          type={isNumber ? 'number' : 'text'}
                          min={isNumber ? '0' : undefined}
                          step={
                            ['purchasePrice', 'sellingPrice'].includes(field)
                              ? '0.01'
                              : undefined
                          }
                          required={label.includes('*')}
                          placeholder={`Enter ${label
                            .replace(' *', '')
                            .toLowerCase()}`}
                          value={item[field]}
                          onChange={e =>
                            updateItem(index, field, e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    )
                  })}
                </div>

                {/* Phone Price Summary */}
                <div className='mt-5 pt-4 border-t border-[#33434E] grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex items-center justify-between bg-[#101B24] rounded-xl p-4'>
                    <span className='text-xs text-[#8FA3AF]'>
                      Purchase Price
                    </span>

                    <strong className='text-[#E6EDF2] text-sm'>
                      {money(item.purchasePrice)}
                    </strong>
                  </div>

                  <div className='flex items-center justify-between bg-[#101B24] rounded-xl p-4'>
                    <span className='text-xs text-[#8FA3AF]'>
                      Selling Price
                    </span>

                    <strong className='text-[#36B6A0] text-sm'>
                      {money(item.sellingPrice)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Another Phone */}
        <button
          type='button'
          onClick={addPhone}
          className='w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-dashed border-[#36B6A0]/50 bg-[#36B6A0]/5 text-[#36B6A0] hover:bg-[#36B6A0]/10 hover:border-[#36B6A0] transition font-semibold text-sm'
        >
          <FiPlus size={19} />
          Add Another Phone
        </button>

        {/* Purchase Summary */}
        <div className='bg-[#202E38] border border-[#33434E] rounded-2xl overflow-hidden'>
          <div className='p-5 sm:p-6 border-b border-[#33434E]'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0]'>
                <FiDollarSign size={20} />
              </div>

              <div>
                <h3 className='text-[#E6EDF2] font-semibold'>
                  Purchase Summary
                </h3>
                <p className='text-[#8FA3AF] text-xs mt-1'>
                  Overview of this purchase.
                </p>
              </div>
            </div>
          </div>

          <div className='p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='bg-[#101B24] rounded-xl p-5'>
              <div className='flex items-center gap-2 text-[#8FA3AF] text-sm mb-3'>
                <FiPackage className='text-[#36B6A0]' />
                Total Phones
              </div>

              <p className='text-2xl font-bold text-[#E6EDF2]'>
                {items.length}
              </p>
            </div>

            <div className='bg-[#101B24] rounded-xl p-5'>
              <div className='flex items-center gap-2 text-[#8FA3AF] text-sm mb-3'>
                <FiDollarSign className='text-[#36B6A0]' />
                Total Purchase Amount
              </div>

              <p className='text-2xl font-bold text-[#36B6A0] break-all'>
                {money(total)}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className='bg-[#202E38] border border-[#33434E] rounded-2xl p-5 sm:p-6'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='w-10 h-10 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0]'>
              <FiFileText size={20} />
            </div>

            <div>
              <h3 className='text-[#E6EDF2] font-semibold'>Additional Notes</h3>
              <p className='text-[#8FA3AF] text-xs mt-1'>
                Add any additional purchase information.
              </p>
            </div>
          </div>

          <textarea
            rows='4'
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className={`${inputClass} resize-y`}
            placeholder='Write purchase notes here...'
          />
        </div>

        {/* Submit Section */}
        <div className='flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#202E38] border border-[#33434E] rounded-2xl p-5'>
          <div className='flex items-center gap-2 text-xs text-[#8FA3AF]'>
            <FiShield className='text-[#36B6A0]' size={16} />
            Please verify phone details before saving.
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full sm:w-auto flex items-center justify-center gap-2 bg-[#36B6A0] hover:bg-[#2DA58F] disabled:opacity-50 disabled:cursor-not-allowed text-[#101B24] px-8 py-3 rounded-xl font-bold transition'
          >
            <FiSave size={18} />

            {loading ? 'Saving Purchase...' : 'Save Purchase'}
          </button>
        </div>
      </form>
    </div>
  )
}
