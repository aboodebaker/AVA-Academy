'use client'
import { useState } from 'react';
import ClassCard from './page.jsx';
import './style.css'
import Link from 'next/link';
import { useEffect } from 'react';
import { uploadToS3 } from '@/lib/s3'

const FileCarasoul = ({ files, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState('')
  const filteredfiles = files.filter((files) =>
    files.pdfName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const uploadToCloudinary = async (pdfContent) => {
    const blob = new Blob[pdfContent]
   const data = uploadToS3(blob)
   console.log(data)
   try {
    await fetch('/api/edit-pdf', {
      method: 'POST',
      body: JSON.stringify({file_key: data.file_key, oldUrl: selectedFile})
    })
   } catch (error) {
    console.log(error)
   }
  return data
};

// Callback for SAVE_API
const handleSave = async (metaData, content, options) => {
  try {
    // Upload modified PDF content to Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(content);

    if (cloudinaryResponse && cloudinaryResponse.file_key) {
      return Promise.resolve({
        code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
        data: {
          metaData: {
            fileName: metaData.fileName,
            cloudinaryUrl: getS3Url(file_key)
          }
        }
      });
    } else {
      return Promise.reject({
        code: AdobeDC.View.Enum.ApiResponseCode.FAIL,
        data: { /* optional error data */ }
      });
    }
  } catch (error) {
    return Promise.reject({
      code: AdobeDC.View.Enum.ApiResponseCode.FAIL,
      data: { /* optional error data */ }
    });
  }
};

  useEffect(() => {
    if (!selectedFile == '') {
    const embedOptions = {
      clientId: '1c9773d18f39418aab4d3510b525c51c',
    };

    const adobeDCView = new window.AdobeDC.View(embedOptions);
    adobeDCView.registerCallback(
      AdobeDC.View.Enum.CallbackType.SAVE_API,
      handleSave,
      {
        autoSaveFrequency: 0,
        enableFocusPolling: false,
        showSaveButton: true
      }
    );
    adobeDCView.previewFile(
      {
        content: { location: { url: selectedFile } },
        metaData: { fileName: 'PDF Document' }, // You can customize the file name here
      },{embedMode: 'FULL_WINDOW', exitPDFViewerType: "CLOSE"}
      
    );}
  }, [selectedFile]);

  const handleFileChange = (FileSelected) => {
    setSelectedFile(FileSelected);
  };

  return (
    
    <div className='contain'>
      <div className='inputsbox'>
      <div className='inputbox'>
      <input
        type="text"
        placeholder="Find Files"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        
        className='input'
      />
      <div className='inputiconbox'>
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <g clip-path="url(#clip0_1_15)">
      <path d="M15.75 3C18.144 2.99984 20.4896 3.67366 22.5185 4.94435C24.5473 6.21503 26.1775 8.03125 27.2224 10.1851C28.2672 12.339 28.6846 14.7436 28.4267 17.1236C28.1688 19.5036 27.246 21.7629 25.764 23.643L31.242 29.121C31.5152 29.4039 31.6664 29.7828 31.663 30.1761C31.6596 30.5694 31.5019 30.9456 31.2237 31.2237C30.9456 31.5018 30.5694 31.6596 30.1761 31.663C29.7828 31.6664 29.4039 31.5152 29.121 31.242L23.643 25.764C22.0462 27.0224 20.1716 27.8808 18.1755 28.2674C16.1795 28.654 14.12 28.5576 12.1688 27.9864C10.2176 27.4152 8.43126 26.3856 6.95887 24.9836C5.48648 23.5816 4.37072 21.8478 3.70468 19.9269C3.03864 18.006 2.84162 15.9536 3.13008 13.9411C3.41853 11.9285 4.18408 10.0141 5.36287 8.35763C6.54165 6.70113 8.09949 5.35054 9.9064 4.41854C11.7133 3.48655 13.7169 3.00017 15.75 3ZM15.75 6C13.1642 6 10.6842 7.02723 8.85572 8.85571C7.02724 10.6842 6.00001 13.1641 6.00001 15.75C6.00001 18.3359 7.02724 20.8158 8.85572 22.6443C10.6842 24.4728 13.1642 25.5 15.75 25.5C18.3359 25.5 20.8158 24.4728 22.6443 22.6443C24.4728 20.8158 25.5 18.3359 25.5 15.75C25.5 13.1641 24.4728 10.6842 22.6443 8.85571C20.8158 7.02723 18.3359 6 15.75 6ZM15.75 7.5C17.9381 7.5 20.0365 8.36919 21.5836 9.91637C23.1308 11.4635 24 13.562 24 15.75C24 17.938 23.1308 20.0365 21.5836 21.5836C20.0365 23.1308 17.9381 24 15.75 24C13.562 24 11.4636 23.1308 9.91638 21.5836C8.36921 20.0365 7.50001 17.938 7.50001 15.75C7.50001 13.562 8.36921 11.4635 9.91638 9.91637C11.4636 8.36919 13.562 7.5 15.75 7.5Z" fill="white"/>
      </g>
      <defs>
      <clipPath id="clip0_1_15">
      <rect width="36" height="36" fill="white"/>
      </clipPath>
      </defs>
      </svg>
      </div>
      </div>
      </div>
      <div className="scrolling-wrapper">
        {filteredfiles.map((file, index) => (
          <div key={index} className="card">
            
              <ClassCard title={file.pdfName} link={file.pdfUrl}  date={file.createdAt} height={file.id} clip={'title-clip'} divId={file.pdfName + index} selectedFile={handleFileChange} activities={file.activities} userId={user.id}/>
                  
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileCarasoul;
