"use client";
import { cn, formatTimeDelta } from "@/lib/utils";
import { Game, Question } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import OpenEndedPercentage from "./OpenEndedPercentage";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { checkAnswerSchema, endGameSchema } from "@/schemas/questions";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { Input } from "./ui/input";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
  const [hasEnded, setHasEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [averagePercentage, setAveragePercentage] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);
  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/activities/endGame`, payload);
      return response.data;
    },
  });
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());
  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: userAnswer, // User's entire answer
      };
      const response = await axios.post(`/api/activities/checkAnswer`, payload);
      return response.data;
    },
  });

  // Retrieve the last saved question index from localStorage on component mount
      useEffect(() => {
    const savedData = localStorage.getItem(`gameData_${game.id}`);
    if (savedData !== null) {
      const { savedIndex, savedPercentage, hasEnded } = JSON.parse(savedData);
      setQuestionIndex(parseInt(savedIndex, 10));
      setAveragePercentage(parseFloat(savedPercentage));
      setHasEnded(hasEnded)
    }
  }, [game.id]);

  // Save the current question index to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      savedIndex: questionIndex.toString(),
      savedPercentage: averagePercentage.toString(),
      hasEnded: hasEnded
    };
    localStorage.setItem(`gameData_${game.id}`, JSON.stringify(dataToSave));
  }, [questionIndex, averagePercentage, game.id])

  useEffect(() => {
    if (!hasEnded) {
      const interval = setInterval(() => {
        setNow(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasEnded]);

    const handleRedo = () => {
    // Clear the stored question index in localStorage and reset the component state
    localStorage.removeItem(`gameData_${game.id}`);
    setQuestionIndex(0);
    setAveragePercentage(0);
    setHasEnded(false);
    setUserAnswer("");
  };

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer`,
        });
        setAveragePercentage((prev) => {
          return (prev + percentageSimilar) / (questionIndex + 1);
        });
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          const dataToSave = {
            savedIndex: questionIndex.toString(),
            savedPercentage: averagePercentage.toString(),
            hasEnded: true
            };
            localStorage.setItem(`gameData_${game.id}`, JSON.stringify(dataToSave));

          return;
        }
        setQuestionIndex((prev) => prev + 1);
        setUserAnswer(""); // Clear user's answer for the next question
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Something went wrong",
          variant: "destructive",
        });
      },
    });
  }, [checkAnswer, questionIndex, toast, endGame, game.questions.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Enter") {
        handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return (
      <div className="flex flex-col justify-center">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-2")}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
                    <Button
            variant="outline"
            className="m-4"
            onClick={handleRedo}
            >
            Redo
            </Button>

        <iframe src={`/statistics/activity/${game.id}`} frameBorder="0" className="w-full h-full" ></iframe>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-1/2">
          <p>
            <span className="text-slate-400">Topic</span> &nbsp;
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <OpenEndedPercentage percentage={averagePercentage} />
      </div>
      <Card className=" mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <Input
          placeholder="Enter your answer here"
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-full max-w-2xl rounded"
        />

        <div className="flex justify-center align-center">
            <Button
            variant="outline"
            className="m-4"
            disabled={isChecking || hasEnded}
            onClick={handleNext}
            >
            {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
            variant="outline"
            className="m-4"
            onClick={handleRedo}
            >
            Redo
            </Button>

        </div>
      </div>
    </div>
  );
};

export default OpenEnded;
