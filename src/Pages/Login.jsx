import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FaMobileAlt, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa'
import { login } from '../Redux/Slices/AuthSlice'
import Layout from '../Layout/Layout'

export default function Login () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  function handleUserInput (e) {
    const { name, value } = e.target

    setLoginData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function onLogin (event) {
    event.preventDefault()

    if (!loginData.email || !loginData.password) {
      toast.error('Please fill all the details')
      return
    }

    try {
      setIsLoading(true)

      const response = await dispatch(login(loginData))

      if (response?.payload?.success) {
        setLoginData({
          email: '',
          password: ''
        })

        navigate('/')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <section className='min-h-screen flex items-center justify-center px-4 py-10 bg-[#101B24]'>
        <div className='w-full max-w-md'>
          {/* Brand */}
          <div className='text-center mb-8'>
            <div
              className='inline-flex items-center justify-center
              w-16 h-16 rounded-2xl bg-[#36B6A0]
              text-[#101B24] shadow-lg shadow-[#36B6A0]/20 mb-4'
            >
              <FaMobileAlt size={30} />
            </div>

            <h1 className='text-3xl font-bold text-[#E6EDF2] tracking-tight'>
              Sadia's Mobile
            </h1>

            <p className='text-[#8FA3AF] text-sm mt-2'>
              Mobile Shop Management System
            </p>
          </div>

          {/* Login Card */}
          <div
            className='bg-[#202E38] border border-[#33434E]
            rounded-2xl shadow-2xl p-6 sm:p-8'
          >
            <div className='mb-7'>
              <h2 className='text-2xl font-bold text-[#E6EDF2]'>
                Welcome Back!
              </h2>

              <p className='text-sm text-[#8FA3AF] mt-2'>
                Sign in to access your dashboard.
              </p>
            </div>

            <form
              onSubmit={onLogin}
              autoComplete='off'
              noValidate
              className='space-y-5'
            >
              {/* Email */}
              <div>
                <label className='block text-sm font-medium text-[#E6EDF2] mb-2'>
                  Email Address
                </label>

                <div className='relative'>
                  <FaEnvelope
                    className='absolute left-4 top-1/2
                    -translate-y-1/2 text-[#36B6A0]'
                  />

                  <input
                    type='email'
                    name='email'
                    placeholder='Enter your email'
                    value={loginData.email}
                    onChange={handleUserInput}
                    className='w-full bg-[#101B24] border border-[#33434E]
                      text-[#E6EDF2] placeholder:text-[#71838E]
                      rounded-xl py-3 pl-11 pr-4 outline-none
                      focus:border-[#36B6A0] focus:ring-2
                      focus:ring-[#36B6A0]/20 transition'
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-medium text-[#E6EDF2] mb-2'>
                  Password
                </label>

                <div className='relative'>
                  <FaLock
                    className='absolute left-4 top-1/2
                    -translate-y-1/2 text-[#36B6A0]'
                  />

                  <input
                    type='password'
                    name='password'
                    placeholder='Enter your password'
                    value={loginData.password}
                    onChange={handleUserInput}
                    className='w-full bg-[#101B24] border border-[#33434E]
                      text-[#E6EDF2] placeholder:text-[#71838E]
                      rounded-xl py-3 pl-11 pr-4 outline-none
                      focus:border-[#36B6A0] focus:ring-2
                      focus:ring-[#36B6A0]/20 transition'
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <div className='flex justify-end'>
                <Link
                  to='/user/profile/reset-password'
                  className='text-sm text-[#36B6A0] hover:text-[#E6EDF2]
                    transition font-medium'
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex items-center justify-center gap-2
                  bg-[#36B6A0] hover:bg-[#2DA58F]
                  text-[#101B24] font-bold py-3 rounded-xl
                  transition-all duration-300
                  shadow-lg shadow-[#36B6A0]/10
                  disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  'Logging in...'
                ) : (
                  <>
                    Login to Dashboard
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className='mt-7 pt-5 border-t border-[#33434E]'>
              <p className='text-center text-xs text-[#71838E]'>
                Secure access to your mobile shop management system.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className='text-center text-xs text-[#71838E] mt-7'>
            © 2026 Sadia's Mobile. All rights reserved.
          </p>
        </div>
      </section>
    </Layout>
  )
}
