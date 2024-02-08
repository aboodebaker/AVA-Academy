
import React, { useState, useEffect } from 'react';
import './dark.css';

const DarkModeSwitcher = () => {
  // Check if localStorage is available
  const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;

  // Retrieve the saved dark mode preference from local storage
  const savedDarkMode = isLocalStorageAvailable
    ? window.localStorage.getItem('darkMode') === 'true'
    : false;

  // State to track dark mode preference
  const [darkMode, setDarkMode] = useState(savedDarkMode);

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }

    // Save the dark mode preference to local storage if available
    if (isLocalStorageAvailable) {
      window.localStorage.setItem('darkMode', darkMode);
    }
  }, [darkMode, isLocalStorageAvailable]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  };

  return (
    <label className="ui-switch">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={toggleDarkMode}
      />
      <div className="slider">
        <div className="circle"></div>
      </div>
    </label>
  );
};

export default DarkModeSwitcher;




// "use client"

// import * as React from "react"
// import { Moon, Sun } from "lucide-react"
// import { useTheme } from "next-themes"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export function DarkModeSwitcher() {
//   const { setTheme } = useTheme()

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon">
//           <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           Dark
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           System
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// export default DarkModeSwitcher