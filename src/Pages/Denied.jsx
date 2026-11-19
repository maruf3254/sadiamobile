import { useNavigate } from 'react-router-dom'
import Layout from '../Layout/Layout'
import DeniedPng from '../assets/images/denied.png'

function Denied () {
  const navigate = useNavigate()

  return (
    <Layout hideBar={true} hideNav={true}>
      <section className='flex min-h-screen w-full flex-col-reverse items-center justify-center gap-8 bg-white px-4 pb-16 dark:bg-[#131212] md:flex-row md:justify-around'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-8xl font-extrabold tracking-widest text-gray-700 dark:text-white sm:text-9xl'>
            403
          </h1>

          <div className='absolute rotate-12 rounded bg-red-500 px-3 py-1 text-sm text-white dark:bg-black'>
            Access Denied
          </div>

          <p className='mt-5 text-center text-sm text-gray-500 dark:text-gray-400'>
            Sorry, you don't have permission to access this page.
          </p>

          <button
            onClick={() => navigate(-1)}
            className='mt-6 border border-[#FF6A3D] bg-[#1A2238] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#FF6A3D] focus:outline-none focus:ring-2 focus:ring-[#FF6A3D] focus:ring-offset-2'
          >
            Go Back
          </button>
        </div>

        <img
          src={DeniedPng}
          alt='Access Denied'
          className='w-full max-w-[350px] object-contain sm:max-w-[420px]'
        />
      </section>
    </Layout>
  )
}

export default Denied
