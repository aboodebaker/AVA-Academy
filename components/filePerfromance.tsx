'use client'
import React, {useState, useEffect} from 'react'
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import axios from 'axios';

type Props = {
    fileId: string
}

const FilePerformance = ({fileId}: Props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('')
  
  useEffect(() => {
    const func = async () => {
        const response = await axios.post('/api/file-performance', {fileId})
        setData(response.data.performance)
    }
    func()
  },[fileId])

  return (
    <div>
        {
        loading 
        ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        : <p>{data}</p>
        }
    </div>
  )
}

export default FilePerformance