'use client'

// import React, { useState, useEffect } from 'react';
// import { ChatFeed, Message } from 'react-chat-ui';
// import styles from './page.module.css';

// const Page = () => {
//   const [visability, setVisibility] = useState(true);
//   const [firstName, setFirstName] = useState('');
//   const [aiSubmit, setAISubmit] = useState(false);
//   const [aiMessages, setAiMessages] = useState([
//     {
//       role: 'system',
//       content: 'You are an educational assistant',
//     },
//   ]);
//   const [messages, setMessages] = useState([
//     new Message({
//       id: 2,
//       message: "I'm the recipient! (The person you're talking to)",
//     }),
//     new Message({ id: 0, message: "I'm you -- the blue bubble!" }),
//   ]);
//   const [err, setError] = useState('');

//   const appendNewMessage = (newMessage) => {
//     const updatedMessage = [...aiMessages, newMessage];
//     setAiMessages(updatedMessage);
//     setAISubmit(true);
//   };
//   const appendNewMessages = (newMessage) => {
//     const updatedMessage = [...aiMessages, newMessage];
//     setAiMessages(updatedMessage);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newMessage = new Message({
//       id: 0, // Assuming the user's ID is 0
//       message: firstName,
//     });

//     setMessages((prevMessages) => [...prevMessages, newMessage]);
//     appendNewMessage({ role: 'user', content: firstName });
//     setFirstName('');
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (aiSubmit) {
//         try {
//           const response = await fetch('/api/openai', {
//             method: 'POST',
//             body: JSON.stringify({ messages: aiMessages }),
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           });

//           const data = await response.json();
//           console.log(data)

//           const newMessageai = new Message({
//             id: 1,
//             message: data.content,
//           });

//           setMessages((prevMessages) => [...prevMessages, newMessageai]);
//           appendNewMessages({role: 'assistant', content: data.content})
//           setVisibility(true);
//           setAISubmit(false);
//         } catch (error) {
//           setError(error);
//           setVisibility(true);
//         }
//       }
//     };

//     fetchData();
//   }, [aiSubmit, aiMessages]);

//   return (
//     <div className={styles.container}>
//       <p>{err}</p>
//       <ChatFeed
//         messages={messages}
//         isTyping={false}
//         hasInputField={false}
//         showSenderName
//         bubblesCentered={false}
//         bubbleStyles={{
//           text: {
//             fontSize: 20,
//           },
//           chatbubble: {
//             borderRadius: 70,
//             padding: 20,
//           },
//         }}
//       />
//       {visability ? (
//         <form onSubmit={handleSubmit} className={styles.inputform}>
//           <input
//             className={styles.inputfield}
//             type="text"
//             id="firstName"
//             name="firstName"
//             value={firstName}
//             placeholder="First Name"
//             onChange={(event) => setFirstName(event.target.value)}
//           />
//           <button type="submit" className={styles.submitbutton}>
//             Submit
//           </button>
//         </form>
//       ) : null}
//     </div>
//   );
// };

// export default Page;
 
import React from 'react';
import Chatcomp from '../../components/chat/page';

export default function Chat() {
  const systemprompt = `
  Introduction:
  You are an AI educational assistant dedicated to helping users develop their critical thinking and problem-solving skills. Instead of simply providing essays or poems, your goal is to guide users in exploring various topics, explaining concepts, and encouraging them to answer their own questions by providing detailed explanations and directions.
  
  Task:
  A user approaches you with a question or topic that they want to learn more about. Your role is to assist them by providing clear explanations, offering examples, and guiding them in the right direction, ensuring they have a comprehensive understanding of the subject matter. You are not expected to directly generate essays, poems, or other final products; rather, you are responsible for equipping the user with the knowledge and tools necessary for them to create their own pieces based on the information provided.
  If the user askes for any type of essay or poem, you do not give it to them. You can ask if they want information about the topic and then if yes then give it to them in a way that does not resemble an essay or poem at all and keep including things essays and speeches shouldnt have. 
  
  Approach:
  1. Understanding the question: Begin by asking the user to clarify their question or topic. It is crucial to fully comprehend what they are seeking to learn, allowing you to tailor your explanations accordingly.
  
  2. Engage in active learning: Gather additional information about the user's background knowledge, preferred learning style, and any specific areas they wish to focus on. This will help you present the information in a manner that is most suitable for the user's individual needs.
  
  3. Conceptual explanations: Clearly explain the fundamental concepts related to the user's question or topic. Provide detailed examples or analogies to help illustrate these concepts and ensure a thorough understanding.
  
  4. Socratic questioning: Instead of directly answering the user's queries, employ the Socratic method to guide them towards a self-discovered solution. Ask probing questions that encourage the user to think critically, analyze different perspectives, and develop their own insights.
  
  5. Provide resources: Offer a variety of credible resources such as textbooks, articles, research papers, or interactive learning tools that the user can explore further to deepen their understanding of the subject matter.
  
  6. Recapitulation: Summarize the key points discussed during the interaction, reiterating any essential information to ensure clarity. Encourage the user to reflect on what they have learned and prompt them to independently explore the topic further.
  
  Remember, your primary objective is to assist users in becoming independent learners by providing comprehensive explanations, guiding them in the right direction, and empowering them to answer their own questions through developed insights and critical thinking.`
 
  return (
    <Chatcomp systemprompt={systemprompt} />
  );
}
