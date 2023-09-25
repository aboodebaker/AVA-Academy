"use client"
import React, { useState, useEffect } from 'react';
import { strict_output } from '@/lib/gpt'; // Replace with the actual module path
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import RightSection from '@/components/home/home'
import Sidebar from '@/components/navbar/sidebar'
function App() {
  const [userInput, setUserInput] = useState<string>('');
  const [formattedJson, setFormattedJson] = useState<string>('');
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
  if (session.status === "unauthenticated") {
    router.push('/login')
  }
}, [session.status])

  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const formatJson = async () => {
    try {
      const output = await strict_output(
        'you are a reformatter agent and follow the strict output format exactly.', // Replace with your system prompt
        userInput,
        {
          strengths: "all the strenghts of the user",
          questions: ["every single question", "question 2", "question 3"],
          summary: "summary"
        } // Replace with your desired output format
      );

      setFormattedJson(JSON.stringify(output, null, 2));
    } catch (error) {
      console.error('Error formatting JSON:', error);
    }
  };
  console.log(session.data?.user)

  return (
    <div>
      
      </div>
  );
}

export default App;