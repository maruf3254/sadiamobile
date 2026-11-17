import React, { useEffect, useState } from 'react'
import { get, post, put, del } from '../../services/api'
import { toast } from 'react-hot-toast'
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiDollarSign,
  FiCalendar,
  FiTag,
  FiFileText,
  FiHome,
  FiZap,
  FiUsers,
  FiWifi,
  FiTruck,
  FiTool,
  FiMoreHorizontal,
  FiFilter
} from 'react-icons/fi'

import PageHeader from '../../Components/common/PageHeader.jsx'
import Loading from '../../Components/common/Loading.jsx'

const initialForm = {
  title: '',
  category: 'OTHER',
  amount: '',
  expenseDate: new Date().toISOString().slice(0, 10),
  description: ''
}

const categories = [
  'RENT',
  'ELECTRICITY',
  'SALARY',
  'INTERNET',
  'TRANSPORT',
  'MAINTENANCE',
  'OTHER'
]

const categoryIcons = {
  RENT: FiHome,
  ELECTRICITY: FiZap,
  SALARY: FiUsers,
  INTERNET: FiWifi,
  TRANSPORT: FiTruck,
  MAINTENANCE: FiTool,
  OTHER: FiMoreHorizontal
}

const money = value => `৳${Number(value || 0).toLocaleString('en-BD')}`

const formatDate = date =>
  new Date(date).toLocaleDateString('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

const inputClass =
  'w-full rounded-xl border border-[#33434E] bg-[#101B24] px-4 py-3 text-sm text-[#E6EDF2] outline-none transition placeholder:text-[#8FA3AF]/70 focus:border-[#36B6A0] focus:ring-2 focus:ring-[#36B6A0]/10'

export default function ExpenseList () {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchExpenses = async () => {
    try {
      const result = await get('/expenses/all?limit=100')
      setExpenses(result.expenses || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm({
      ...initialForm,
      expenseDate: new Date().toISOString().slice(0, 10)
    })
    setModal(true)
  }

  const openEdit = expense => {
    setEditingId(expense._id)

    setForm({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      expenseDate: new Date(expense.expenseDate).toISOString().slice(0, 10),
      description: expense.description || ''
    })

    setModal(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    setSaving(true)

    try {
      const payload = {
        ...form,
        amount: Number(form.amount)
      }

      if (editingId) {
        await put(`/expenses/${editingId}/update`, payload)
        toast.success('Expense updated')
      } else {
        await post('/expenses/create', payload)
        toast.success('Expense recorded')
      }

      setModal(false)
      await fetchExpenses()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this expense?')) return

    setDeletingId(id)

    try {
      await del(`/expenses/${id}/delete`)
      toast.success('Expense deleted')
      await fetchExpenses()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const average = expenses.length ? total / expenses.length : 0

  return (
    <div className='min-h-screen space-y-6 text-[#E6EDF2]'>
      {/* Page Header */}
      <PageHeader
        title='Expenses'
        description="Manage your shop's operating expenses."
      >
        <button
          onClick={openCreate}
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#36B6A0] px-5 py-3 text-sm font-semibold text-[#101B24] shadow-lg shadow-[#36B6A0]/10 transition hover:bg-[#2DA38F]'
        >
          <FiPlus size={18} />
          Add Expense
        </button>
      </PageHeader>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {/* Total Expenses */}
        <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-[#8FA3AF]'>Total Expenses</p>

              <h3 className='mt-2 text-2xl font-bold text-[#36B6A0]'>
                {money(total)}
              </h3>
            </div>

            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
              <FiDollarSign size={23} />
            </div>
          </div>
        </div>

        {/* Expense Records */}
        <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-[#8FA3AF]'>Total Records</p>

              <h3 className='mt-2 text-2xl font-bold text-[#E6EDF2]'>
                {expenses.length}
              </h3>
            </div>

            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
              <FiFileText size={23} />
            </div>
          </div>
        </div>

        {/* Average Expense */}
        <div className='rounded-2xl border border-[#33434E] bg-[#202E38] p-5 sm:col-span-2 lg:col-span-1'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-[#8FA3AF]'>Average Expense</p>

              <h3 className='mt-2 text-2xl font-bold text-[#E6EDF2]'>
                {money(average)}
              </h3>
            </div>

            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400'>
              <FiTag size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Expense History */}
      <div className='overflow-hidden rounded-2xl border border-[#33434E] bg-[#202E38]'>
        {/* Section Header */}
        <div className='flex flex-col gap-2 border-b border-[#33434E] px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h3 className='font-semibold text-[#E6EDF2]'>Expense History</h3>

            <p className='mt-1 text-xs text-[#8FA3AF]'>
              Track and manage your shop expenses
            </p>
          </div>

          <span className='w-fit rounded-lg bg-[#36B6A0]/10 px-3 py-1.5 text-xs font-semibold text-[#36B6A0]'>
            {expenses.length} Records
          </span>
        </div>

        {loading ? (
          <Loading />
        ) : expenses.length === 0 ? (
          /* Empty State */
          <div className='flex flex-col items-center justify-center px-4 py-16 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#36B6A0]/10 text-[#36B6A0]'>
              <FiDollarSign size={30} />
            </div>

            <h3 className='text-lg font-semibold text-[#E6EDF2]'>
              No Expenses Recorded
            </h3>

            <p className='mt-2 max-w-sm text-sm text-[#8FA3AF]'>
              You haven't recorded any expenses yet. Start tracking your shop's
              operating expenses.
            </p>

            <button
              onClick={openCreate}
              className='mt-5 inline-flex items-center gap-2 rounded-xl bg-[#36B6A0] px-5 py-3 text-sm font-semibold text-[#101B24] transition hover:bg-[#2DA38F]'
            >
              <FiPlus size={17} />
              Add First Expense
            </button>
          </div>
        ) : (
          /* Expense Table */
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[750px] text-left text-sm'>
              <thead>
                <tr className='border-b border-[#33434E] bg-[#101B24]/60 text-xs uppercase tracking-wider text-[#8FA3AF]'>
                  <th className='px-5 py-4 font-semibold'>Expense</th>

                  <th className='px-5 py-4 font-semibold'>Category</th>

                  <th className='px-5 py-4 font-semibold'>Date</th>

                  <th className='px-5 py-4 font-semibold'>Amount</th>

                  <th className='px-5 py-4 text-center font-semibold'>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-[#33434E]'>
                {expenses.map(expense => {
                  const CategoryIcon =
                    categoryIcons[expense.category] || FiMoreHorizontal

                  return (
                    <tr
                      key={expense._id}
                      className='transition hover:bg-[#101B24]/40'
                    >
                      {/* Expense Title */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#36B6A0]/10 text-[#36B6A0]'>
                            <CategoryIcon size={19} />
                          </div>

                          <div>
                            <p className='font-semibold text-[#E6EDF2]'>
                              {expense.title}
                            </p>

                            <p className='mt-1 max-w-[220px] truncate text-xs text-[#8FA3AF]'>
                              {expense.description || 'No description'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className='px-5 py-4'>
                        <span className='inline-flex items-center gap-2 rounded-lg bg-[#101B24] px-3 py-2 text-xs font-medium text-[#E6EDF2]'>
                          <CategoryIcon size={14} className='text-[#36B6A0]' />
                          {expense.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-2 text-[#8FA3AF]'>
                          <FiCalendar size={15} className='text-[#36B6A0]' />
                          {formatDate(expense.expenseDate)}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className='px-5 py-4'>
                        <span className='font-bold text-[#E6EDF2]'>
                          {money(expense.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center justify-center gap-2'>
                          <button
                            onClick={() => openEdit(expense)}
                            title='Edit Expense'
                            className='flex h-9 w-9 items-center justify-center rounded-lg border border-[#33434E] text-[#36B6A0] transition hover:border-[#36B6A0] hover:bg-[#36B6A0]/10'
                          >
                            <FiEdit2 size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(expense._id)}
                            disabled={deletingId === expense._id}
                            title='Delete Expense'
                            className='flex h-9 w-9 items-center justify-center rounded-lg border border-[#33434E] text-red-400 transition hover:border-red-400 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40'
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && expenses.length > 0 && (
          <div className='border-t border-[#33434E] px-5 py-3'>
            <p className='text-xs text-[#8FA3AF]'>
              Showing {expenses.length} expense records
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div
          className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5'
          onClick={() => !saving && setModal(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={e => e.stopPropagation()}
            className='max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#33434E] bg-[#202E38] shadow-2xl'
          >
            {/* Modal Header */}
            <div className='sticky top-0 z-10 flex items-center justify-between border-b border-[#33434E] bg-[#202E38] px-5 py-4 sm:px-6'>
              <div>
                <h2 className='text-lg font-bold text-[#E6EDF2]'>
                  {editingId ? 'Edit Expense' : 'Add Expense'}
                </h2>

                <p className='mt-1 text-xs text-[#8FA3AF]'>
                  {editingId
                    ? 'Update expense information'
                    : 'Record a new shop expense'}
                </p>
              </div>

              <button
                type='button'
                disabled={saving}
                onClick={() => setModal(false)}
                className='flex h-9 w-9 items-center justify-center rounded-lg text-[#8FA3AF] transition hover:bg-[#33434E] hover:text-white disabled:opacity-40'
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className='space-y-5 p-5 sm:p-6'>
              {/* Expense Title */}
              <div>
                <label className='mb-2 block text-xs font-semibold text-[#8FA3AF]'>
                  Expense Title *
                </label>

                <input
                  required
                  type='text'
                  placeholder='Enter expense title'
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Category */}
              <div>
                <label className='mb-2 block text-xs font-semibold text-[#8FA3AF]'>
                  Expense Category *
                </label>

                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount and Date */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-xs font-semibold text-[#8FA3AF]'>
                    Amount (৳) *
                  </label>

                  <div className='relative'>
                    <FiDollarSign
                      size={17}
                      className='absolute left-4 top-1/2 -translate-y-1/2 text-[#36B6A0]'
                    />

                    <input
                      required
                      type='number'
                      min='0.01'
                      step='0.01'
                      placeholder='Enter amount'
                      value={form.amount}
                      onChange={e =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className='mb-2 block text-xs font-semibold text-[#8FA3AF]'>
                    Expense Date *
                  </label>

                  <input
                    required
                    type='date'
                    value={form.expenseDate}
                    onChange={e =>
                      setForm({ ...form, expenseDate: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className='mb-2 block text-xs font-semibold text-[#8FA3AF]'>
                  Description
                </label>

                <textarea
                  rows={4}
                  placeholder='Write expense details...'
                  value={form.description}
                  onChange={e =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className='sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#33434E] bg-[#202E38] p-5 sm:flex-row sm:justify-end sm:px-6'>
              <button
                type='button'
                disabled={saving}
                onClick={() => setModal(false)}
                className='rounded-xl border border-[#33434E] px-5 py-3 text-sm font-semibold text-[#8FA3AF] transition hover:bg-[#33434E] hover:text-white disabled:opacity-40'
              >
                Cancel
              </button>

              <button
                type='submit'
                disabled={saving}
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#36B6A0] px-6 py-3 text-sm font-bold text-[#101B24] transition hover:bg-[#2DA38F] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <FiSave size={17} />
                    {editingId ? 'Update Expense' : 'Save Expense'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
