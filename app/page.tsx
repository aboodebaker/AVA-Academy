// @ts-nocheck
import React from "react";
import { PrismaClient } from "@prisma/client";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import Tables from "@/components/table/Table";
import SignOutButton from "@/components/signOutButton";
import {TodoWrapper} from '@/components/ToDo/TodoWrapper'

import UserAccountNav from "@/components/UserAccountNav";

type Props = {};

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();
    const user = session?.user as { id?: string };
  const userId = user?.id;

  if (session) {
    const prisma = new PrismaClient();
    const games = await prisma.activity.findMany({
      where: { userId: session.user.id },
      include: { questions: true },
    });

    console.log(games)

    const user = await prisma.user.findUnique({
      where: { id: userId  },
    });


    return (
    <div className="grid grid-rows-3 grid-cols-6 gap-4 w-full h-full">
      <div>
        <SignOutButton/>
        <UserAccountNav user={user}/>
      </div>
      <div className="row-span-1 col-span-2 box-grid-shadow">02</div>
      <div className="row-span-1 col-span-2 box-grid-shadow"><TodoWrapper /></div>
      <div className="row-span-2 col-span-4 m-2">
        <Tables data={games} />
      </div>

    </div>
  );
  } else {
    redirect("/login");
    return null; // Add a return statement here or handle redirect appropriately
  }
};

export default Dashboard;
