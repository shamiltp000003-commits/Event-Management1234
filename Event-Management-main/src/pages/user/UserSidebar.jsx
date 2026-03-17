

// import React from 'react'
// import { RxDashboard } from 'react-icons/rx'
// import { HiQuestionMarkCircle } from 'react-icons/hi'
// import { NavLink } from 'react-router-dom'

// const UserSidebar = () => {
//   return (
//     <div className='flex flex-col border-r border-gray-100 min-h-full bg-white shadow-sm'>
//       {/* Header */}
//       <div className='px-6 py-8 border-b border-gray-100'>
//         <h2 className='text-lg font-semibold text-gray-800'>Dashboard</h2>
//         <p className='text-sm text-gray-500 mt-1'>Manage your account</p>
//       </div>

//       {/* Navigation */}
//       <nav className='flex-1 px-3 py-6 space-y-2'>
//         <NavLink 
//           end={true} 
//           to='/user-dashboard' 
//           className={({isActive})=> `
//             group flex items-center gap-3 py-3 px-4 rounded-lg
//             transition-all duration-200 ease-in-out
//             hover:bg-gray-50
//             ${isActive 
//               ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm border-l-4 border-cyan-600' 
//               : 'text-gray-600 hover:text-gray-900'
//             }
//           `}
//         >
//           <RxDashboard className={`text-xl transition-transform group-hover:scale-110`} />
//           <span className='hidden md:inline-block font-medium'>My Bookings</span>
//         </NavLink>

//         <NavLink 
//           to='/user-dashboard/faq' 
//           className={({isActive})=> `
//             group flex items-center gap-3 py-3 px-4 rounded-lg
//             transition-all duration-200 ease-in-out
//             hover:bg-gray-50
//             ${isActive 
//               ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm border-l-4 border-cyan-600' 
//               : 'text-gray-600 hover:text-gray-900'
//             }
//           `}
//         >
//           <HiQuestionMarkCircle className={`text-xl transition-transform group-hover:scale-110`} />
//           <span className='hidden md:inline-block font-medium'>FAQ</span>
//         </NavLink>
//       </nav>

//       {/* Footer - Optional Help Section */}
//       <div className='px-6 py-6 border-t border-gray-100 bg-gray-50'>
//         <div className='hidden md:block'>
//           <p className='text-xs font-semibold text-gray-700 mb-2'>Need Help?</p>
//           <p className='text-xs text-gray-500 leading-relaxed'>
//             Contact our support team for assistance
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UserSidebar



import React from 'react'
import { RxDashboard } from 'react-icons/rx'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'
import { HiOutlineBanknotes } from "react-icons/hi2";


const UserSidebar = () => {
  return (
    <div className='flex flex-col border-r border-gray-100 min-h-full bg-white shadow-sm w-16 md:w-64 transition-all duration-300'>
      {/* Header */}
      <div className='px-3 md:px-6 py-8 border-b border-gray-100 flex items-center justify-center md:justify-start'>
        <div className='hidden md:block'>
          <h2 className='text-lg font-semibold text-gray-800'>Dashboard</h2>
          <p className='text-sm text-gray-500 mt-1'>Manage your account</p>
        </div>
        {/* Mobile: show a small logo/icon placeholder */}
        <div className='md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500'>
          <RxDashboard className='text-white text-sm' />
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-2 md:px-3 py-6 space-y-2'>
        <NavLink
          end={true}
          to='/user-dashboard'
          className={({ isActive }) => `
            group flex items-center justify-center md:justify-start gap-3 py-3 px-2 md:px-4 rounded-lg
            transition-all duration-200 ease-in-out
            hover:bg-gray-50
            ${isActive
              ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm border-l-4 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <RxDashboard className='text-xl transition-transform group-hover:scale-110 flex-shrink-0' />
          <span className='hidden md:inline-block font-medium'>My Bookings</span>
        </NavLink>

        <NavLink
          to='/user-dashboard/faq'
          className={({ isActive }) => `
            group flex items-center justify-center md:justify-start gap-3 py-3 px-2 md:px-4 rounded-lg
            transition-all duration-200 ease-in-out
            hover:bg-gray-50
            ${isActive
              ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm border-l-4 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <HiQuestionMarkCircle className='text-xl transition-transform group-hover:scale-110 flex-shrink-0' />
          <span className='hidden md:inline-block font-medium'>FAQ</span>
        </NavLink>
        <NavLink
          to='/user-dashboard/transactions'
          className={({ isActive }) => `
            group flex items-center justify-center md:justify-start gap-3 py-3 px-2 md:px-4 rounded-lg
            transition-all duration-200 ease-in-out
            hover:bg-gray-50
            ${isActive
              ? 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 shadow-sm border-l-4 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <HiOutlineBanknotes className='text-xl transition-transform group-hover:scale-110 flex-shrink-0' />
          <span className='hidden md:inline-block font-medium'>Transactions</span>
        </NavLink>
      </nav>

      {/* Footer - Optional Help Section */}
      <div className='px-3 md:px-6 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-center md:justify-start'>
        <div className='hidden md:block'>
          <p className='text-xs font-semibold text-gray-700 mb-2'>Need Help?</p>
          <p className='text-xs text-gray-500 leading-relaxed'>
            Contact our support team for assistance
          </p>
        </div>
        {/* Mobile: compact help icon */}
        <div className='md:hidden text-gray-400'>
          <HiQuestionMarkCircle className='text-xl' />
        </div>
      </div>
    </div>
  )
}

export default UserSidebar