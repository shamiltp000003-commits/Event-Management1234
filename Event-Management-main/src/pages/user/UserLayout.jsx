

// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { IoIosArrowBack } from "react-icons/io";
// import { HiOutlineLogout } from "react-icons/hi";
// import UserSidebar from "./UserSidebar";

// const UserLayout = () => {
//   const navigate = useNavigate();

//   const logout = () => {
//     navigate("/");
//   };

//   return (
//     <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
//       {/* Header */}
//       <header className="flex items-center justify-between h-16 px-4 sm:px-8 bg-white border-b border-gray-200 shadow-sm z-10">
//         <button
//           onClick={() => window.history.back()}
//           className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
//         >
//           <IoIosArrowBack className="text-lg group-hover:-translate-x-1 transition-transform duration-200" />
//           <span>Back</span>
//         </button>

//         <button
//           onClick={logout}
//           className="group flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg hover:from-cyan-700 hover:to-cyan-800 shadow-md hover:shadow-lg transition-all duration-200"
//         >
//           <span>Logout</span>
//           <HiOutlineLogout className="text-lg group-hover:translate-x-1 transition-transform duration-200" />
//         </button>
//       </header>

//       {/* Main Content Area */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside className="flex-shrink-0 overflow-y-auto">
//           <UserSidebar />
//         </aside>

//         {/* Content */}
//         <main className="flex-1 overflow-y-auto bg-gray-50">
//           <div className="h-full">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UserLayout;


import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineLogout } from "react-icons/hi";
import UserSidebar from "./UserSidebar";

const UserLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-8 bg-white border-b border-gray-200 shadow-sm z-10">
        <button
          onClick={() => window.history.back()}
          className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          <IoIosArrowBack className="text-base sm:text-lg group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back</span>
        </button>

        <button
          onClick={logout}
          className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg hover:from-cyan-700 hover:to-cyan-800 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <span>Logout</span>
          <HiOutlineLogout className="text-base sm:text-lg group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex-shrink-0 overflow-y-auto">
          <UserSidebar />
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;