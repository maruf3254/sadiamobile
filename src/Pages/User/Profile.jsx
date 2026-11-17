import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getUserData, updateUserData } from '../../Redux/Slices/AuthSlice'

import {
  FaUserCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaShieldAlt,
  FaSave
} from 'react-icons/fa'

import { IoIosLock, IoIosRefresh } from 'react-icons/io'

import { FiMoreVertical, FiSettings, FiCheckCircle } from 'react-icons/fi'

import { MdOutlineAccountCircle } from 'react-icons/md'

// import Layout from '../../Layout/Layout'

export default function Profile () {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userData = useSelector(state => state.auth.data)

  const [isUpdating, setIsUpdating] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [userInput, setUserInput] = useState({
    name: '',
    phone: '',
    collage: '',
    userId: null
  })

  // Fetch user data
  useEffect(() => {
    async function fetchUser () {
      await dispatch(getUserData())
    }

    if (!userData || Object.keys(userData).length < 1) {
      fetchUser()
    }
  }, [dispatch, userData])

  // Set user data
  useEffect(() => {
    setUserInput({
      name: userData?.fullName || '',
      phone: userData?.phone || '',
      collage: userData?.collage || '',
      userId: userData?._id || null
    })
  }, [userData])

  // Check changes
  useEffect(() => {
    setIsChanged(
      userInput.name !== (userData?.fullName || '') ||
        userInput.phone !== (userData?.phone || '') ||
        userInput.collage !== (userData?.collage || '')
    )
  }, [userInput, userData])

  // Handle input
  function handleUserInput (e) {
    const { name, value } = e.target

    setUserInput(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Update profile
  async function onFormSubmit (e) {
    e.preventDefault()

    if (!userInput.name.trim()) return

    try {
      setIsUpdating(true)

      const data = {
        fullName: userInput.name,
        phone: userInput.phone,
        collage: userInput.collage,
        id: userInput.userId
      }

      const response = await dispatch(updateUserData(data))

      if (response?.payload?.success) {
        await dispatch(getUserData())
        setIsChanged(false)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const inputClass =
    'w-full bg-[#101B24] border border-[#33434E] rounded-xl px-4 py-3 text-sm text-[#E6EDF2] placeholder:text-[#71838E] outline-none focus:border-[#36B6A0] focus:ring-2 focus:ring-[#36B6A0]/10 transition-all'

  const labelClass =
    'flex items-center gap-2 text-sm font-medium text-[#E6EDF2] mb-2'

  return (
    // <Layout hideFooter={true} hideBar={true}>
      <section className='min-h-screen bg-[#101B24]  py-8 sm:px-6 '>
        <div className='max-w-5xl mx-auto'>
          {/* Page Heading */}
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-11 h-11 rounded-xl bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0]'>
                <MdOutlineAccountCircle size={25} />
              </div>

              <div>
                <h1 className='text-2xl sm:text-3xl font-bold text-[#E6EDF2]'>
                  My Profile
                </h1>
                <p className='text-sm text-[#8FA3AF] mt-1'>
                  Manage your personal information and account settings.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className='bg-[#202E38] border border-[#33434E] rounded-2xl shadow-xl overflow-visible'>
            {/* Profile Header */}
            <div className='relative p-5 sm:p-8 border-b border-[#33434E]'>
              <div className='flex flex-col sm:flex-row items-center sm:items-center gap-5'>
                {/* Avatar */}
                <div className='w-24 h-24 shrink-0 rounded-2xl bg-[#36B6A0]/10 border border-[#36B6A0]/20 flex items-center justify-center'>
                  <FaUserCircle size={65} className='text-[#36B6A0]' />
                </div>

                {/* User Information */}
                <div className='flex-1 min-w-0 text-center sm:text-left'>
                  <h2 className='text-xl sm:text-2xl font-bold text-[#E6EDF2] truncate'>
                    {userData?.fullName || 'User'}
                  </h2>

                  <p className='text-sm text-[#8FA3AF] mt-1 break-all'>
                    {userData?.email || ''}
                  </p>

                  <div className='flex justify-center sm:justify-start mt-3'>
                    <span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#36B6A0]/10 text-[#36B6A0] border border-[#36B6A0]/20'>
                      <FaShieldAlt size={11} />
                      {userData?.role || 'User'}
                    </span>
                  </div>
                </div>

                {/* Settings Menu */}
                <div className='relative self-end sm:self-center'>
                  <button
                    type='button'
                    onClick={() => setIsDialogOpen(prev => !prev)}
                    aria-label='Account settings'
                    className='w-10 h-10 rounded-xl bg-[#101B24] border border-[#33434E] text-[#8FA3AF] flex items-center justify-center hover:text-[#36B6A0] hover:border-[#36B6A0]/40 transition'
                  >
                    <FiMoreVertical size={21} />
                  </button>

                  {isDialogOpen && (
                    <>
                      <button
                        type='button'
                        aria-label='Close settings menu'
                        className='fixed inset-0 z-10 cursor-default'
                        onClick={() => setIsDialogOpen(false)}
                      />

                      <div className='absolute right-0 top-12 z-20 w-56 bg-[#101B24] border border-[#33434E] rounded-xl shadow-2xl overflow-hidden'>
                        <div className='px-4 py-3 border-b border-[#33434E] flex items-center gap-2'>
                          <FiSettings className='text-[#36B6A0]' />
                          <span className='text-xs font-semibold text-[#8FA3AF] uppercase tracking-wider'>
                            Account Settings
                          </span>
                        </div>

                        <button
                          type='button'
                          onClick={() => {
                            setIsDialogOpen(false)
                            navigate('change-password')
                          }}
                          className='w-full flex items-center gap-3 px-4 py-3 text-sm text-[#E6EDF2] hover:bg-[#202E38] transition'
                        >
                          <IoIosLock size={19} className='text-[#36B6A0]' />
                          Change Password
                        </button>

                        <div className='border-t border-[#33434E]' />

                        <button
                          type='button'
                          onClick={() => {
                            setIsDialogOpen(false)
                            navigate('reset-password')
                          }}
                          className='w-full flex items-center gap-3 px-4 py-3 text-sm text-[#E6EDF2] hover:bg-[#202E38] transition'
                        >
                          <IoIosRefresh size={19} className='text-[#36B6A0]' />
                          Reset Password
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form
              onSubmit={onFormSubmit}
              autoComplete='off'
              noValidate
              className='p-5 sm:p-8'
            >
              {/* Form Heading */}
              <div className='mb-7'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-lg bg-[#36B6A0]/10 flex items-center justify-center text-[#36B6A0]'>
                    <FaUser size={14} />
                  </div>

                  <h3 className='text-lg font-bold text-[#E6EDF2]'>
                    Personal Information
                  </h3>
                </div>

                <p className='text-sm text-[#8FA3AF] mt-2'>
                  Update your personal details below.
                </p>
              </div>

              {/* Input Fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6'>
                {/* Full Name */}
                <div>
                  <label className={labelClass}>
                    <FaUser className='text-[#36B6A0]' />
                    Full Name
                  </label>

                  <input
                    type='text'
                    name='name'
                    placeholder='Enter full name'
                    value={userInput.name}
                    onChange={handleUserInput}
                    className={inputClass}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className={labelClass}>
                    <FaPhone className='text-[#36B6A0]' />
                    Phone Number
                  </label>

                  <input
                    type='tel'
                    name='phone'
                    placeholder='Enter phone number'
                    value={userInput.phone}
                    onChange={handleUserInput}
                    className={inputClass}
                  />
                </div>

                {/* College */}
                <div>
                  <label className={labelClass}>
                    <FaBuilding className='text-[#36B6A0]' />
                    College
                  </label>

                  <input
                    type='text'
                    name='collage'
                    placeholder='Enter college name'
                    value={userInput.collage}
                    onChange={handleUserInput}
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>
                    <FaEnvelope className='text-[#36B6A0]' />
                    Email Address
                  </label>

                  <input
                    type='email'
                    value={userData?.email || ''}
                    disabled
                    className={`${inputClass} bg-[#101B24]/60 text-[#8FA3AF] cursor-not-allowed`}
                  />

                  <p className='text-xs text-[#71838E] mt-2'>
                    Email address cannot be changed.
                  </p>
                </div>

                {/* Account Role */}
                <div>
                  <label className={labelClass}>
                    <FaShieldAlt className='text-[#36B6A0]' />
                    Account Role
                  </label>

                  <input
                    type='text'
                    value={userData?.role || ''}
                    disabled
                    className={`${inputClass} bg-[#101B24]/60 text-[#8FA3AF] cursor-not-allowed`}
                  />

                  <p className='text-xs text-[#71838E] mt-2'>
                    Your account permission level.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className='mt-8 pt-6 border-t border-[#33434E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='flex items-center gap-2 text-xs text-[#8FA3AF]'>
                  <FiCheckCircle className='text-[#36B6A0]' size={15} />
                  Your account information is private.
                </div>

                <button
                  type='submit'
                  disabled={!isChanged || isUpdating}
                  className='w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#36B6A0] text-[#101B24] font-bold hover:bg-[#2DA58F] transition-all disabled:opacity-40 disabled:cursor-not-allowed'
                >
                  <FaSave />

                  {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className='text-center text-xs text-[#71838E] mt-6'>
            © {new Date().getFullYear()} Sadia's Mobile. All rights reserved.
          </p>
        </div>
      </section>
    // </Layout>
  )
}

