'use client'
import { useState } from 'react';
import ClassCard from '../classcard/page';
import './style.css'
import Link from 'next/link';
const CarouselItem = ({ notes }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    
    <div>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='input-inplace'
      />
      <div className="scrolling-wrapper">
        {filteredNotes.map((note, index) => (
          <div key={index} className="card">
            <Link href={`/notes/${note.id}`}>
              <ClassCard title={note.title} link={note.id} img={'./maths.png'} date={note.created_at} height={'100%'} clip={'title-clip'} />
            </Link>          
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselItem;
