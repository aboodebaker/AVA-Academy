'use client'
import { useEffect } from "react";


const PDFViewer = async ({ pdf_Url }) => {
  useEffect(() => {
    const loadAdobeDCViewSDK = () => {
      
        // Initialize Adobe DC View when the SDK is ready
        
          const adobeDCView = new AdobeDC.View({ clientId: '5d878b022a9742a0bf3e4ad58f18435b', divId: 'adobe-dc-view' });
          adobeDCView.previewFile({
            content: { location: { url: pdf_Url } },
            metaData: { fileName: 'Bodea Brochure.pdf' }
          }, { embedMode: 'IN_LINE', exitPDFViewerType: "CLOSE" });
        }

      

    loadAdobeDCViewSDK();
  }, []);

  return (
    <div id="adobe-dc-view" className="w-100 h-100"></div>
  );
};


export default PDFViewer;
//`https://docs.google.com/gview?url=${file_key}&embedded=true`