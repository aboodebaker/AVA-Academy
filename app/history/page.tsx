// @ts-nocheck
import HistoryComponent from "@/components/HistoryComponent";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";

type Props = {};

const History = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div>
    <div className='headertable'>
          <h1 className='header'>History</h1>
        </div>
        
        <div className='flex justify-center align-center md:w-[800] sm:w-[700]'>
      <div className='flex flex-col justify-center align-center '>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Link className={buttonVariants() + 'text-text'} href="/">
              <LucideLayoutDashboard className="mr-2 text-text" />
              <p className="text-text">Back to Classes</p>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-scroll">
          <HistoryComponent limit={100} userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
    </div>
    </div>
  );
};

export default History;
