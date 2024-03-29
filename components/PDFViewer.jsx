'use client'
import { useEffect } from "react";
import './sc-wrapper.css'

const PDFViewer = async ({ pdf_Url, }, {children} ) => {
  useEffect(() => {
    const loadAdobeDCViewSDK = () => {
      
        // Initialize Adobe DC View when the SDK is ready
        
          const adobeDCView = new AdobeDC.View({ clientId: '1c9773d18f39418aab4d3510b525c51c', divId: 'adobe-dc-view' });
          adobeDCView.previewFile({
            content: { location: { url: pdf_Url } },
            metaData: { fileName: 'Bodea Brochure.pdf' }
          }, { embedMode: 'IN_LINE', exitPDFViewerType: "CLOSE" });
        }

      

    loadAdobeDCViewSDK();
  }, []);

  return (
    <div id="adobe-dc-view">{children}</div>
  );
};


export default PDFViewer;
//`https://docs.google.com/gview?url=${file_key}&embedded=true`