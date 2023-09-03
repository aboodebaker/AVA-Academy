"use client"
import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './page.css'
// import Note from '@/components/notes/page'
const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 4,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
  // Custom styles for the slider
  className: "slider-container",  // Apply custom styles to the slider container
  arrow: true,
};


const queryClient = new QueryClient();

// Function to fetch user's email
const fetchUserEmail = async () => {
  const session = await getSession();
  return session?.user?.email || null;
};


const fetchData = async (email, datas) => {
  const response = await fetch("/api/classes/subjects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emails: email, subject: datas }),
  });
  return response.json();
};

const fetchNotes = async (email) => {
  const notesresponse = await fetch("/api/notes/fetch", {
    method: "POST",
    body: JSON.stringify({ email: email }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return notesresponse.json();
};



const Page = ({ params }) => {
  const data = decodeURIComponent(params.name.replace(/%20/g, ' '));
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(""); // State to store selected file URL
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const openFileViewer = (file) => {
    setSelectedFile(file);
    setShowPdfViewer(true);
  };
  const { data: email, isLoading: isLoadingEmail } = useQuery("userEmail", fetchUserEmail, {
    staleTime: 0,
  });

  const { data: responses, isLoading: isLoadingResponses, isFetching: isFetchingResponses } = useQuery(
    ["responses", email, data], // Updated query key
    () => fetchData(email, data),
    {
      enabled: !!email,
      staleTime: 0,
      initialData: [],
    }
  );

  const { data: notes, isLoading: isLoadingNotes, isFetching: isFetchingNotes } = useQuery(
    ["notes", email], // Updated query key
    () => fetchNotes(email),
    {
      enabled: !!email,
      staleTime: 0,
      initialData: [],
    }
  );
  const uploadToCloudinary = async (pdfContent) => {
  const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/deqghuapu/auto/upload'; // Replace with your Cloudinary URL
 
  const formData = new FormData();
  formData.append('file', new Blob([pdfContent]), 'modified.pdf');
  formData.append('upload_preset', 'klcjk4io'); // Replace with your Cloudinary upload preset

  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
   
    body: formData
  });

  const dataers = await response.json()

  const respons = await fetch('/api/user-file', {
    method: 'POST',
    body: JSON.stringify({email: email, oldfile: selectedFile, file: dataers.secure_url})
  })



  return dataers;
};

// Callback for SAVE_API
const handleSave = async (metaData, content, options) => {
  try {
    // Upload modified PDF content to Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(content);

    if (cloudinaryResponse && cloudinaryResponse.secure_url) {
      return Promise.resolve({
        code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
        data: {
          metaData: {
            fileName: metaData.fileName,
            cloudinaryUrl: cloudinaryResponse.secure_url
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
      clientId: '5d878b022a9742a0bf3e4ad58f18435b',
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
      },
      
    );}
  }, [selectedFile]);


  const [isNotesCollapsed, setIsNotesCollapsed] = React.useState(true);

  const filteredNotes = notes?.filter((note) => note.subject === data) || [];

  const toggleNotesSection = () => {
    setIsNotesCollapsed((prevValue) => !prevValue);
  };

  if (isLoadingEmail) {
    return null;
  }

  if (!email) {
    router?.push("/register");
    return null;
  }

  const resp = responses?.map((item) => item.name) || [];
  const files = responses?.map((item) => item.file) || [];
  const text = responses?.map((item) => item.text) || [];
  return (
    <div>

      <div className="header">
        <h1 className="">{data}</h1>
      </div>

      <div className="filename">
        <hr style={{backgroundColor: 'var(--text)', height: '2px', width: '90%',}} />
        <h3 className="fileheader">Files</h3>
        <hr style={{backgroundColor: 'var(--text)', height: '2px', width: '90%',}} />
      </div>



      <Slider {...settings}>
        {resp.map((name, index) => (
          <div key={index} className={`slider-item ${selectedFile === files[index] ? 'selected' : ''}`}>
            <div className="filesdiv">
              <p className="text-blue-500 cursor-pointer" onClick={() => openFileViewer(files[index])}>
                {name}
              </p>
            </div>
            <Link href={`/mock-test/${text[index]}`}>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mr-2">
                Generate Mock Test
              </button>
            </Link>
          </div>
        ))}
      </Slider>
      {/* <Note /> */}

    <div className="mt-5 ">
        <div
          className="flex justify-between items-center cursor-pointer p-3 notesdiv rounded"
          onClick={toggleNotesSection}
        >
          <h2 className="text-xl ">All Notes</h2>
          {isNotesCollapsed ? "+" : "-"}
        </div>
        {!isNotesCollapsed && (
          <div className="space-y-4 p-4">
            {filteredNotes.map((note) => (
              <div key={note.id} className="insidenotediv">
                <Link href={`/notes?id=${note.id}`} as={`/notes/${note.id}`}>
                  <p className=" cursor-pointer font-bold">
                    {note.title}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
};

const PageWithReactQuery = ({ params }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Page params={params} />
    </QueryClientProvider>
  );
};

export default PageWithReactQuery;
