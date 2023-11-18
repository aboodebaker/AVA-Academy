// @ts-nocheck
'use client'
import React from 'react';
import GridLayout from 'react-grid-layout';
import { WidthProvider, Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import OpenEnded from '@/components/OpenEndedActivity';
import Adobe from '../adobefile/Adobe';
import Summary from './summaryS';
import Notes from './Notes';
import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { pusherClient } from '@/lib/pusher';
import MCQ from '../MCQActivity';
import './style.css'

interface Props {
  game: any;
  file: any;
  notes?: any;
  note?: any;
  userId: string
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const Activity =  ({ game, file, notes, note, userId }: Props) => {


  // useEffect(() => {
  //   const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  //     cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  //     authEndpoint: '/api/pusher-auth',
  //     authTransport: 'ajax',
  //     auth: {
  //       params: {
  //         socket_id: () => { let m = Math.random() * 100 
  //           m= m.rounded()
  //         return m},
  //         channel_name: `activity-${game.uniqueId}`, // Replace with your channel name
  //       },
  //     },
  //   });

  //   // Add event listeners or any other logic as needed

  //   // return () => {
  //   //   pusherClient.disconnect();
  //   // };
  // }, []);

      const layouts = {
  lg: [
    { i: 'a', x: 6, y: 0, w: 3, h: 11, isDraggable: false},
    { i: 'b', x: 0, y: 0, w: 6, h: 22 },
    { i: 'c', x: 10, y: 0, w: 3, h: 22, isDraggable: false },
    { i: 'd', x: 6, y: 11, w: 3, h: 11, isDraggable: false },
  ],
  md: [
    { i: 'a', x: 0, y: 22, w: 5, h: 15, isDraggable: false },
    { i: 'b', x: 0, y: 0, w: 6, h: 22 },
    { i: 'c', x: 6, y: 0, w: 4, h: 11, isDraggable: false },
    { i: 'd', x: 5, y: 22, w: 5, h: 15, isDraggable: false },
  ],
  sm: [
    { i: 'a', x: 0, y: 22, w: 4, h: 11, isDraggable: false },
    { i: 'b', x: 0, y: 0, w: 6, h: 10 },
    { i: 'c', x: 0, y: 11, w: 3, h: 10, isDraggable: false },
    { i: 'd', x: 4, y: 11, w: 3, h: 10, isDraggable: false },
  ],
  xs: [
    { i: 'a', x: 0, y: 17, w: 4, h: 5 },
    { i: 'b', x: 0, y: 0, w: 4, h: 5 },
    { i: 'c', x: 0, y: 11, w: 4, h: 5, isDraggable: false },
    { i: 'd', x: 0, y: 23, w: 5, h: 5, isDraggable: false },
  ],
  xxs: [
    { i: 'a', x: 0, y: 17, w: 2, h: 5 },
    { i: 'b', x: 0, y: 0, w: 2, h: 5 },
    { i: 'c', x: 0, y: 11, w: 2, h: 5, isDraggable: false },
    { i: 'd', x: 5, y: 23, w: 5, h: 5, isDraggable: false },
    
  ],
};

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={30}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      compactType="vertical"
    >
      <div key="a" className='border border-solid border-text scrolling-wrapper'>
        <MCQ game={game} userId={userId}/>
      </div>
      <div key="b" className='border border-solid border-text'><Adobe file={file}/></div>
      <div key="c" className='border border-solid border-text scrolling-wrapper'><Summary summary={game.summary} id={game.uniqueId}/></div>
      <div key={'d'} className='scrolling-wrapper border border-solid border-text'><Notes notes={notes} note={note} activityId={game.id}/></div>
    </ResponsiveGridLayout>
  );
};

export default Activity;
