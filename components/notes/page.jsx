import React from 'react'
import { getServerSession } from "next-auth";
import {authOptions} from '@/app/api/auth/[...nextauth]/route'

const Note = async () => {
    const session = await getServerSession(authOptions)
    console.log(session)
  return (
    null
  )
}

export default Note