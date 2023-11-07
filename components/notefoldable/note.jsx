'use client'
import { PrismaClient } from '@prisma/client';
import React from 'react'
import { useState } from 'react'
import Link from 'next/link';
import './style.css'
import ClassCard from '../classcard/page';
const Note = ({notes}) => {
    const [isNotesCollapsed, setIsNotesCollapsed] = React.useState(true);
    const [searchQuery, setSearchQuery] = useState('');

  const toggleNotesSection = () => {
    setIsNotesCollapsed((prevValue) => !prevValue);
  };
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
     <div className="contain ">
        <div
          className="headings headertable"
          onClick={toggleNotesSection}
        >
          <h1>All Notes</h1>
          <h1>{isNotesCollapsed ? "+" : "-"}</h1>
        </div>
        {!isNotesCollapsed && (
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
                    <ClassCard title={note.title} link={note.id} img={'/maths.png'} date={note.created_at} height={'100%'} clip={'title-clip'} />
                    </Link>          
                </div>
                ))}
            </div>
           </div>
        )}
      </div>
  )
}

export default Note