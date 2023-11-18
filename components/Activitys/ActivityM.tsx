'use client'
import React from 'react';
import GridLayout from 'react-grid-layout';
import { WidthProvider, Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import OpenEnded from '@/components/OpenEndedActivity';
import Adobe from '../adobefile/Adobe';
import Summary from './summary';
import OpenEndedTeacherEdit from './OpenEndedTeacherEdit';
import './style.css'
import Notes from './Notes';
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import MCQTeacherEdit from './MCQTeacherEdit';
import UserAnswerCorrect from './userAnswerCorrect';
interface Props {
  game: any;
  file: any;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const Activity = ({ game, file }: Props) => {

  const [isStudentOnline, setIsStudentOnline] = useState(false);





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
      <div key="a" className='border border-solid border-gray-500 scrolling-wrapper'>
        <MCQTeacherEdit game={game} />
      </div>
      <div key="b" className='border border-solid border-gray-500 '><Adobe file={file}/></div>
      <div key="c" className='border border-solid border-gray-500 scrolling-wrapper'>
        <Summary summary={game.summary} id={game.uniqueId}/>
      </div>
      <div key={'d'} className='scrolling-wrapper border border-solid border-text'><UserAnswerCorrect/></div>
      
    </ResponsiveGridLayout>
  );
};

export default Activity;
