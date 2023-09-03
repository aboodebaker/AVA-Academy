'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import to load RichTextArea only on the client-side
const DynamicRichTextArea = dynamic(() => import('@/components/richTextArea/RichTextArea'), {
  ssr: false,
});

const IndexPage = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (value) => {
    setContent(value);
  };

  return (
    <div>
      <DynamicRichTextArea value={content} onChange={handleContentChange} />
      <div>
        {/* Additional content or components can be added here */}
      </div>
    </div>
  );
};

export default IndexPage;
