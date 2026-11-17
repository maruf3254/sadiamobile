import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Redux/Slices/AuthSlice'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import {
  FaHome,
  FaMobileAlt,
  FaShoppingBag,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartLine,
  FaChartBar,
  FaUserCircle,
  FaSignOutAlt,
  FaEllipsisH,
  FaTimes
} from 'react-icons/fa'

const menuItems = [
  { name: 'Dashboard', path: '/', icon: FaHome },
  { name: 'Mobile Inventory', path: '/mobiles', icon: FaMobileAlt },
  { name: 'Purchases', path: '/purchases', icon: FaShoppingBag },
  { name: 'Sales', path: '/sales', icon: FaShoppingCart },
  { name: 'Expenses', path: '/expenses', icon: FaMoneyBillWave },
  { name: 'Profit & Loss', path: '/profit-loss', icon: FaChartLine },
  { name: 'Reports', path: '/reports', icon: FaChartBar }
]

const mobileMenu = [
  { name: 'Inventory', path: '/mobiles', icon: FaMobileAlt },
  { name: 'Purchases', path: '/purchases', icon: FaShoppingBag },
  { name: 'Home', path: '/', icon: FaHome },
  { name: 'Sales', path: '/sales', icon: FaShoppingCart },
  { name: 'More', path: '#more', icon: FaEllipsisH }
]

export default function Sidebar ({ hideBar = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const { isLoggedIn } = useSelector(state => state.auth)

  const onLogout = async () => {
    try {
      setIsLoading(true)
      await dispatch(logout())
      setShowMore(false)
      navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn || hideBar) return null

  const currentPage =
    menuItems.find(item => item.path === location.pathname)?.name ||
    (location.pathname === '/user/profile' ? 'My Profile' : 'Dashboard')

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className='
        hidden lg:flex fixed left-0 top-0 z-40
        w-64 h-screen bg-[#101B24] text-[#E6EDF2]
        border-r border-[#202E38] flex-col
      '
      >
        <div className='px-5 py-6 border-b border-[#202E38]'>
          <Link to='/' className='flex items-center gap-3'>
            <div
              className='
              w-11 h-11 rounded-xl bg-[#36B6A0]
              flex items-center justify-center text-[#101B24]
            '
            >
              <FaMobileAlt size={23} />
            </div>

            <div>
              <h2 className='font-bold text-lg tracking-wide'>
                Sadia's Mobile
              </h2>
              <p className='text-xs text-[#8FA3AF]'>Management System</p>
            </div>
          </Link>
        </div>

        <div className='px-4 pt-7 flex-1 overflow-y-auto'>
          <p
            className='
            text-[11px] font-bold tracking-[2px]
            text-[#82949F] px-3 mb-4
          '
          >
            MAIN MENU
          </p>

          <nav className='space-y-1.5'>
            {menuItems.map(item => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-[#36B6A0] text-[#101B24] shadow-md'
                        : 'text-[#B5C2CA] hover:bg-[#202E38] hover:text-[#E6EDF2]'
                    }
                  `}
                >
                  <Icon size={17} />
                  <span className='font-medium text-sm'>{item.name}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className='p-4 border-t border-[#202E38]'>
          <Link
            to='/user/profile'
            className='
              flex items-center gap-3 px-4 py-3 rounded-xl
              text-[#B5C2CA] hover:bg-[#202E38]
              hover:text-[#36B6A0] transition
            '
          >
            <FaUserCircle size={18} />
            <span className='text-sm font-medium'>My Profile</span>
          </Link>

          <button
            onClick={onLogout}
            disabled={isLoading}
            className='
              w-full flex items-center gap-3 px-4 py-3 mt-2
              rounded-xl bg-[#202E38] text-[#36B6A0]
              hover:bg-[#36B6A0] hover:text-[#101B24]
              transition font-medium text-sm disabled:opacity-50
            '
          >
            <FaSignOutAlt size={17} />
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>

          <p className='text-center text-[10px] text-[#71838E] mt-4'>
            Mobile Shop Management © {new Date().getFullYear()}
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className='
        lg:hidden fixed top-0 left-0 right-0 z-40
        bg-[#101B24]/95 backdrop-blur-xl
        border-b border-[#33434E]
        px-4 py-3
      '
      >
        <div className='flex items-center justify-between gap-3'>
          <Link to='/' className='flex items-center gap-3 min-w-0'>
            <div
              className='
              w-10 h-10 shrink-0 rounded-xl
              bg-[#36B6A0] text-[#101B24]
              flex items-center justify-center
            '
            >
              <FaMobileAlt size={21} />
            </div>

            <div className='min-w-0'>
              <h2 className='text-[#E6EDF2] font-bold text-base leading-tight'>
                Sadia's Mobile
              </h2>
              <p className='text-[#8FA3AF] text-[11px] mt-1'>{currentPage}</p>
            </div>
          </Link>

          <button
            onClick={onLogout}
            disabled={isLoading}
            className='
              flex items-center gap-2 px-3 py-2
              rounded-xl bg-[#202E38] text-[#36B6A0]
              text-xs font-semibold
              hover:bg-[#36B6A0] hover:text-[#101B24]
              transition disabled:opacity-50
            '
          >
            <FaSignOutAlt size={14} />
            {isLoading ? 'Please wait' : 'Logout'}
          </button>
        </div>
      </header>

      {/* Mobile More Menu Overlay */}
      {showMore && (
        <>
          <div
            onClick={() => setShowMore(false)}
            className='lg:hidden fixed inset-0 z-40 bg-black/50'
          />

          <div
            className='
            lg:hidden fixed bottom-[82px] right-4 z-50
            w-56 p-3 rounded-2xl
            bg-[#202E38] border border-[#33434E]
            shadow-2xl
          '
          >
            <div className='flex items-center justify-between px-2 mb-2'>
              <p className='text-xs font-bold text-[#8FA3AF] tracking-wider'>
                MORE OPTIONS
              </p>
              <button
                onClick={() => setShowMore(false)}
                className='text-[#8FA3AF] hover:text-white'
              >
                <FaTimes />
              </button>
            </div>

            {[
              ...menuItems.filter(item =>
                ['/expenses', '/profit-loss'].includes(item.path)
              ),
              {
                name: 'Reports',
                path: '/reports',
                icon: FaChartBar
              },
              {
                name: 'My Profile',
                path: '/user/profile',
                icon: FaUserCircle
              }
            ].map(item => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMore(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-3 rounded-xl
                    text-sm transition
                    ${
                      isActive
                        ? 'bg-[#36B6A0] text-[#101B24]'
                        : 'text-[#B5C2CA] hover:bg-[#101B24]'
                    }
                  `}
                >
                  <Icon size={16} />
                  {item.name}
                </NavLink>
              )
            })}
          </div>
        </>
      )}

      {/* Mobile Bottom Navigation */}
      <nav
        className='
        lg:hidden fixed bottom-0 left-0 right-0 z-50
        bg-[#101B24]/95 backdrop-blur-xl
        border-t border-[#33434E]
        px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]
      '
      >
        <div className='flex items-center justify-around'>
          {mobileMenu.map(item => {
            const Icon = item.icon

            if (item.name === 'More') {
              return (
                <button
                  key={item.name}
                  onClick={() => setShowMore(!showMore)}
                  className={`
                    flex flex-col items-center justify-center
                    gap-1 w-14 py-1 rounded-xl
                    ${showMore ? 'text-[#36B6A0]' : 'text-[#8FA3AF]'}
                  `}
                >
                  <Icon size={19} />
                  <span className='text-[10px] font-medium'>More</span>
                </button>
              )
            }

            const isHome = item.path === '/'

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={isHome}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center
                  gap-1 w-14 py-1 rounded-xl transition-all
                  ${isActive && !isHome ? 'text-[#36B6A0]' : 'text-[#8FA3AF]'}
                  ${
                    isHome
                      ? `-mt-7 w-[58px] h-[58px] rounded-2xl border-4 border-[#101B24] shadow-lg ${
                          isActive
                            ? 'bg-[#36B6A0] text-[#101B24]'
                            : 'bg-[#202E38] text-[#36B6A0]'
                        }`
                      : ''
                  }
                `}
              >
                <Icon size={isHome ? 23 : 19} />
                <span className='text-[10px] font-semibold'>{item.name}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}
