// @ts-nocheck
import React from "react";
import { PrismaClient } from "@prisma/client";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import Tables from "@/components/table/Table";

type Props = {};

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();

  if (session) {
    const prisma = new PrismaClient();
    const games = await prisma.game.findMany({
      where: { userId: session.user.id },
      include: { questions: true },
    });



    return (
    <div className="grid grid-rows-2 grid-cols-6 gap-4 w-full h-full">
      <div className="row-span-1 col-span-2">02</div>
      <div className="row-span-1 col-span-2">02</div>
      <div className="row-span-1 col-span-4 m-2">
        <Tables data={games} />
      </div>
      <div className="auto-rows-max auto-cols-max" style={{ position: 'relative' }}>
        <iframe src="/classes" frameBorder="0" className="w-full h-full" style={{ position: 'absolute', top: 0 }}></iframe>
      </div>
    </div>
  );
  } else {
    redirect("/login");
    return null; // Add a return statement here or handle redirect appropriately
  }
};

export default Dashboard;
