'use client'
import FileUpload from '@/components/FileUpload'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { getS3Url } from '@/lib/s3'

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


const Page = () => {
  const [fileKey, setFileKey] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submitting status
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('')
  const [name, setname] = useState('')


   const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
       // Set isSubmitting to true when the form is being submitted
      const config = {
        headers: {
          "x-api-key": "sec_6ZyhabQToOvz2tf7DDqjbpNeuDNeZifR",
          "Content-Type": "application/json",
        },
      };

      const data = {
        url: getS3Url(fileKey),
      };

      axios
        .post("https://api.chatpdf.com/v1/sources/add-url", data, config)
        .then(async (response:any) => {
          console.log("Source ID:", response.data.sourceId);
          await fetch('/api/create-chat', {
          method: 'POST',
          body: JSON.stringify({file_key: fileKey, file_name: name, grade: grade, subject:subject, chatpdf: response.data.sourceId}),
          headers: {
            'Content-Type': 'application/json',
        },
      });

      setSubmitSuccess(true); // Set submitSuccess to true on successful submission
      setSubmitError(''); // Reset any previous error messages
        })
        .catch((error:any) => {
          console.log("Error:", error.message);
          console.log("Response:", error.response.data);
          console.error(error);
          setSubmitSuccess(false); // Set submitSuccess to false on failed submission
          setSubmitError('Submission failed. Please try again.');
        });

    } catch (error) {
      console.error(error);
      setSubmitSuccess(false); // Set submitSuccess to false on failed submission
      setSubmitError('Submission failed. Please try again.'); // Set the error message
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false after the submission process
    }
  };




   const handleOptionChange = (event:any) => {
    setGrade(event.target.value);
  };

  const handleOptionChangesubject = (event:any) => {
    setSubject(event.target.value); 
  };

  const handleOptionChangename = (event:any) => {
    setname(event.target.value);
  };

  const handleFileKeyChange = (newFileKey: string) => {
    setFileKey(newFileKey);
  };



  return (
    <div>
      <div>
        <FileUpload onFileKeyChange={handleFileKeyChange}/>
      </div>
      <div className="formdiv">
        <form action="">
                <div className='input-container'>
        <label htmlFor="nameInput" className='block mb-2 font-bold'>
          Name of the file:
        </label>
        <input
          type="text"
          name="name"
          id="nameInput"
          value={name}
          onChange={handleOptionChangename}
          className="border border-gray-300 py-2 px-4 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="subjectSelect" className="block mb-2 font-bold">
          Select Subject:
        </label>
        <select
          id="subjectSelect"
          value={subject}
          onChange={handleOptionChangesubject}
          className="border border-gray-300 py-2 px-4 rounded-lg"
        >
          <option value="">-- Select Subject --</option>
          {subjectOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="gradeSelect" className="block mb-2 font-bold">
          Select Grade:
        </label>
        <select
          id="gradeSelect"
          value={grade}
          onChange={handleOptionChange}
          className="border border-gray-300 py-2 px-4 rounded-lg"
        >
          <option value="">-- Select Grade --</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>

        </select>
      </div>

      

      {submitSuccess && <p className="text-green-600 font-bold mb-2">Submission Successful!</p>}
      {submitError && <p className="text-red-600 font-bold mb-2">error uploading, please try again</p>}

      <button
        type="submit"
        name="submit"
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isSubmitting}
        onClick={handleSubmit}
        >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      

        </form>
      </div>
      
    </div>
  )
}

export default Page