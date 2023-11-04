'use client'
import * as React from 'react';
import { useState } from 'react';
import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import './stylecopy.css'
import { useEffect } from 'react';

const { format } = require('date-fns');

const ClassCard = ({title, link,  date,  clip, divId, selectedFile}) => {
  const [fdate, setFDate] = useState('')
  useEffect(() => {
  if (date != null) {
    const idk = format(date, 'dd/MM/yyyy');
    setFDate('Date: ' + idk)
  }
  },[])

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
        <Card shadow="sm" isPressable onPress={() => selectedFile(link)}>
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