//@ts-nocheck
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu as Icon } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Chapter, Course, Unit } from "@prisma/client";
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from 'react-pro-sidebar';
import { Separator } from "./ui/separator";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
  currentChapterId: string;
};

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#607489',
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#0098e5',
      hover: {
        backgroundColor: '#c5e4ff',
        color: '#44596e',
      },
      disabled: {
        color: '#9fb6cf',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#2e4686',
      color: '#8ba1b7',
    },
    menu: {
      menuContent: '#082440',
      icon: '#59d0ff',
      hover: {
        backgroundColor: '#00458b',
        color: '#b6c8d9',
      },
      disabled: {
        color: '#3e5e7e',
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


const CourseSideBar = async ({ course, currentChapterId }: Props) => {
      const [showSidebar, setShowSidebar] = useState(false); 
        const [collapsed, setCollapsed] = React.useState(false);
  const [toggled, setToggled] = useState(false); // Initialize toggled state

  // Function to toggle the sidebar
  const toggleSidebar = (event) => {
    event.preventDefault(); // Prevent default button behavior
    setToggled(!toggled);
  };

  const [broken, setBroken] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
  // Define the effect function
  const checkDarkMode = () => {
    // Check local storage for dark mode preference
    const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
    const savedDarkMode = isLocalStorageAvailable
      ? window.localStorage.getItem('darkMode') === 'true'
      : false;

    // Check if body has dark mode class
    const bodyHasDarkModeClass = document.body.classList.contains('dark-mode');

    // Synchronize dark mode state with local storage and body class
    if (savedDarkMode || bodyHasDarkModeClass) {
      setTheme('dark');
    }
    else {
      setTheme('light');
    }
  };

  // Run the effect continuously by including all dependencies
  checkDarkMode();

  // Set up an interval to continuously check for changes
  const intervalId = setInterval(checkDarkMode, 10); // Adjust the interval time as needed

  // Clean up by clearing the interval when the component unmounts
  return () => clearInterval(intervalId);
}, []);

  return (
    
    <div className=" p-6 rounded-r-3xl bg-secondary">
       <button
                    className=" text-l flex text-text  mb-4 z-20 m-1"
                    style={{ position: 'absolute', top: 40, left: 10, width: '30px', height:'30px' }}
                    onClick={toggleSidebar}
                >
                    <Icon />
                </button>
      <div style={{ display: 'flex', height: '100dvh', direction: rtl ? 'rtl' : 'ltr' }}>
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        rtl={rtl}
        breakPoint="md"
        backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, hasImage ? 0.9 : 1)}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div className='m-4'>
      <h1 className="text-4xl font-bold">{course.name}</h1>
      {course.units.map((unit, unitIndex) => {
        return (
          <div key={unit.id} className="mt-4">
            <h2 className="text-sm uppercase text-secondary-foreground/60">
              Unit {unitIndex + 1}
            </h2>
            <h2 className="text-2xl font-bold">{unit.name}</h2>
            {unit.chapters.map((chapter, chapterIndex) => {
              return (
                <div key={chapter.id}>
                  <Link
                    href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                    className={cn("text-secondary-foreground/60", {
                      "text-green-500 font-bold":
                        chapter.id === currentChapterId,
                    })}
                  >
                    {chapter.name}
                  </Link>
                </div>
              )
            })}
            <Separator className="mt-2 text-gray-500 bg-gray-500" />
          </div>
        )
      })}
      </div>
      </Sidebar>
      </div>
      </div>
    
     
    

    
  )
}

export default CourseSideBar;
