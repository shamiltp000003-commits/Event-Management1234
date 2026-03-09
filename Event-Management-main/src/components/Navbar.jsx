import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import {
  IoSearchOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoGridOutline,
  IoChevronDownOutline
} from "react-icons/io5";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const { user, setShowUserLogin, navigate, isAdmin, logout } = useAppContext();

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    // { name: "All Events", path: "/allevents" },
  ];

  const getDashboardPath = () => {
    if (!user) return "/";
    if (isAdmin) return "/admin";
    if (user.role === "provider") return "/provider";
    return "/user-dashboard";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-4 sm:px-8 md:px-12 lg:px-20 py-3 ${scrolled
        ? "bg-white/80 backdrop-blur-lg shadow-sm py-2"
        : "bg-transparent py-4 sm:py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>

            {/* Logo container */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <span className="text-white font-bold text-xl sm:text-2xl drop-shadow-md">W</span>
            </div>
          </div>

          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-playfair tracking-tight bg-gradient-to-r from-indigo-700 to-cyan-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-cyan-500 transition-all duration-300">
            WedCraft
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
        relative text-sm font-medium transition-colors hover:text-indigo-600
        ${isActive ? "text-indigo-600" : (scrolled ? "text-gray-700" : "text-white")}
      `}
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {user && (
            <NavLink
              to={getDashboardPath()}
              className={({ isActive }) => `
        text-sm font-medium transition-colors hover:text-indigo-600
        ${isActive ? "text-indigo-600" : (scrolled ? "text-gray-700" : "text-white")}
      `}
            >
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Right Section: Search, Auth, Mobile Toggle */}
        <div className="flex items-center gap-4">
          {/* Search Bar (Desktop) */}
          <div className={`hidden lg:flex items-center transition-all duration-300 border rounded-full px-3 py-1.5 ${searchExpanded ? "w-64 border-indigo-300 bg-white" : "w-10 border-transparent"
            }`}>
            <IoSearchOutline
              className={`text-xl cursor-default ${scrolled ? "text-gray-600" : "text-white"} ${searchExpanded ? "text-indigo-500" : ""}`}
              onClick={() => setSearchExpanded(!searchExpanded)}
            />
            {searchExpanded && (
              <input
                autoFocus
                type="text"
                placeholder="Search events..."
                className="ml-2 bg-transparent outline-none text-sm w-full text-gray-800"
                onBlur={() => !searchExpanded && setSearchExpanded(false)}
              />
            )}
          </div>

          {/* User Auth / Profile */}
          {!user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserLogin(true)}
              className="hidden md:block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold shadow-md shadow-indigo-200"
            >
              Log In
            </motion.button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-3 bg-gray-100/50 backdrop-blur-sm rounded-full border border-gray-200 hover:bg-white transition-colors"
              >
                <span className="text-xs font-semibold text-gray-700 hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-indigo-600 text-xs flex items-center justify-center text-white shadow-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <IoChevronDownOutline className={`text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[110]"
                  >
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => { navigate(getDashboardPath()); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                      >
                        <IoGridOutline className="text-lg" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => { navigate("/myprofile"); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                      >
                        <IoPersonOutline className="text-lg" />
                        My Profile
                      </button>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <IoLogOutOutline className="text-lg" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-2xl transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <IoMenuOutline className={scrolled ? "text-gray-800" : "text-white"} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-[80%] max-w-sm bg-white z-[210] shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 shrink-0">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-cyan-600 bg-clip-text text-transparent font-playfair">
                  WedCraft
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <IoCloseOutline className="text-2xl text-gray-700" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      px-4 py-3 rounded-xl text-lg font-medium transition-colors
                      ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"}
                    `}
                  >
                    {link.name}
                  </NavLink>
                ))}
                {user && (
                  <NavLink
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      px-4 py-3 rounded-xl text-lg font-medium transition-colors
                      ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"}
                    `}
                  >
                    Dashboard
                  </NavLink>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 shrink-0">
                {!user ? (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setShowUserLogin(true); }}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 text-base"
                  >
                    Log In / Sign Up
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors text-sm"
                    >
                      <IoLogOutOutline className="text-lg" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
