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
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';

const { format } = require('date-fns');

const ClassCard = ({title, link,  date, height, clip, divId, selectedFile, activities, userId, fileId}) => {
    const pathname = usePathname();
  const [fdate, setFDate] = useState('')
  const [activitiess, setactivitiess] = useState(activities)
const router = useRouter();
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
    try{
    const loadAdobeDCViewSDK = () => {
      
        // Initialize Adobe DC View when the SDK is ready
        
          const adobeDCView = new AdobeDC.View({ clientId: '1c9773d18f39418aab4d3510b525c51c', divId: divId });
          adobeDCView.previewFile({
            content: { location: { url: link } },
            metaData: { fileName: 'Bodea Brochure.pdf' }
          }, { embedMode: 'IN_LINE', exitPDFViewerType: "CLOSE" });
        }

      setTimeout(function() {
       loadAdobeDCViewSDK();
}, 200); 
    } catch (error) {
      console.log(error)
      router.reload();
    }

  }, []);


  return (
<div className="gap-2 grid">
  <Link href={`/file/${pathname.includes('/teacher-platform') ? '/teacher-platform' : ''}/${fileId}`}>
      <div className="border">
        <Card shadow="sm">
          <div>
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
              <div className="titlebox text-black">
                <h1 className={clip}>{title}</h1>
              </div>
              </div>
              <div className="everythingbox">
                <p className="dates">{fdate}</p>
                
                <Dialog className="bg-white text-black" >
                  <DialogTrigger>
                    <div>
                    <button className="bux">Options</button>
                  </div>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader className="bg-white text-black">
                      <DialogTitle className="text-black">Here are some options for your PDF</DialogTitle>
                      <DialogDescription>
                        
                      </DialogDescription>
                    </DialogHeader >
                    <h1 className=" text-black">Have questions? Ask our AI that is based on your module</h1>
                    <Link href={`${pathname.includes('/teacher-platform') ? '/teacher-platform' : ''}/chat/${height}`}>
                    <button className="bux-2">Chat with your module</button>
                    </Link>
                    <h1 className=" text-black">Need to prepare for a test? Use our Quiz creation AI for an entire test or just a topic</h1>
                    <Link href={`/quiz/${height}`}>
                    <button className="bux-2">Get a quiz on your module</button>
                    </Link>
                    <h1 className=" text-black">Do you want to evaluate your strengths and weaknesses for this file?</h1>
                    <Link href={`/file-performance/${height}`}>
                    <button className="bux-2">Evaluate yourself</button>
                    </Link>
                    {/* <h1>Have questions. Ask our AI based on your module</h1>
                    <button onClick={() => { router.push(`/chat/${height}`)}}>Chat with your module</button> */}
                    <h1 className=" text-black">Activities</h1>
                    <div className="scrolling-wrapper">
                      
                    {activitiess.slice().reverse().map((file, index) => (
                  <div key={index} className="card">
                    <Link href={`${pathname.includes('/teacher-platform') ? '/teacher-platform' : ''}/${pathname.includes('/teacher-platform') ? 'activities' : 'activity'}/${file.gameType == 'open_ended' ? 'open-ended' : 'mcq'}/${file.id}`}>
                      <ActivityCard title={file.topic} link={`/activity/${file.gameType}/${file.id}`} img={file.image ? file.image : '/maths.png'} date={file.timeStarted}  />
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
        </Link>
    </div>
  )
}

export default ClassCard