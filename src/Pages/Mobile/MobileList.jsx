import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSmartphone,
  FiFilter,
  FiSave,
  FiPackage
} from 'react-icons/fi'

import { get, put, del } from '../../services/api'
import PageHeader from '../../Components/common/PageHeader.jsx'
import Loading from '../../Components/common/Loading.jsx'

const money = v => `৳${Number(v || 0).toLocaleString('en-BD')}`

const inputClass =
  'w-full rounded-xl border border-[#33434E] bg-[#101B24] px-4 py-3 text-sm text-[#E6EDF2] outline-none transition placeholder:text-[#8FA3AF]/70 focus:border-[#36B6A0] focus:ring-2 focus:ring-[#36B6A0]/10'

export default function MobileList () {
  const [mobiles, setMobiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(null)

  const fetchMobiles = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (search) params.set('search', search)
      if (status) params.set('status', status)

      const result = await get(`/mobile/all?${params}`)
      setMobiles(result.mobiles || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [search, status])

  useEffect(() => {
    const timer = setTimeout(fetchMobiles, 300)
    return () => clearTimeout(timer)
  }, [fetchMobiles])

  const handleUpdate = async e => {
    e.preventDefault()

    try {
      await put(`/mobile/${editing._id}/update`, {
        brand: editing.brand,
        model: editing.model,
        color: editing.color,
        ram: editing.ram,
        storage: editing.storage,
        sellingPrice: Number(editing.sellingPrice),
        warrantyMonths: Number(editing.warrantyMonths),
        notes: editing.notes
      })

      toast.success('Phone updated successfully')
      setEditing(null)
      fetchMobiles()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this phone?')) return

    try {
      await del(`/mobile/${id}/delete`)
      toast.success('Phone deleted successfully')
      fetchMobiles()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fields = [
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'model', label: 'Model', type: 'text' },
    { name: 'color', label: 'Color', type: 'text' },
    { name: 'ram', label: 'RAM', type: 'text' },
    { name: 'storage', label: 'Storage', type: 'text' },
    { name: 'sellingPrice', label: 'Selling Price (৳)', type: 'number' },
    { name: 'warrantyMonths', label: 'Warranty (Months)', type: 'number' },
    { name: 'notes', label: 'Notes', type: 'text' }
  ]

  return (
    <div className='min-h-screen space-y-6 text-[#E6EDF2]'>
      {/* Page Header */}
      <PageHeader
        title='Mobile Inventory'
        description='Manage individual mobile phones and their IMEI records.'
      >
        <Link
          to='/purchases/create'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#36B6A0] px-5 py-3 text-sm font-semibold text-[#101B24] transition hover:bg-[#2DA38F] shadow-lg shadow-[#36B6A0]/10'
        >
          <FiPlus size={18} />
          Add New Phones
        </Link>
      </PageHeader>

      {/* Summary / Inventory Overview */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='flex items-center gap-4 rounded-2xl border border-[#33434E] bg-[#202E38] p-5'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
            <FiSmartphone size={24} />
          </div>
          <div>
            <p className='text-sm text-[#8FA3AF]'>Total Phones Found</p>
            <h3 className='mt-1 text-2xl font-bold text-[#E6EDF2]'>
              {mobiles.length}
            </h3>
          </div>
        </div>

        <div className='flex items-center gap-4 rounded-2xl border border-[#33434E] bg-[#202E38] p-5'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
            <FiPackage size={24} />
          </div>
          <div>
            <p className='text-sm text-[#8FA3AF]'>In Stock</p>
            <h3 className='mt-1 text-2xl font-bold text-[#E6EDF2]'>
              {mobiles.filter(phone => phone.status === 'IN_STOCK').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-4 sm:p-5'>
        <div className='mb-4 flex items-center gap-2'>
          <FiFilter className='text-[#36B6A0]' size={18} />
          <h3 className='font-semibold text-[#E6EDF2]'>Search & Filters</h3>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row'>
          <div className='relative flex-1'>
            <FiSearch
              size={19}
              className='absolute left-4 top-1/2 -translate-y-1/2 text-[#8FA3AF]'
            />
            <input
              type='search'
              placeholder='Search brand, model or IMEI...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`${inputClass} pl-11`}
            />
          </div>

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className={`${inputClass} sm:w-48 cursor-pointer`}
          >
            <option value=''>All Phones</option>
            <option value='IN_STOCK'>In Stock</option>
            <option value='SOLD'>Sold</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className='overflow-hidden rounded-2xl border border-[#33434E] bg-[#202E38]'>
        <div className='flex flex-col gap-2 border-b border-[#33434E] px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h3 className='font-semibold text-[#E6EDF2]'>Mobile Inventory</h3>
            <p className='mt-1 text-xs text-[#8FA3AF]'>
              Manage your mobile phone stock
            </p>
          </div>

          <span className='w-fit rounded-lg bg-[#36B6A0]/10 px-3 py-1.5 text-xs font-semibold text-[#36B6A0]'>
            {mobiles.length} Phones
          </span>
        </div>

        {loading ? (
          <Loading />
        ) : mobiles.length === 0 ? (
          <div className='flex flex-col items-center justify-center px-4 py-16 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#36B6A0]/10 text-[#36B6A0]'>
              <FiSmartphone size={30} />
            </div>

            <h3 className='text-lg font-semibold text-[#E6EDF2]'>
              No Mobile Phones Found
            </h3>

            <p className='mt-2 max-w-sm text-sm text-[#8FA3AF]'>
              No phones match your search. Try changing your search keyword or
              status filter.
            </p>

            <button
              onClick={() => {
                setSearch('')
                setStatus('')
              }}
              className='mt-5 rounded-xl bg-[#36B6A0] px-5 py-2.5 text-sm font-semibold text-[#101B24] transition hover:bg-[#2DA38F]'
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[900px] text-left text-sm'>
              <thead>
                <tr className='border-b border-[#33434E] bg-[#101B24]/60 text-xs uppercase tracking-wider text-[#8FA3AF]'>
                  <th className='px-5 py-4 font-semibold'>Phone</th>
                  <th className='px-5 py-4 font-semibold'>IMEI</th>
                  <th className='px-5 py-4 font-semibold'>Configuration</th>
                  <th className='px-5 py-4 font-semibold'>Purchase</th>
                  <th className='px-5 py-4 font-semibold'>Selling</th>
                  <th className='px-5 py-4 font-semibold'>Status</th>
                  <th className='px-5 py-4 text-center font-semibold'>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-[#33434E]'>
                {mobiles.map(phone => (
                  <tr
                    key={phone._id}
                    className='transition hover:bg-[#101B24]/40'
                  >
                    {/* Phone */}
                    <td className='px-5 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                          <FiSmartphone size={19} />
                        </div>

                        <div>
                          <p className='font-semibold text-[#E6EDF2]'>
                            {phone.brand} {phone.model}
                          </p>
                          <p className='mt-1 text-xs text-[#8FA3AF]'>
                            {phone.color}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* IMEI */}
                    <td className='px-5 py-4'>
                      <span className='font-mono text-xs text-[#8FA3AF]'>
                        {phone.imei}
                      </span>
                    </td>

                    {/* Configuration */}
                    <td className='px-5 py-4'>
                      <span className='rounded-lg bg-[#101B24] px-3 py-2 text-xs font-medium text-[#E6EDF2]'>
                        {phone.ram} / {phone.storage}
                      </span>
                    </td>

                    {/* Purchase Price */}
                    <td className='px-5 py-4 text-[#8FA3AF]'>
                      {money(phone.purchasePrice)}
                    </td>

                    {/* Selling Price */}
                    <td className='px-5 py-4'>
                      <span className='font-bold text-[#36B6A0]'>
                        {money(phone.sellingPrice)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className='px-5 py-4'>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          phone.status === 'IN_STOCK'
                            ? 'bg-[#36B6A0]/10 text-[#36B6A0]'
                            : 'bg-[#8FA3AF]/10 text-[#8FA3AF]'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            phone.status === 'IN_STOCK'
                              ? 'bg-[#36B6A0]'
                              : 'bg-[#8FA3AF]'
                          }`}
                        />
                        {phone.status === 'IN_STOCK' ? 'In Stock' : 'Sold'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className='px-5 py-4'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          disabled={phone.status !== 'IN_STOCK'}
                          onClick={() => setEditing({ ...phone })}
                          title='Edit Phone'
                          className='flex h-9 w-9 items-center justify-center rounded-lg border border-[#33434E] text-[#36B6A0] transition hover:border-[#36B6A0] hover:bg-[#36B6A0]/10 disabled:cursor-not-allowed disabled:opacity-30'
                        >
                          <FiEdit2 size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(phone._id)}
                          title='Delete Phone'
                          className='flex h-9 w-9 items-center justify-center rounded-lg border border-[#33434E] text-red-400 transition hover:border-red-400 hover:bg-red-400/10'
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && mobiles.length > 0 && (
          <div className='border-t border-[#33434E] px-5 py-3'>
            <p className='text-xs text-[#8FA3AF]'>
              Showing {mobiles.length} mobile phones
            </p>
          </div>
        )}
      </div>

      {/* Edit Phone Modal */}
      {editing && (
        <div
          className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5'
          onClick={() => setEditing(null)}
        >
          <form
            onSubmit={handleUpdate}
            onClick={e => e.stopPropagation()}
            className='max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#33434E] bg-[#202E38] shadow-2xl'
          >
            {/* Modal Header */}
            <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#33434E] bg-[#202E38] px-5 py-4 sm:px-6'>
              <div>
                <h2 className='text-lg font-bold text-[#E6EDF2]'>Edit Phone</h2>
                <p className='mt-1 text-xs text-[#8FA3AF]'>
                  Update mobile phone information
                </p>
              </div>

              <button
                type='button'
                onClick={() => setEditing(null)}
                className='flex h-9 w-9 items-center justify-center rounded-lg text-[#8FA3AF] transition hover:bg-[#33434E] hover:text-white'
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className='space-y-5 p-5 sm:p-6'>
              {/* IMEI Information */}
              <div className='rounded-xl border border-[#36B6A0]/20 bg-[#36B6A0]/5 p-4'>
                <p className='text-xs font-medium text-[#8FA3AF]'>
                  IMEI Number
                </p>
                <p className='mt-1 font-mono text-sm font-semibold text-[#36B6A0]'>
                  {editing.imei}
                </p>
              </div>

              {/* Form Fields */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {fields.map(field => (
                  <div
                    key={field.name}
                    className={field.name === 'notes' ? 'sm:col-span-2' : ''}
                  >
                    <label className='mb-2 block text-xs font-semibold text-[#8FA3AF]'>
                      {field.label}
                    </label>

                    <input
                      type={field.type}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={editing[field.name] ?? ''}
                      onChange={e =>
                        setEditing({
                          ...editing,
                          [field.name]: e.target.value
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className='sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#33434E] bg-[#202E38] p-5 sm:flex-row sm:justify-end sm:px-6'>
              <button
                type='button'
                onClick={() => setEditing(null)}
                className='rounded-xl border border-[#33434E] px-5 py-3 text-sm font-semibold text-[#8FA3AF] transition hover:bg-[#33434E] hover:text-white'
              >
                Cancel
              </button>

              <button
                type='submit'
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#36B6A0] px-6 py-3 text-sm font-bold text-[#101B24] transition hover:bg-[#2DA38F]'
              >
                <FiSave size={17} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
