'use client'
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSession } from 'next-auth/react';
import Loader from '../loader/Loader';
const subjectOptions = [
  'Maths',
  'English',
  'Afrikaans',
  'History',
  'Geography',
  'Physics',
  'Life Science',
  'ISW',
  'ISO',
  'Quraanic Arabic',
  'Technology',
  'Creative Arts',
  'Coding and Robotics',
  'Life Orientation',
];
const RichTextArea = ({ value, onChange }) => {
  const session = useSession();
  const [showOverlay, setShowOverlay] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setcontent] = useState('');
  const [shared, setIsShared] = useState(false);
  const [poster, setPoster] = useState('Post')
  const [loader, setLoader] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (session.status === 'authenticated'){
      setLoader(false)
      const email = session.data.user.email
    setEmail(email)}
  }, [])
  const handleSaveClick = () => {
    setShowOverlay(true);
  };
  if (session.status === 'loading') {
    setLoader(true)
  }


  

  const handlePostClick = async (e) => {
    // Make an API request to save the content and the title/subject to the database
    e.preventDefault();
    setPoster('Posting')
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, title, subject, content , shared}),
      }).then(() => {
        // Handle successful post submission here
        // For example, show a success message or redirect to a different page
        console.log('Post sent successfully!');
        setPoster('Posted')
        setShowOverlay(false);
      });
    } catch (error) {
      setPoster('Failed')
    }
    
  };

  const closeOverlay = () => {
    setShowOverlay(false)
  }

  const handleContentChange = (value) => {
    setcontent(value);
    onChange(value); // Call the parent component's onChange with the updated value
  };

  // Add this line to determine the main background color
  const mainBackgroundColor = showOverlay ? 'black' : 'white';

  // Determine whether to apply the white-bg class based on the main background color
  const quillClasses = mainBackgroundColor === 'black' ? 'white-bg' : '';

  return (
    <div style={{ backgroundColor: mainBackgroundColor }}>
          {loader 
      ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center">
            <Loader />
          </div>
        </div>
      ) 
      : (
        <div>
      <ReactQuill
        value={content}
        onChange={handleContentChange}
        modules={RichTextArea.modules}
        formats={RichTextArea.formats}
        placeholder="Write something..."
        className={quillClasses}
      />
      <button
        onClick={handleSaveClick}
        className="accentbg rounded-full text-white px-4 py-2 rounded m-2"
      >
        Save
      </button>

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ease-in-out rounded">
          <div className="bg-white p-4 rounded shadow-md">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold mb-2">Create a Post</h2>
              <button onClick={closeOverlay}>x</button>
            </div>


            <div className="mb-3">
              <label htmlFor="title" className="block font-semibold">
                Title:
              </label>
              <input
                type="text"
                id="title"
                className="w-full border rounded p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block font-semibold">
                Subject:
              </label>
              <select
                id="subject"
                className="w-full border rounded p-2"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select a subject</option>
                {subjectOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="shared" className="block font-semibold">
                Shared:
              </label>
              <input
                type="checkbox"
                id="shared"
                className="w-4 h-4 mt-2"
                checked={shared}
                onChange={(e) => setIsShared(e.target.checked)}
              />
            </div>
            
            <button
              className="accentbg text-white px-4 py-2 rounded"
              onClick={handlePostClick}
            >
              {poster}
            </button>
          </div>
        </div>
        )}</div>
      )}
    </div>
  );
  }

// Add modules and formats as needed for ReactQuill
RichTextArea.modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    // Add modules here if required
};

RichTextArea.formats = [
    // Add formats here if required
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'color',
    'background',
    'font',
    'align',
    'link',
    'image',
    'video',
];

export default RichTextArea;
