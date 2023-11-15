// @ts-nocheck
'use client'
import React from 'react'
import { useEffect } from 'react'
import { uploadToS3, getS3Url } from '@/lib/s3'
interface Props {
  file:any
}


 


const Adobe = ({ file }: Props) => {


     const uploadToCloudinary = async (pdfContent:Blob) => {
    const blob = new Blob[pdfContent]
   const data = uploadToS3(blob)
   console.log(data)
   try {
    await fetch('/api/edit-pdf', {
      method: 'POST',
      body: JSON.stringify({file_key: file.file_key, oldUrl: file.pdfUrl})
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
        content: { location: { url: file.pdfUrl } },
        metaData: { fileName: file.pdfName }, // You can customize the file name here
      },{embedMode: 'FULL_WINDOW', exitPDFViewerType: "CLOSE"}
      
    );},[]);
  return (
    <div id='adobe-dc-view'></div>
  )
}

export default Adobe