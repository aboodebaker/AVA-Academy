"use client"
import React, { useEffect, useState } from "react";
import {useSession} from 'next-auth'

const AdobeEmbedViewer = () => {
  const [selectedFile, setSelectedFile] = useState(""); // State to store selected file URL
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const openFileViewer = (file) => {
    setSelectedFile(file);
    setShowPdfViewer(true);
  };
  const session = useSession()
  useEffect(() => {
    const embedOptions = {
      clientId: '5d878b022a9742a0bf3e4ad58f18435b',
    };

    const adobeDCView = new window.AdobeDC.View(embedOptions);
    
    // Define the uploadToCloudinary function within the AdobeDC.View callback
    const uploadToCloudinary = async (pdfContent) => {
      try {
        const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/deqghuapu/auto/upload';
        
        const formData = new FormData();
        formData.append('file', new Blob([pdfContent]), 'modified.pdf');
        formData.append('upload_preset', 'klcjk4io');

        const response = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData,
        });

        const dataers = await response.json();

        // After uploading to Cloudinary, also update the user's file in your API
        const respons = await fetch('/api/user-file', {
          method: 'POST',
          body: JSON.stringify({ email, oldfile: selectedFile, file: dataers.secure_url }),
        });

        return dataers;
      } catch (error) {
        // Handle errors here
        console.error('Error uploading to Cloudinary:', error);
        throw error;
      }
    };

    adobeDCView.registerCallback(
      AdobeDC.View.Enum.CallbackType.SAVE_API,
      async (metaData, content, options) => {
        try {
          // Upload modified PDF content to Cloudinary
          const cloudinaryResponse = await uploadToCloudinary(content);

          if (cloudinaryResponse && cloudinaryResponse.secure_url) {
            return Promise.resolve({
              code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
              data: {
                metaData: {
                  fileName: metaData.fileName,
                  cloudinaryUrl: cloudinaryResponse.secure_url,
                },
              },
            });
          } else {
            return Promise.reject({
              code: AdobeDC.View.Enum.ApiResponseCode.FAIL,
              data: { /* optional error data */ },
            });
          }
        } catch (error) {
          console.error('Error handling SAVE_API callback:', error);
          return Promise.reject({
            code: AdobeDC.View.Enum.ApiResponseCode.FAIL,
            data: { /* optional error data */ },
          });
        }
      },
      {
        autoSaveFrequency: 0,
        enableFocusPolling: false,
        showSaveButton: true,
      }
    );

    adobeDCView.previewFile({
      content: { location: { url: selectedFile } },
      metaData: { fileName: 'PDF Document' },
    });

    return () => {
      // Clean up any resources when the component unmounts
      adobeDCView.unregisterCallback(AdobeDC.View.Enum.CallbackType.SAVE_API);
      adobeDCView.destroy();
    };
  }, [selectedFile, email]);

  return (
    <div>
      {/* Add a close button */}
      <button onClick={onClose}>Close PDF Viewer</button>
    </div>
  );
};

export default AdobeEmbedViewer;
