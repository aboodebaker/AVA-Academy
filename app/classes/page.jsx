'use client'
import Class from '@/components/classes/page'
import React from "react";

import styles from "./page.module.css";


const Page = async () => {
  
    
  const subjects = [
  { name: 'Maths', image: '/maths.png' },
  { name: 'English', image: '/english.png' },
  { name: 'Afrikaans', image: '/afrik.png' },
  { name: 'History', image: '/history.png' },
  { name: 'Geography', image: '/geog.png' },
  { name: 'Physics', image: '/physics.png' },
  { name: 'Life Science', image: '/ls.png' },
  { name: 'ISW', image: '/isw.png' },
  { name: 'ISO', image: '/iso.png' },
  { name: 'Quraanic Arabic', image: '/qa.png' },
  { name: 'Technology', image: '/egd.png' },
  { name: 'Creative Arts', image: '/art.png' },
  { name: 'Coding and Robotics', image: '/car.png' },
  { name: 'Life Orientation', image: '/lo.png' },
];




return (
  <div className={styles.container}>
  <div className={styles.headertable}>
    <h1 className={styles.header}>Classes</h1>
  </div>
  <Class subjects={subjects}/>
</div>
);

  


  };


export default Page;