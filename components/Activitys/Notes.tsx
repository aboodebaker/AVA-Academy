// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react';
import ClassCard from './page';
import './style.css';
import CreateNoteDialog from '../CreateNoteDialogActivity';
import axios from 'axios';
import TipTapEditor from '../TipTapEditor';

const Notes = ({ notes, actualNote, activityId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [note, setNote] = useState('');
  const [once, setOnce] = useState(0);
  const [actualnote, setActualNote] = useState(actualNote);

  const headers = {
    'Content-Type': 'application/json', // Adjust the content type based on your needs
  };

  useEffect(() => {
    if (note !== '') {
      axios
        .post('/api/setnotes', { note: note, activityId }, { headers })
        .then((response) => {
          setActualNote(response.data.note);
        })
        .catch((error) => {
          console.error('Error setting note:', error);
        });
    }
  }, [note, activityId, headers]);
  if (notes !== null) {
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  } else {
    const filteredNotes = null
  }

  return (
    <div>
      {actualnote == null ? (
        <div>
        <div>
          <div className="inputsbox">
            <div className="inputbox">
              <input
                type="text"
                placeholder="Find Notes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
              />
              <div className="inputiconbox">
                {/* Your SVG goes here */}
              </div>
            </div>
          </div>
          <CreateNoteDialog setter={setNote} />
        </div>
        <div className="scrolling-wrapper">
        {filteredNotes.map((note, index) => (
          <div key={index} className="card">
            <ClassCard
              title={note.title}
              link={setNote}
              img={note.image}
              date={note.created_at}
              id={note.id}
              clip={'title-clip'}
            />
          </div>
        ))}
      </div>
      </div>
      ) : (
        <TipTapEditor note={actualnote} />
      )}
      
    </div>
  );
};

export default Notes;