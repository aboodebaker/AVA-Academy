import React from 'react'

interface Props {
  params: {
    topic?: string;
    id:string;
  };
}


const page = ({ params }: Props) => {
    const data = decodeURIComponent(params.id);


  return (
    <div>page</div>
  )
}

export default page