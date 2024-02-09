'use client'
import * as React from 'react';
import { useState } from 'react';
import {Card, CardBody, CardFooter,} from "@nextui-org/react";
import './style.css'
import { useEffect } from 'react';
import Image from 'next/image';

const { format } = require('date-fns');

const ClassCard = ({title, link, img, date,  clip}) => {
  const [fdate, setFDate] = useState('')
  useEffect(() => {
  if (date != null) {
    const idk = format(date, 'dd/MM/yyyy');
    setFDate('Date: ' + idk)
  }
  },[])
  return (
<div className="gap-2 grid mb-4">
      <div className="border">
        <Card shadow="sm" isPressable onPress={() => console.log("item pressed")}>
          <CardBody className="overflow-hidden p-0">
            <div className='relative-global'>
              <Image
                height={100}
                width={100}
                alt={title}
                className="w-full object-cover"
                src={img}
                sizes="(max-width: 300px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </CardBody>
          <CardFooter>
            <div className="flexing">
              <div className="titlebox">
                <h1 className={clip}>{title}</h1>
              </div>
              <div className="everythingbox">
                <p className="dates">{fdate}</p>
                <button className="bux">Open</button>
                
              </div>
            </div>
          </CardFooter>
        </Card>
        </div>
    </div>
  )
}

export default ClassCard