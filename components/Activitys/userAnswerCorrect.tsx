import React from 'react'
import { pusherClient } from '@/lib/pusher';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
    id: string
}

const userAnswerCorrect = ({id}: Props) => {
    const [input, setInput] = useState();

  useEffect(() => {
    pusherClient.subscribe(id);

    pusherClient.bind('incoming-message', (stats: any) => {
      setInput(stats);
    });

    return () => {
      pusherClient.unsubscribe(id);
    };
  }, []); 
  return (
    <div>userAnswerCorrect</div>
  )
}

export default userAnswerCorrect