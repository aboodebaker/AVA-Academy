'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import './style.css';
import Image from 'next/image';
import { format } from 'date-fns';

const ClassCard = ({ title, link, img, date, clip }) => {
  const [fdate, setFDate] = useState('');
  
  useEffect(() => {
    if (date != null) {
      const formattedDate = format(date, 'dd/MM/yyyy');
      setFDate('Date: ' + formattedDate);
    }
  }, [date]);

  return (
    <div className="gap-2 grid mb-4">
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
  );
}

export default ClassCard;
