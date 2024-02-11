'use client'
import * as React from 'react';
import { useState } from 'react';
import {Card, CardBody, CardFooter,} from "@nextui-org/react";
import './style.css'
import { useEffect } from 'react';
import Image from 'next/image';

const { format } = require('date-fns');

const ActivityCard = ({title, link, img, date,}) => {
  const [fdate, setFDate] = useState('')
  // useEffect(() => {
  // if (date != null) {
  //   const idk = format(date, 'dd/MM/yyyy');
  //   setFDate('Date: ' + idk)
  // }
  // },[])
  return (
<div className="gap-2 grid">
      <div className="border">
        <Card shadow="sm" isPressable onPress={() => console.log("item pressed")} className='w-full h-full'>
          <CardBody className="overflow-hidden p-0">
            <div className="aspect-r">
              <div className="relative h-full">
              <Image
                  layout="fill"
                  objectFit="cover"
                  alt={title}
                  src={img}
                />
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <div className="flexing">
              <div className="titlebox text-black">
                <h1 className='text-black'>{title}</h1>
              </div>
              <div className="everythingbox text-black">
                <p className="dates text-black">{fdate}</p>
                <button className="bux">Open</button>
                
              </div>
            </div>
          </CardFooter>
        </Card>
        </div>
    </div>
  )
}

export default ActivityCard