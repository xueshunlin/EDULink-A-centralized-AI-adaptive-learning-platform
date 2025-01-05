import React from 'react';

const CategoryCard = ({ text, link, onClick, className = "" }) => {
  return (
    <div
      className={`w-auto flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer ${className}`}
      onClick={onClick} // Attach the onClick handler here
    >
      <a
        href={link}
        className="text-sm font-bold text-gray-900 dark:text-white text-center"
        onClick={(e) => e.preventDefault()} // Prevent default anchor behavior
      >
        {text}
      </a>
    </div>
  );
};

export default CategoryCard;