'use client'
// import DarkModeSwitcher from '../DarkmodeToggle/Darkmodetoggle'
// import './sidebar.css'
// import Link from 'next/link'
// import { useState } from 'react'
// import {BsArrowRight, BsArrowLeft} from 'react-icons/bs'
// const Sidebar = () => {
//     const [isOpen, setIsOpen] = useState(true)

//     const handleClick = () => {
//         setIsOpen(!isOpen)
//     }
//   return (
    
//     // <div >
//     //     {isOpen ?
//     //     <div >
//     //     <div className="sidecontainer">
//     //     <Link href={'/classes'}>
//     //         <div>
//     //             <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
//     //             <path d="M9.79165 25.8108V33.6442L23.5 41.125L37.2083 33.6442V25.8108L23.5 33.2917L9.79165 25.8108ZM23.5 5.875L1.95831 17.625L23.5 29.375L41.125 19.7596V33.2917H45.0416V17.625L23.5 5.875Z" fill="white"/>
//     //             </svg>
//     //         </div>
//     //     </Link>
//     //     <Link href={'/homework'}>
//     //         <div>
//     //             <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
//     //             <path d="M7.83331 41.125V17.625L23.5 5.875L39.1666 17.625V41.125H27.4166V27.4167H19.5833V41.125H7.83331Z" fill="white"/>
//     //             </svg>
//     //         </div>
//     //     </Link>
//     //     <Link href={'/notes'}>
//     //         <div>
//     //             <svg xmlns="http://www.w3.org/2000/svg" width="37" height="45" viewBox="0 0 37 45" fill="none">
//     //             <path d="M24.6667 16.875H33.1459L24.6667 6.5625V16.875ZM10.7917 3.75H26.2084L35.4584 15V33.75C35.4584 34.7446 35.1335 35.6984 34.5553 36.4016C33.977 37.1049 33.1928 37.5 32.375 37.5H10.7917C9.97394 37.5 9.18968 37.1049 8.61144 36.4016C8.0332 35.6984 7.70835 34.7446 7.70835 33.75V7.5C7.70835 6.50544 8.0332 5.55161 8.61144 4.84835C9.18968 4.14509 9.97394 3.75 10.7917 3.75ZM4.62502 11.25V41.25H32.375V45H4.62502C3.80727 45 3.02301 44.6049 2.44477 43.9016C1.86654 43.1984 1.54169 42.2446 1.54169 41.25V11.25H4.62502Z" fill="white"/>
//     //             </svg>
//     //         </div>
//     //     </Link>
//     //     <Link href={'/chat'}>
//     //         <div>
//     //             <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none">
//     //             <path d="M26.25 28.125V31.875C26.25 32.3723 26.0525 32.8492 25.7008 33.2008C25.3492 33.5525 24.8723 33.75 24.375 33.75H11.25L5.625 39.375V20.625C5.625 20.1277 5.82254 19.6508 6.17417 19.2992C6.52581 18.9475 7.00272 18.75 7.5 18.75H11.25M39.375 26.25L33.75 20.625H20.625C20.1277 20.625 19.6508 20.4275 19.2992 20.0758C18.9475 19.7242 18.75 19.2473 18.75 18.75V7.5C18.75 7.00272 18.9475 6.52581 19.2992 6.17417C19.6508 5.82254 20.1277 5.625 20.625 5.625H37.5C37.9973 5.625 38.4742 5.82254 38.8258 6.17417C39.1775 6.52581 39.375 7.00272 39.375 7.5V26.25Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//     //             </svg>
//     //         </div>
//     //     </Link>

//     //     <Link href={'/history'}>
//     //         <div className='text-white'>
//     //             <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"  width="38" height="38" viewBox="0 0 512 513.11" fill="#FFFFFF">
//     //                 <path fill-rule="nonzero" d="M210.48 160.8c0-14.61 11.84-26.46 26.45-26.46s26.45 11.85 26.45 26.46v110.88l73.34 32.24c13.36 5.88 19.42 21.47 13.54 34.82-5.88 13.35-21.47 19.41-34.82 13.54l-87.8-38.6c-10.03-3.76-17.16-13.43-17.16-24.77V160.8zM5.4 168.54c-.76-2.25-1.23-4.64-1.36-7.13l-4-73.49c-.75-14.55 10.45-26.95 25-27.69 14.55-.75 26.95 10.45 27.69 25l.74 13.6a254.258 254.258 0 0136.81-38.32c17.97-15.16 38.38-28.09 61.01-38.18 64.67-28.85 134.85-28.78 196.02-5.35 60.55 23.2 112.36 69.27 141.4 132.83.77 1.38 1.42 2.84 1.94 4.36 27.86 64.06 27.53 133.33 4.37 193.81-23.2 60.55-69.27 112.36-132.83 141.39a26.24 26.24 0 01-12.89 3.35c-14.61 0-26.45-11.84-26.45-26.45 0-11.5 7.34-21.28 17.59-24.92 7.69-3.53 15.06-7.47 22.09-11.8.8-.66 1.65-1.28 2.55-1.86 11.33-7.32 22.1-15.7 31.84-25.04.64-.61 1.31-1.19 2-1.72 20.66-20.5 36.48-45.06 46.71-71.76 18.66-48.7 18.77-104.46-4.1-155.72l-.01-.03C418.65 122.16 377.13 85 328.5 66.37c-48.7-18.65-104.46-18.76-155.72 4.1a203.616 203.616 0 00-48.4 30.33c-9.86 8.32-18.8 17.46-26.75 27.29l3.45-.43c14.49-1.77 27.68 8.55 29.45 23.04 1.77 14.49-8.55 27.68-23.04 29.45l-73.06 9c-13.66 1.66-26.16-7.41-29.03-20.61zM283.49 511.5c20.88-2.34 30.84-26.93 17.46-43.16-5.71-6.93-14.39-10.34-23.29-9.42-15.56 1.75-31.13 1.72-46.68-.13-9.34-1.11-18.45 2.72-24.19 10.17-12.36 16.43-2.55 39.77 17.82 42.35 19.58 2.34 39.28 2.39 58.88.19zm-168.74-40.67c7.92 5.26 17.77 5.86 26.32 1.74 18.29-9.06 19.97-34.41 3.01-45.76-12.81-8.45-25.14-18.96-35.61-30.16-9.58-10.2-25.28-11.25-36.11-2.39a26.436 26.436 0 00-2.55 38.5c13.34 14.2 28.66 27.34 44.94 38.07zM10.93 331.97c2.92 9.44 10.72 16.32 20.41 18.18 19.54 3.63 36.01-14.84 30.13-33.82-4.66-15-7.49-30.26-8.64-45.93-1.36-18.33-20.21-29.62-37.06-22.33C5.5 252.72-.69 262.86.06 274.14c1.42 19.66 5.02 39 10.87 57.83z"/>
//     //             </svg>
//     //         </div>
//     //     </Link>
        
//     //     </div> 
//     //     <div className='centers'>
//     //     <button onClick={handleClick} className='button-bg'>
//     //         <BsArrowLeft/>
//     //         </button>
//     //         </div>
//     //     </div>
//     //         : <>
    
//     //     <div>
//     //         <div className="sidecontainer-closed">
//     //     <Link href={'/'}>
//     //         <div>
//     //             <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
//     //             <path d="M7.83331 41.125V17.625L23.5 5.875L39.1666 17.625V41.125H27.4166V27.4167H19.5833V41.125H7.83331Z" fill="white"/>
//     //             </svg>
//     //         </div>
//     //     </Link>
//     //     <Link href={'/classes'}>
//     //         <div>
//     //             <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
//     //             <path d="M9.79165 25.8108V33.6442L23.5 41.125L37.2083 33.6442V25.8108L23.5 33.2917L9.79165 25.8108ZM23.5 5.875L1.95831 17.625L23.5 29.375L41.125 19.7596V33.2917H45.0416V17.625L23.5 5.875Z" fill="white"/>
//     //             </svg>
//     //         </div>
//     //     </Link>
//     //     <Link href={'/notes'}>
//     //         <div>
//     //             <svg xmlns="http://www.w3.org/2000/svg" width="37" height="45" viewBox="0 0 37 45" fill="none">
//     //             <path d="M24.6667 16.875H33.1459L24.6667 6.5625V16.875ZM10.7917 3.75H26.2084L35.4584 15V33.75C35.4584 34.7446 35.1335 35.6984 34.5553 36.4016C33.977 37.1049 33.1928 37.5 32.375 37.5H10.7917C9.97394 37.5 9.18968 37.1049 8.61144 36.4016C8.0332 35.6984 7.70835 34.7446 7.70835 33.75V7.5C7.70835 6.50544 8.0332 5.55161 8.61144 4.84835C9.18968 4.14509 9.97394 3.75 10.7917 3.75ZM4.62502 11.25V41.25H32.375V45H4.62502C3.80727 45 3.02301 44.6049 2.44477 43.9016C1.86654 43.1984 1.54169 42.2446 1.54169 41.25V11.25H4.62502Z" fill="white"/>
//     //             </svg>
//     //         </div>
//     //     </Link>
//     //     <Link href={'/chat'}>
//     //         <div>
//     //             <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none">
//     //             <path d="M26.25 28.125V31.875C26.25 32.3723 26.0525 32.8492 25.7008 33.2008C25.3492 33.5525 24.8723 33.75 24.375 33.75H11.25L5.625 39.375V20.625C5.625 20.1277 5.82254 19.6508 6.17417 19.2992C6.52581 18.9475 7.00272 18.75 7.5 18.75H11.25M39.375 26.25L33.75 20.625H20.625C20.1277 20.625 19.6508 20.4275 19.2992 20.0758C18.9475 19.7242 18.75 19.2473 18.75 18.75V7.5C18.75 7.00272 18.9475 6.52581 19.2992 6.17417C19.6508 5.82254 20.1277 5.625 20.625 5.625H37.5C37.9973 5.625 38.4742 5.82254 38.8258 6.17417C39.1775 6.52581 39.375 7.00272 39.375 7.5V26.25Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
//     //             </svg>
//     //         </div>
//     //     </Link>

//     //     <Link href={'/history'}>
//     //         <div>
//     //             <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"  width="38" height="38" viewBox="0 0 512 513.11" fill="#FFFFFF">
//     //                 <path fill-rule="nonzero" d="M210.48 160.8c0-14.61 11.84-26.46 26.45-26.46s26.45 11.85 26.45 26.46v110.88l73.34 32.24c13.36 5.88 19.42 21.47 13.54 34.82-5.88 13.35-21.47 19.41-34.82 13.54l-87.8-38.6c-10.03-3.76-17.16-13.43-17.16-24.77V160.8zM5.4 168.54c-.76-2.25-1.23-4.64-1.36-7.13l-4-73.49c-.75-14.55 10.45-26.95 25-27.69 14.55-.75 26.95 10.45 27.69 25l.74 13.6a254.258 254.258 0 0136.81-38.32c17.97-15.16 38.38-28.09 61.01-38.18 64.67-28.85 134.85-28.78 196.02-5.35 60.55 23.2 112.36 69.27 141.4 132.83.77 1.38 1.42 2.84 1.94 4.36 27.86 64.06 27.53 133.33 4.37 193.81-23.2 60.55-69.27 112.36-132.83 141.39a26.24 26.24 0 01-12.89 3.35c-14.61 0-26.45-11.84-26.45-26.45 0-11.5 7.34-21.28 17.59-24.92 7.69-3.53 15.06-7.47 22.09-11.8.8-.66 1.65-1.28 2.55-1.86 11.33-7.32 22.1-15.7 31.84-25.04.64-.61 1.31-1.19 2-1.72 20.66-20.5 36.48-45.06 46.71-71.76 18.66-48.7 18.77-104.46-4.1-155.72l-.01-.03C418.65 122.16 377.13 85 328.5 66.37c-48.7-18.65-104.46-18.76-155.72 4.1a203.616 203.616 0 00-48.4 30.33c-9.86 8.32-18.8 17.46-26.75 27.29l3.45-.43c14.49-1.77 27.68 8.55 29.45 23.04 1.77 14.49-8.55 27.68-23.04 29.45l-73.06 9c-13.66 1.66-26.16-7.41-29.03-20.61zM283.49 511.5c20.88-2.34 30.84-26.93 17.46-43.16-5.71-6.93-14.39-10.34-23.29-9.42-15.56 1.75-31.13 1.72-46.68-.13-9.34-1.11-18.45 2.72-24.19 10.17-12.36 16.43-2.55 39.77 17.82 42.35 19.58 2.34 39.28 2.39 58.88.19zm-168.74-40.67c7.92 5.26 17.77 5.86 26.32 1.74 18.29-9.06 19.97-34.41 3.01-45.76-12.81-8.45-25.14-18.96-35.61-30.16-9.58-10.2-25.28-11.25-36.11-2.39a26.436 26.436 0 00-2.55 38.5c13.34 14.2 28.66 27.34 44.94 38.07zM10.93 331.97c2.92 9.44 10.72 16.32 20.41 18.18 19.54 3.63 36.01-14.84 30.13-33.82-4.66-15-7.49-30.26-8.64-45.93-1.36-18.33-20.21-29.62-37.06-22.33C5.5 252.72-.69 262.86.06 274.14c1.42 19.66 5.02 39 10.87 57.83z"/>
//     //             </svg>
//     //         </div>
//     //     </Link>
        
//     //     </div>
//     //         <button onClick={handleClick} className='center-button'>
//     //         <BsArrowRight />
//     //         </button>
//     //     </div>

    
//     //     </>}
//     //     {/* <DarkModeSwitcher /> */}
//     // </div> 

//     <div>

//     </div>
//   )
// }

// export default Sidebar

import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from 'react-pro-sidebar';
import { Switch } from './components/Switch';
import { SidebarHeader } from './components/SidebarHeader';
import { Diamond } from './icons/Diamond';
import { BarChart } from './icons/BarChart';
import { Global } from './icons/Global';
import { InkBottle } from './icons/InkBottle';
import { Book } from './icons/Book';
import { Calendar } from './icons/Calendar';
import { ShoppingCart } from './icons/ShoppingCart';
import { Service } from './icons/Service';
import {Quiz} from './icons/Quiz'
import { SidebarFooter } from './components/SidebarFooter';
import { Badge } from './components/Badge';
import { Typography } from './components/Typography';
import { PackageBadges } from './components/PackageBadges';
import Sticky from 'react-stickynode';
import Link from 'next/link'
import { FiMenu as Icon } from 'react-icons/fi';
type Theme = 'light' | 'dark';

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

const Sidebars = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>('light');

  React.useEffect(() => {
    const checkDarkMode = () => {
    const collapsd = collapsed ? 'true' : 'false'
    localStorage.setItem('s-c', collapsd )

    }

  const intervalId = setInterval(checkDarkMode, 10); // Adjust the interval time as needed

  // Clean up by clearing the interval when the component unmounts
  return () => clearInterval(intervalId);
  },[])

//    React.useEffect(() => {
//   // Define the effect function
//   const checkDarkMode = () => {
//     // Check local storage for dark mode preference
//     const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
//     const savedDarkMode = isLocalStorageAvailable
//       ? window.localStorage.getItem('s-c') === 'true'
//       : false;

//     // Synchronize dark mode state with local storage and body class
//     if (savedDarkMode ) {
//       setCollapsed(false);
//     }
//     else {
//       setCollapsed(true);
//     }
//   };

//   // Run the effect continuously by including all dependencies
//   checkDarkMode();

// }, [collapsed]); 

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

  // handle on RTL change event
  const handleRTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRtl(e.target.checked);
  };

  // handle on theme change event
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  // handle on image change event
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasImage(e.target.checked);
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '13px',
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9',
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes[theme].menu.menuContent, hasImage && !collapsed ? 0.4 : 1)
          : 'transparent',
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, hasImage ? 0.8 : 1),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <div className=''>
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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <SidebarHeader rtl={rtl} style={{ marginBottom: '24px', marginTop: '16px' }} />
          <div style={{ flex: 1, marginBottom: '32px' }}>
            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                General
              </Typography>
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <Link href={'/classes'}>
                <MenuItem icon={<Book />}> Classes</MenuItem>
              </Link>
              <Link href={'/notes'}>
                <MenuItem icon={<InkBottle />}>Notes</MenuItem>
              </Link>
              <Link href={'/course'}>
                <MenuItem icon={<ShoppingCart />}>Courses</MenuItem>
              </Link>
                
            </Menu>

            <div style={{ padding: '0 24px', marginBottom: '8px', marginTop: '32px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                AI
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              
              <Link href={'/chat'}>
              <MenuItem icon={<Calendar />} >
                Chat
              </MenuItem>
              </Link>
              <Link href={'/quiz'}>
              <MenuItem icon={<BarChart />} >
                Quiz
              </MenuItem>
              </Link>
            </Menu>

            <div style={{ padding: '0 24px', marginBottom: '8px', marginTop: '32px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                Extra
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              
              <Link href={'/homework'}>
              <MenuItem icon={<Service />}>
                Homework
              </MenuItem>
              </Link>
              <Link href={'/history'}>
              <MenuItem icon={<Global />} >
                History
              </MenuItem>
              </Link>
            </Menu>
          </div>
          {/* <SidebarFooter collapsed={collapsed} /> */}
          <div style={{ marginBottom: 30, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Switch
                id="collapse"
                checked={collapsed}
                onChange={() => setCollapsed(!collapsed)}
                label={collapsed ? "" : "Collapse"}
              />
            </div>
            
        </div>
      </Sidebar>

      <main style={{ position: 'absolute', top: 0, left: 10, width: '30px', height:'30px' }}>
  <div>
    <div>
      {broken && (
        <button className="sb-button text-text h-2 w-2 bg-background" onClick={() => setToggled(!toggled)}>
          <Icon className='h-8 w-8' />
        </button>
      )}
    </div>
    {/* <div style={{ marginBottom: '48px' }}>
      <Typography variant="h4" fontWeight={600}>
        React Pro Sidebar
      </Typography>
      <Typography variant="body2">
        React Pro Sidebar provides a set of components for creating high level and
        customizable side navigation
      </Typography>
      <PackageBadges />
    </div>

    <div style={{ padding: '0 8px' }}>
      

      <div style={{ marginBottom: 16 }}>
        <Switch id="rtl" checked={rtl} onChange={handleRTLChange} label="RTL" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Switch
          id="theme"
          checked={theme === 'dark'}
          onChange={handleThemeChange}
          label="Dark theme"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Switch id="image" checked={hasImage} onChange={handleImageChange} label="Image" />
      </div>
    </div> */}
  </div>
</main>
    </div>
    </div>
  );
};

export default Sidebars;