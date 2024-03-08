'use client'
import { useState } from 'react';
import ClassCard from '../classcard/page';
import './style.css'
import Link from 'next/link';
import React, { useRef } from 'react';
import { useEffect } from 'react';

const CarouselItem = ({ notes }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [number, setNumber] = useState(0)
  
  React.useEffect(() => {
  // Define the effect function
  const checkDarkMode = () => {
    // Check local storage for dark mode preference
    const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
    const savedDarkMode = isLocalStorageAvailable
      ? window.localStorage.getItem('s-c') === 'true'
      : false

    // Synchronize dark mode state with local storage and body class
    if (savedDarkMode) {
      setNumber(50);
    }
    else {
      setNumber(250);
    }
  };

  // Run the effect continuously by including all dependencies
  checkDarkMode();

  // Set up an interval to continuously check for changes
  const intervalId = setInterval(checkDarkMode, 10); // Adjust the interval time as needed

  // Clean up by clearing the interval when the component unmounts
  return () => clearInterval(intervalId);
}, []); 

  
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    const divWidth = screenWidth - number -20;
    document.querySelector('.scrolling-wrapper').style.width = `${divWidth}px`;
  }, [number, screenWidth]);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    
    <div>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='input-inplace'
      />
      <div className="scrolling-wrapper">
        {filteredNotes.map((note, index) => (
          <div key={index} className="card">
            <Link href={`/notes/${note.id}`}>
              <ClassCard title={note.title} link={note.id} img={note.image} date={note.created_at} height={'100%'} clip={'title-clip'} />
            </Link>          
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselItem;
