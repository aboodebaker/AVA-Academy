'use client'
import React from 'react'
import { getProviders, signOut, useSession } from "next-auth/react";

type Props = {}

const SignOutButton = (props: Props) => {
  return (
    <button onClick={() => {signOut()}}>Logout</button>
  )
}

export default SignOutButton