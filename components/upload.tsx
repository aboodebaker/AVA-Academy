'use client'
import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from '@/components/FileUpload';
import { getS3Url } from '@/lib/s3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  subjects: any;
};

const Page = ({ subjects }: Props) => {
  const [fileKey, setFileKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [Submit, setSubmit] = useState('submit');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [name, setname] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmit('Submitting...');

    try {
      const config = {
        headers: {
          "x-api-key": "sec_6ZyhabQToOvz2tf7DDqjbpNeuDNeZifR",
          "Content-Type": "application/json",
        },
      };

      const data = {
        url: getS3Url(fileKey),
      };

      const response = await axios.post("https://api.chatpdf.com/v1/sources/add-url", data, config);
      console.log("Source ID:", response.data.sourceId);

      await fetch('/api/create-chat', {
        method: 'POST',
        body: JSON.stringify({ file_key: fileKey, file_name: name, grade: grade, subject: subject, chatpdf: response.data.sourceId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubmitSuccess(true);
      setSubmit("Submitted");
      setSubmitError('');
    } catch (error: any) {
      console.error("Error:", error.message);
      setSubmitSuccess(false);
      setSubmitError('Submission failed. Please try again.');
      setSubmit("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (event: any) => {
    setGrade(event.target.value);
    setSubject(''); // Reset subject when grade changes
  };

  const handleOptionChangesubject = (event: any) => {
    setSubject(event.target.value);
  };

  const handleOptionChangename = (event: any) => {
    setname(event.target.value);
  };

  const handleFileKeyChange = (newFileKey: string) => {
    setFileKey(newFileKey);
  };

  const filteredSubjects = subjects.filter((subj: any) => subj.grade === grade);

  return (
    <div className='col m-2 '>
      <div className='flex justify-center align-center w-[800]'>
        <Card className='flex flex-col align-center justify-center'>
          <CardHeader >
            <CardTitle className="text-2xl font-bold">Upload</CardTitle>
            <CardDescription className='text-text'>Upload a file to a specific grade and class</CardDescription>
          </CardHeader>
          <CardContent className='flex-col justify-center align-center '>
            <div >
              <FileUpload onFileKeyChange={handleFileKeyChange} />
            </div>
            <div className="formdiv">
              <form action="">
                <div className='input-container'>
                  <label htmlFor="nameInput" className='block mb-2 font-bold text-text'>
                    Name of the file:
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="nameInput"
                    value={name}
                    onChange={handleOptionChangename}
                    className="border border-gray-300 py-2 px-4 rounded-lg text-text bg-secondary"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="gradeSelect" className="block mb-2 font-bold text-text">
                    Select Grade:
                  </label>
                  <select
                    id="gradeSelect"
                    value={grade}
                    onChange={handleOptionChange}
                    className="border border-gray-300 py-2 px-4 rounded-lg text-text bg-secondary"
                  >
                    <option value="">-- Select Grade --</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="subjectSelect" className="block mb-2 font-bold text-text">
                    Select Subject:
                  </label>
                  <select
                    id="subjectSelect"
                    value={subject}
                    onChange={handleOptionChangesubject}
                    className="border border-gray-300 py-2 px-4 rounded-lg text-text bg-secondary"
                  >
                    <option value="">-- Select Subject --</option>
                    {filteredSubjects.map((subj: any) => (
                      <option key={subj.uniqueId} value={subj.uniqueId} className="text-black">
                        {subj.name}
                      </option>
                    ))}
                  </select>
                </div>

                {submitSuccess && <p className="text-green-600 font-bold mb-2">Submission Successful!</p>}
                {submitError && <p className="text-red-600 font-bold mb-2">{submitError}</p>}

                <button
                  type="submit"
                  name="submit"
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {Submit}
                </button>

              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
