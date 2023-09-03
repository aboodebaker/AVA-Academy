import React from 'react'
import connect from '@/utils/db'
import User from '@/models/User'


const Activity = async (emails) => {
  await connect();
    const user = await User.findOne({email: emails})
    const summary = await user.summary
    return (
    <p>{summary}</p>
  )
}

export default Activity