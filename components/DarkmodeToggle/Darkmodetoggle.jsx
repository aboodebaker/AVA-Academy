"use client"
import React, { useState, useEffect } from 'react';
import './dark.css'
const DarkModeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
<label class="ui-switch">
  <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((prevDarkMode) => !prevDarkMode)} />
  <div class="slider">
    <div class="circle"></div>
  </div>
</label>
  );
};

export default DarkModeSwitcher;

