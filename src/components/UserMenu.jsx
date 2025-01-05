import React, { useState } from 'react';
import HistoryPage from '../pages/HistoryPage';
import { UserContext } from '../UserContext';
import { useNavigate } from "react-router-dom";

function UserMenu({ fullname, email, profilePicture, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    logout(user);
  };

  return (
    <div className="relative flex items-center space-x-3">
      <button
        id="dropdownAvatarNameButton"
        data-dropdown-toggle="dropdownAvatarName"
        className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <span className="sr-only">Open user menu</span>
        <img className="w-8 h-8 me-2 rounded-full" src={profilePicture} alt="user photo" />
        {fullname}
        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          id="dropdownAvatarName"
          className="absolute left-0 z-40 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
          style={{ top: '110%', left: '0' }} // Adjusted position to better align with the profile photo
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div className="font-medium">{fullname}</div>
            <div className="truncate">{email}</div>
          </div>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownAvatarNameButton"
          >
            <li>
              <a
                onClick={() => handleNavigation("/history-page?type=history")}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                History
              </a>
            </li>
            <li>
              <a
                onClick={() => handleNavigation("/history-page?type=collection")}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Collections
              </a>
            </li>
          </ul>
          <div className="py-2">
            <a
              onClick={(e) => { e.preventDefault(); handleSignOut(); }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;


