import React from 'react'
import FilePerformance from '@/components/filePerfromance';

type Props = {
    params: any
}

const page = ({params}: Props) => {
    
  const data = decodeURIComponent(params.id);

  return (
    <FilePerformance fileId={data}/>
  )
}

export default page