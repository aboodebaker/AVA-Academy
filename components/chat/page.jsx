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
 

import { useChat } from 'ai/react';
import './page.css'

export default function Chatcomp({systemprompt}) {
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({api:'/api/chat-n', initialMessages: [{role:'system', content:systemprompt}]});
 
  return (
    <div className="chat-container">
    <div className="message-container">
      <div className="message-list">
        {messages.map((m, index) => (
          m.role !== 'system' && ( // Exclude system prompts from rendering
            <div key={index} className={`message ${m.role}`}>
              <p dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br />') }} />
            </div>
          )
        ))}
      </div>
    </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          className="input-field"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit" className='submit-button'>Send</button>
      </form>
    </div>
  );
}
