'use client'
import React from 'react';
import GridLayout from 'react-grid-layout';
import { WidthProvider, Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import OpenEnded from '@/components/OpenEnded';

interface Props {
  game: any;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const Activity = ({ game }: Props) => {
  const layout = [
    { i: 'a', x: 0, y: 0, w: 10, h: 7, },
    { i: 'b', x: 1, y: 0, w: 5, h: 3, },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 },
  ];

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={30}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      compactType="vertical"
    >
      <div key="a" className='border border-solid border-gray-500'>
        <OpenEnded game={game} />
      </div>
      <div key="b" className='border border-solid border-gray-500'>b</div>
      <div key="c" className='border border-solid border-gray-500'>c</div>
    </ResponsiveGridLayout>
  );
};

export default Activity;
