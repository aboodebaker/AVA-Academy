// @ts-nocheck
'use client'
import React, {useState, useEffect} from 'react'
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import axios from 'axios';
import TabsDemo from '@/components/tabs'
type Props = {
    fileId: string
}

const FilePerformance = ({fileId}: Props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('')
  const [id, setId] = useState(null)
  
  useEffect(() => {
    const func = async () => {
        const response = await axios.post('/api/file-performance', {fileId})
        setData(response.data.performance)
        setId(response.data.gameId)
        setLoading(false)
    }
    func()
  },[fileId])

  return (
    <div className='min-h-screen flex items-center justify-center'>
        {
        loading 
        ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-text" />
        : <TabsDemo data={data} id={id} />
        }
    </div>
  )
}

export default FilePerformance