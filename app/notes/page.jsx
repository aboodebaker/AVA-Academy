import CarouselItem from '@/components/carousel/carasoul';
import SCarousel from '@/components/carousel/searchcomponent'
import Carousel from 'react-bootstrap/Carousel';
import Loader from '@/components/loader/Loader';
import Router from 'next/navigation';
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { Session } from 'inspector';
import './style.css'
//   notes: [
//     {
//       title: "Math Homework",
//       subject: "Mathematics",
//       content: "Solve problems 1 to 5 on page 30.",
//       image: "math_homework.jpg",
//       shared: false,
//       userId: 1, // User ID of John Doe
//     },
//     {
//       title: "History Notes",
//       subject: "History",
//       content: "Important historical events in the 20th century.",
//       image: "history_notes.jpg",
//       shared: true,
//       peopleshared: "alice@example.com", // Shared with Alice
//       userId: 1, // User ID of John Doe
//     },
//     // Add more note data as needed
//   ],


const Home = async () => {
  const router = Router;
  const session = await getServerSession(authOptions)
  const prisma = new PrismaClient()

if (session) {



const notes = await prisma.notes.findMany({
    where: {
        userId: session.user.id
    }
})

const subjects = await prisma.subject.findMany({
  where: {
    userId: session.user.id
  }
})






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
          <SCarousel notes={notes} groupedNotes={groupedNotes} subjects={subjects} />
      </div>
  );
} 
  
else {
  // Handle the case where no session is found
  redirect("/login");
}
}

export default Home;