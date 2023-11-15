import { pusherClient } from '@/lib/pusher';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

interface Props {
  summary: string;
  id: string;
}

const Summary: React.FC<Props> = ({ summary, id }: Props) => {
  const [input, setInput] = useState(summary);

  useEffect(() => {
    pusherClient.subscribe(id);

    pusherClient.bind('incoming-message', (text: string) => {
      setInput(text);
    });

    return () => {
      pusherClient.unsubscribe(id);
    };
  }, []); // Empty dependency array ensures the effect runs once

  return (
    <div className="contain" style={{ maxHeight: '100%', overflow: 'hidden' }}>
      <p dangerouslySetInnerHTML={{ __html: input.replace(/\n/g, '<br />') }} />
    </div>
  );
};

export default Summary;
