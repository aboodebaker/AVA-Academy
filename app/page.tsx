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
    // const prisma = new PrismaClient();
    // const games = await prisma.activity.findMany({
    //   where: { userId: session.user.id },
    //   include: { questions: true },
    // });

    // console.log(games)

    // const user = await prisma.user.findUnique({
    //   where: { id: userId  },
    // });


    // return (
    // <div className="w-full h-full">
    //   <div>
    //     <SignOutButton/>
    //     <UserAccountNav user={user}/>
    //   </div>
    //   <TodoWrapperLocalStorage />
    //   </div>
    redirect('/classes')

  } else {
    redirect("/login");
    return null; // Add a return statement here or handle redirect appropriately
  }
};

export default Dashboard;
