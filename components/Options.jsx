'use client'
import React from 'react'
import { useEffect } from "react";
import Link from "next/link";
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ActivityCard from "./activitycard";
import { pusherClient } from '@/lib/pusher';
import { usePathname } from "next/navigation";
import './stylecopy.css'
import './sc-wrapper.css';


const Options = (id, activities, userId, courses) => {
     const pathname = usePathname();
    const [activitiess, setactivitiess] = useState(activities)


    useEffect(() => {
    pusherClient.subscribe(userId);

    pusherClient.bind('incoming-activities', (activity) => {
      setactivitiess([...activitiess, activity,  ]);
      console.log(activity)
    });

    



    return () => {
      pusherClient.unsubscribe(userId);
    };
  }, []); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Your API request code goes here
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data); // or do something with the data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Set up the interval to call fetchData every 500 milliseconds (half a second)
    const intervalId = setInterval(fetchData, 500);

    // Cleanup the interval when the component unmounts or the useEffect dependency changes
    return () => clearInterval(intervalId);
  }, []);

  const [number, setNumber] = useState(0)
  // try {
//   useEffect(() => {
//   // Define the effect function
//   const checkDarkMode = () => {
//     // Check local storage for dark mode preference
//     const isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
//     const savedDarkMode = isLocalStorageAvailable
//       ? window.localStorage.getItem('s-c') === 'true'
//       : false

//     // Synchronize dark mode state with local storage and body class
//     if (savedDarkMode) {
//       setNumber(50);
//     }
//     else {
//       setNumber(250);
//     }
//   };

//   // Run the effect continuously by including all dependencies
//   checkDarkMode();

//   // Set up an interval to continuously check for changes
//   const intervalId = setInterval(checkDarkMode, 10); // Adjust the interval time as needed

//   // Clean up by clearing the interval when the component unmounts
//   return () => clearInterval(intervalId);
// }, []); 

  
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setScreenWidth(window.innerWidth);
  //   };

  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);


  // useEffect(() => {
  //   try {
  //   const divWidth = screenWidth > 800 ? screenWidth - number : screenWidth
  //   document.querySelector('.scrolling-wrapper').style.width = `${divWidth}px`;

  //   console.log(activitiess)
  //   console.log(divWidth)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [number, screenWidth]);

  return (
    <div>
        <h1 className=" text-text">Have questions? Ask our AI that is based on your module</h1>
        <Link href={`${pathname.includes('/teacher-platform') ? '/teacher-platform' : ''}/chat/${id}`}>
          <button className="bux-2">Chat with your module</button>
        </Link>
        <h1 className=" text-text">Need to prepare for a test? Use our Quiz creation AI for an entire test or just a topic</h1>
        <Link href={`/quiz/${id}`}>
          <button className="bux-2">Get a quiz on your module</button>
        </Link>
        <h1 className=" text-text">Do you want to evaluate your strengths and weaknesses for this file?</h1>
        <Link href={`/file-performance/${id}`}>
          <button className="bux-2">Evaluate yourself</button>
        </Link>

        <h1 className=" text-text">{activitiess ? "Activities" : ''}</h1>
          <div className="scrolling-wrapper">         
            {activitiess ? activitiess.slice().reverse().map((file, index) => (
              <div key={index} className="card">
                <Link href={`${pathname.includes('/teacher-platform') ? '/teacher-platform' : ''}/${pathname.includes('/teacher-platform') ? 'activities' : 'activity'}/${file.gameType == 'open_ended' ? 'open-ended' : 'mcq'}/${file.id}`}>
                    <ActivityCard title={file.topic} link={`/activity/${file.gameType}/${file.id}`} img={file.image ? file.image : '/maths.png'} date={file.timeStarted}  />
                </Link>   
              </div>
            )) : <></>}
        </div>

        <h1 className=" text-text">{courses ? "Courses" : ''}</h1>
          <div className="scrolling-wrapper">         
            {courses ? courses.slice().reverse().map((file, index) => (
              <div key={index} className="card">
                <Link href={`/course/${file.id}/0/0`}>
                    <ActivityCard title={file.name} link={`/course/${file.id}`} img={file.image ? file.image : '/maths.png'} date={null}  />
                </Link>   
              </div>
            )) : <></>}
        </div>
    </div>
  )
}

export default Options