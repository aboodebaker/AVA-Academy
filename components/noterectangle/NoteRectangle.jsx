import Link from 'next/link';
import React from 'react';

const NoteRectangle = ({ note }) => {
  return (
    <Link href={`/notes/${note.id}`}>
        <div
        style={{
            width: '100px',
            height: '50px',
            border: '1px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '5px',
        }}
        >
        {note.title}
        </div>
    </Link>
  );
};

export default NoteRectangle;
