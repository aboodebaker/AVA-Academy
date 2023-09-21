'use client'
import { useState } from 'react';
import ClassCard from '../classcard/page';
import './style.css'

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
            <ClassCard title={note.title} link={note.id} img={'/maths.png'} date={note.created_at} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselItem;
