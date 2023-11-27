"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";
import { useState } from 'react';
import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import './stylecopy.css'
import { useEffect } from 'react';
import ActivityCard from "./activitycard";
import { pusherClient } from '@/lib/pusher';


const { format } = require('date-fns');

const ClassCard = ({title, link,  date, height, clip, divId, selectedFile, activities, userId,}) => {
  
  const [fdate, setFDate] = useState('')
  const [activitiess, setactivitiess] = useState(activities)

  useEffect(() => {
  if (date != null) {
    const idk = format(date, 'dd/MM/yyyy');
    setFDate('Date: ' + idk)
  }
  },[])

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
  useEffect(() => {
    const loadAdobeDCViewSDK = () => {
      
        // Initialize Adobe DC View when the SDK is ready
        
          const adobeDCView = new AdobeDC.View({ clientId: '1c9773d18f39418aab4d3510b525c51c', divId: divId });
          adobeDCView.previewFile({
            content: { location: { url: link } },
            metaData: { fileName: 'Bodea Brochure.pdf' }
          }, { embedMode: 'IN_LINE', exitPDFViewerType: "CLOSE" });
        }

      

    loadAdobeDCViewSDK();
  }, []);


  return (
<div className="gap-2 grid">
      <div className="border">
        <Card shadow="sm">
          <div onClick={() => selectedFile(link)}>
          <CardBody className="overflow-visible p-0">
            {/* <Image
              shadow="sm"
              radius="lg"
              width="100%"
              height="100%"
              alt={title}
              className="w-full object-cover"
              src={img}
            /> */}
            <div id={divId} className='pdf'></div>
            
          </CardBody>
          </div>
          <CardFooter>
            <div onClick={() => selectedFile(link)}>
            <div className="flexing">
              <div className="titlebox">
                <h1 className={clip}>{title}</h1>
              </div>
              </div>
              <div className="everythingbox">
                <p className="dates">{fdate}</p>
                
                <Dialog className="bg-background text-black">
                  <DialogTrigger>
                    <div>
                    <button className="bux">Options</button>
                  </div>
                  </DialogTrigger>
                  <DialogContent className="bg-background">
                    <DialogHeader className="bg-background">
                      <DialogTitle>Here are some options for your PDF</DialogTitle>
                      <DialogDescription>
                        
                      </DialogDescription>
                    </DialogHeader >
                    <h1>Have questions? Ask our AI that is based on your module</h1>
                    <Link href={`/chat/${height}`}>
                    <button className="bux-2">Chat with your module</button>
                    </Link>
                    <h1>Need to prepare for a test? Use our Quiz creation AI for an entire test or just a topic</h1>
                    <Link href={`/quiz/${height}`}>
                    <button className="bux-2">Get a quiz on your module</button>
                    </Link>
                    {/* <h1>Have questions. Ask our AI based on your module</h1>
                    <button onClick={() => { router.push(`/chat/${height}`)}}>Chat with your module</button> */}
                    <div className="scrolling-wrapper">
                      <h1>Activities</h1>
                    {activitiess.slice().reverse().map((file, index) => (
                  <div key={index} className="card">
                    <Link href={`/activity/${file.gameType == 'open_ended' ? 'open-ended' : 'mcq'}/${file.id}`}>
                      <ActivityCard title={file.topic} link={`/activity/${file.gameType}/${file.id}`} img={'/maths.png'} date={file.timeStarted} />
                       </Link>   
                  </div>
                ))}
                </div>
                  </DialogContent>
                </Dialog>
                
              </div>
            </div>
          </CardFooter>
        </Card>
        </div>
    </div>
  )
}

export default ClassCard