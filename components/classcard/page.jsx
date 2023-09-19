'use client'
import * as React from 'react';
import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import './style.css'
const ClassCard = ({title, link, img, date, }) => {
  return (
<div className="gap-2 grid ">
      <div className="border">
        <Card shadow="sm" isPressable onPress={() => console.log("item pressed")}>
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              height='100%'
              alt={title}
              className="w-full object-cover"
              src={img}
            />
          </CardBody>
          <CardFooter>
            <div className="flexing">
              <div className="titlebox">
                <h1 className='title'>{title}</h1>
              </div>
              <div className="everythingbox">
                <p className="dates">{date}</p>
                <button className="button">Open</button>
                
              </div>
            </div>
          </CardFooter>
        </Card>
        </div>
    </div>
  )
}

export default ClassCard