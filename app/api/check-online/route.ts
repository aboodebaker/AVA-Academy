// @ts-nocheck
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request, res: Response) {
  const {channel} = await req.json();

   try {
    const presence = await pusherServer.get(
      `/channels/activity-${channel}/users`
    ); // Replace 'presence-your_channel_name' with your presence channel name

    const onlineUsers = presence.users;
    return NextResponse.json(
      onlineUsers,
      {status: 200}
    );
   }catch(error) {
    console.log(error)
   }

  return NextResponse.json(
      auth,
      {
          status: 200,
    }
    );
};