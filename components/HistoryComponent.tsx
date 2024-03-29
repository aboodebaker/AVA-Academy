import { prisma } from "@/lib/db";
import { Clock, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import MCQCounter from "./MCQCounter";

type Props = {
  limit: number;
  userId: string;
};

const HistoryComponent = async ({ limit, userId }: Props) => {
  const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId,
    },
    orderBy: {
      timeStarted: "desc",
    },
    include: {
      File: {
        include: {
          Subject: true,
        }
      },
    }
  });

  
  return (
    <div className="space-y-8 text-text">
      {games.map((game) => {
        return (
          <div className="flex items-center justify-between" key={game.id}>
            <div className="flex items-center text-text">
              {game.gameType === "mcq" ? (
                <CopyCheck className="mr-3 text-text" />
              ) : (
                <Edit2 className="mr-3 text-text" />
              )}
              <div className="ml-4 space-y-1 text-text">
                <Link
                  className="text-base font-medium leading-none underline text-text"
                  href={`/statistics/${game.id}`}
                >
                  {game.topic}
                </Link>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(game.timeEnded ?? 0).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground text-text">
                  {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                </p>
                <p className="text-sm text-muted-foreground text-text">
                  {game.File?.pdfName}
                </p>
                <p className="text-sm text-muted-foreground text-text">
                  {game.File?.Subject.name}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryComponent;
