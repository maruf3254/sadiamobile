import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Navbar() {
  // Initialize state based on localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark"; // Use saved theme if available
    }
    // Fallback to system preference if no theme is saved
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Toggle dark mode and update localStorage
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const element = document.documentElement; // <html> element

    // Remove both light and dark classes to prevent conflicts
    element.classList.remove("light", "dark");

    if (darkMode) {
      element.classList.add("dark"); // Apply dark class
      localStorage.setItem("theme", "dark"); // Save dark mode preference
    } else {
      element.classList.add("light"); // Apply light class
      localStorage.setItem("theme", "light"); // Save light mode preference
    }
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-50 md:h-[72px] h-[65px] md:px-[35px] px-[15px] bg-offwhite dark:bg-gray-900 shadow-custom backdrop-blur-md flex justify-end items-center">
      {/* <button
        className="p-3 rounded-full text-lg font-semibold transition-all duration-300"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <FaSun size={26} className="text-white" />
        ) : (
          <FaMoon size={26} className="text-gray-900" />
        )}
      </button> */}
    </nav>
  );
}
