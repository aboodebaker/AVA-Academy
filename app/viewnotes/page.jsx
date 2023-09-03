import NoteRectangle from '@/components/noterectangle/NoteRectangle';

import Loader from '@/components/loader/Loader';
import Router from 'next/navigation';
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const Hoe = ({ notes }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {notes.map((note) => (
        <NoteRectangle key={note.id} note={note} />
      ))}
    </div>
  );
};

const Home = async () => {
  const router = Router;
  const session = await getServerSession(authOptions)
  const prisma = new PrismaClient()

//   const fetchData = async () => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         body: JSON.stringify({ email: email }),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = await response.json();
//       setNotes(data);
//       setLoader(false)
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

const notes = await prisma.notes.findMany({
    where: {
        userId: session.user.id
    }
})

console.log(notes)





  const groupNotesBySubject = () => {
    const groupedNotes = {};
    notes.forEach((note) => {
      const { subject } = note;
      if (groupedNotes[subject]) {
        groupedNotes[subject].unshift(note); // Use unshift to reverse the order
      } else {
        groupedNotes[subject] = [note];
      }
    });
    return groupedNotes;
}


  // Get the notes grouped by subject
  const groupedNotes = groupNotesBySubject();


  return (

      <div>
        
          <>
            {Object.entries(groupedNotes).map(([subject, notes], index) => (
              <div key={subject} className="font-bold p-2">
                <h2>{subject}</h2>
                <div className="flex flex-wrap">
                  {notes.map((note) => (
                    <NoteRectangle key={note.id} note={note} />
                  ))}
                </div>
              </div>
            ))}
          </>
      </div>
  
  );
}

export default Home;