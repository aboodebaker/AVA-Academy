'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu as Icon } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { Button } from "./ui/button";
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, MenuItemStyles } from 'react-pro-sidebar';
import { Typography } from './Typography';
import { Badge } from './Badge';

const MobileSidebar = ({ chats, chatId, isPro, useClient }) => {
    const [showSidebar, setShowSidebar] = useState(false); 
      const [collapsed, setCollapsed] = React.useState(false);
  const [toggled, setToggled] = React.useState(false);
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

    // Function to toggle the sidebar
  const toggleSidebar = (event) => {
    event.preventDefault(); // Prevent default button behavior
    setToggled(!toggled);
  };

  const menuItemStyles = {
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
        <div className='h-full'>
            {useClient ? (


        <button className="sb-button text-text h-2 w-2 bg-background md:hidden" onClick={() => setToggled(!toggled)} style={{ position: 'absolute', top: 40, left: 10, width: '30px', height:'30px', zIndex: '1', }}>
          <Icon className='h-8 w-8' />
        </button>
            )
        : <></>}
            <div style={{ display: 'flex', height: '100%', direction: rtl ? 'rtl' : 'ltr' }} >
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
        style={{zIndex: '2'}}
      >
                <div className="flex h-screen w-full overflow-hidden pb-20 flex-col gap-2 mt-4">
                    <div className='flex justify-center align-center w-full'>
                        <Link href="/chat">
                            <Button className="w-90 border-dashed border-white border m-5 text-text">
                                Normal Chat
                            </Button>
                        </Link>
                    </div>
                    <div style={{ padding: '0 24px', marginBottom: '8px' }}>
            <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
            >
                Subjects
            </Typography>
            </div>
                <Menu menuItemStyles={menuItemStyles}>
                    {Object.entries(PDFList(chats)).map(([subject, pdfs]) => (
                        <div key={subject}  style={{ padding: '0 24px', marginBottom: '8px' }}>
                          <SubMenu
                label={subject}
                // icon={<BarChart />}
                suffix={
                  <Badge variant="info" shape="circle">
                    {pdfs.length}
                  </Badge>
                }
              >

                                {pdfs.map(chat => (
                                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                                        <MenuItem>
                                            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-text text-ellipsis">
                                                {chat.pdfName}
                                            </p>
                                        </MenuItem>
                                    </Link>
                                ))}

                            </SubMenu>
                        </div>
                    ))}
                </Menu>
                </div>


            </Sidebar>
            </div>
        </div>
    );
};

export default MobileSidebar;


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
      backgroundColor: '#202020',
      color: '#ffffff',
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
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const PDFList = (pdfData) => {
  // Create an object to store PDFs by subject
  const pdfBySubject = {};

  // Iterate through the pdfData array to organize PDFs by subject
  pdfData.forEach(pdf => {
    const subjectName = pdf.Subject.name;
    // If subjectName doesn't exist as a key in pdfBySubject, create it and set its value to an empty array
    if (!pdfBySubject[subjectName]) {
      pdfBySubject[subjectName] = [];
    }
    // Push the current PDF object into the corresponding subject array
    pdfBySubject[subjectName].push(pdf);
  });

  return pdfBySubject;
}