// @ts-nocheck
import React from "react";
import { PrismaClient } from "@prisma/client";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import Tables from "@/components/table/Table";
import SignOutButton from "@/components/signOutButton";
import {TodoWrapperLocalStorage} from '@/components/ToDo/TodoWrapperLocalStorage'

import UserAccountNav from "@/components/UserAccountNav";

type Props = {};

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();
  const user = session?.user as { id?: string };
  const userId = user?.id;

  if (session) {
    const prisma = new PrismaClient();
    
    const user = await prisma.user.findUnique({
      where: { id: userId  },
    });


    return (
    <div className="w-full ">
      <div className="">
        <div className="flex justify-end">
        <UserAccountNav user={user}/>
        </div>
        <div className='headertables'>
          <h1 className='headers'>Homework</h1>
        </div>
        
        </div>
      
      <TodoWrapperLocalStorage />
      </div>
      

  );
  } else {
    redirect("/login");
    return null; // Add a return statement here or handle redirect appropriately
  }
};

export default Dashboard;
