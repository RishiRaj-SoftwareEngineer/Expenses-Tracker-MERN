import React, { useState, useEffect } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import SideMenu from './SideMenu';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openSideMenu && !event.target.closest('.mobile-menu-container')) {
        setOpenSideMenu(false);
      }
    };

    if (openSideMenu) {
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [openSideMenu]);

  return (
    <div className="flex items-center gap-5 bg-white border-b border-gray-200/50 py-4 px-7 sticky top-0 z-50">
      <button
        className="text-black mobile-menu-container"
        onClick={() => setOpenSideMenu(!openSideMenu)}
        aria-label="Toggle menu"
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black">Expense Tracker</h2>

      {openSideMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-30 top-[61px]"
            onClick={() => setOpenSideMenu(false)}
          />
          {/* Mobile Menu */}
          <div className="fixed top-[61px] left-0 bg-white shadow-lg z-40 mobile-menu-container h-[calc(100vh-61px)] overflow-y-auto">
            <SideMenu activeMenu={activeMenu} onMenuClick={() => setOpenSideMenu(false)} />
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;