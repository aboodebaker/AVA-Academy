'use client'
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

const PDFViewer = ({ id, pdf_Url, activities, userId, courses }, {children} ) => {

     const pathname = usePathname();
  const [fdate, setFDate] = useState('')
  const [activitiess, setactivitiess] = useState(activities)
  const [activeTab, setActiveTab] = useState(true);
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
    const divWidth = screenWidth - number;
    document.querySelector('.scrolling-wrapper').style.width = `${divWidth}px`;
  }, [number, screenWidth]);

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


  const handleSave = async (metaData, content, options) => {
  try {
    // Upload modified PDF content to Cloudinary
    const cloudinaryResponse = await uploadToS3(content);

    if (cloudinaryResponse && cloudinaryResponse.file_key) {
      return Promise.resolve({
        code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
        data: {
          metaData: {
            fileName: metaData.fileName,
            cloudinaryUrl: getS3Url(cloudinaryResponse.file_key)
          }
        }
      });
    } else {
      return Promise.reject({
        code: AdobeDC.View.Enum.ApiResponseCode.FAIL,
        data: 'Please try again later'
      });
    }
  } catch (error) {

    console.log(error)
    return Promise.reject({
      code: AdobeDC.View.Enum.ApiResponseCode.FAIL,
      data: { /* optional error data */ }
    });
  }
};
  useEffect(() => {
 if (activeTab === true) {
    const embedOptions = {
      clientId: '1c9773d18f39418aab4d3510b525c51c',
    };

    const adobeDCView = new window.AdobeDC.View(embedOptions);
    adobeDCView.registerCallback(
      AdobeDC.View.Enum.CallbackType.SAVE_API,
      handleSave,
      {
        autoSaveFrequency: 0,
        enableFocusPolling: false,
        showSaveButton: true
      }
    );
    adobeDCView.previewFile(
      {
        content: { location: { url: pdf_Url } },
        metaData: { fileName: 'PDF Document' }, // You can customize the file name here
      },{embedMode: 'FULL_WINDOW'}
      
    );

  }
  }, [pdf_Url, activeTab]);


  const handleTabChange = () => {
    setActiveTab(!activeTab);
  };

  return (
    <div className="w-full h-full">
    

    <Tabs defaultValue="viewer" onChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="viewer" className="text-text">PDF Viewer</TabsTrigger>
        <TabsTrigger value="options" className="text-text">Options</TabsTrigger>
      </TabsList>
      <TabsContent value="viewer">
        <div>
        <div id="adobe-dc-view" className="w-full h-screen"></div>

        </div>
      </TabsContent>


      <TabsContent value="options">
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

        <h1 className=" text-text">Activities</h1>
          <div className="scrolling-wrapper">         
            {activitiess.slice().reverse().map((file, index) => (
              <div key={index} className="card">
                <Link href={`${pathname.includes('/teacher-platform') ? '/teacher-platform' : ''}/${pathname.includes('/teacher-platform') ? 'activities' : 'activity'}/${file.gameType == 'open_ended' ? 'open-ended' : 'mcq'}/${file.id}`}>
                    <ActivityCard title={file.topic} link={`/activity/${file.gameType}/${file.id}`} img={file.image ? file.image : '/maths.png'} date={file.timeStarted}  />
                </Link>   
              </div>
            ))}
        </div>

        <h1 className=" text-text">Courses</h1>
          <div className="scrolling-wrapper">         
            {courses.slice().reverse().map((file, index) => (
              <div key={index} className="card">
                <Link href={`/course/${file.id}/0/0`}>
                    <ActivityCard title={file.name} link={`/course/${file.id}`} img={file.image ? file.image : '/maths.png'} date={null}  />
                </Link>   
              </div>
            ))}
        </div>


      </TabsContent>
    </Tabs>
    </div>
  );
};


export default PDFViewer;