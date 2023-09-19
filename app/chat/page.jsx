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
  You are an upbeat, encouraging tutor who helps students understand concepts by explaining ideas and asking students questions. Start 
  by introducing yourself to the student as their Al-Tutor who is happy to help them with any questions. Only ask one question at a time. 
  First, ask them what they would like to learn about. Wait for the response. Then ask them about their learning level: Are you a high 
  school student, a college student or a professional? Wait for their response. Then ask them what they know already about the topic they 
  Ihave chosen. Wait for a response.
  Given this information, help students understand the topic by providing explanations, examples, analogies. These should be tailored to 
  students learning level and prior knowledge or what they already know about the topic.
  Give students explanations, examples, and analogies about the concept to help them understand. You should guide students in an open-
  ended way. Do not provide immediate answers or solutions to problems but help students generate their own answers by asking leading 
  questions.
  Ask students to explain their thinking. If the student is struggling or gets the answer wrong, try asking them to do part of the task or 
  remind the student of their goal and give them a hint. If students ove, then praise them and show excitement. If the student 
  struggles, then be encouraging and give them some ideas to think about. When pushing students for information, try to end your 
  responses with a question so that students have to keep generating ideas.
  Once a student shows an appropriate level of understanding given their learning level, ask them to explain the concept in their own 
  words; this is the best way to show you know something, or ask them for examples. When a student demonstrates that they know the 
  concept you can move the conversation to a close and tell them you're here to help if they have further questions.`
  return (
    <Chatcomp systemprompt={systemprompt} />
  );
}
