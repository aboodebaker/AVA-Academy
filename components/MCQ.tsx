// @ts-nocheck
"use client";
import { Game, Question } from "@prisma/client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import { differenceInSeconds } from "date-fns";
import Link from "next/link";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { checkAnswerSchema, endGameSchema } from "@/schemas/questions";
import { cn, formatTimeDelta } from "@/lib/utils";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { useToast } from "./ui/use-toast";
import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { getSession } from "next-auth/react";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
  userId: string
};

const MCQ =  ({ game, userId}: Props) => {
  
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [hasEnded, setHasEnded] = React.useState(false);
  const [stats, setStats] = React.useState({
    correct_answers: 0,
    wrong_answers: 0,
  });
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [now, setNow] = React.useState(new Date());
  const id = game.uniqueId
  const [questions, setQuestions] = useState(game.questions)  
  const [currentQuestion, setCurrentQuestion] = useState(questions[questionIndex]);
  const [loadingEnded, setLoadingEnded] = useState(false)

  useEffect(() => {
    setCurrentQuestion(questions[questionIndex]);
  }, [questionIndex, questions]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { toast } = useToast();
  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
        userId: userId,
        questionNo: questionIndex,
      };
      const headers = {

  'Content-Type': 'application/json',
};
console.log(userId)
      const response = await fetch(`/api/activities/checkAnswer`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: headers
      });
      
      const responseJson = await response.json()
      console.log(responseJson)
      return responseJson;
    },
  });

    React.useEffect(() => {
    const savedData = localStorage.getItem(`mcqGameData_${game.id}`);
    if (savedData !== null) {
      const { savedIndex, savedStats, hasEnded } = JSON.parse(savedData);
      setQuestionIndex(parseInt(savedIndex, 10));
      setStats(savedStats);
      setHasEnded(hasEnded)
    }
  }, [game.id]);

  // Save the current data to localStorage whenever it changes
  React.useEffect(() => {
    const dataToSave = {
      savedIndex: questionIndex.toString(),
      savedStats: stats,
      hasEnded: hasEnded,
    };
    localStorage.setItem(`mcqGameData_${game.id}`, JSON.stringify(dataToSave));
  }, [questionIndex, stats, hasEnded, game.id]);

  const handleRedo = React.useCallback(() => {
    // Clear the stored data in localStorage and reset the component state
    localStorage.removeItem(`mcqGameData_${game.id}`);
    setQuestionIndex(0);
    setStats({
      correct_answers: 0,
      wrong_answers: 0,
    });
    setHasEnded(false);
    setSelectedChoice(0);
  }, [game.id]);

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      setLoadingEnded(true)
      const response = await axios.post(`/api/activities/endGame`, payload);
      setLoadingEnded(false)
      return response.data;
    },
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setStats((stats) => ({
            ...stats,
            correct_answers: stats.correct_answers + 1,
          }));

          
          toast({
            title: "Correct",
            description: "You got it right!",
            variant: "success",
          });
        } else {
          setStats((stats) => ({
            ...stats,
            wrong_answers: stats.wrong_answers + 1,
          }));
          toast({
            title: "Incorrect",
            description: "You got it wrong!",
            variant: "destructive",
          });
        }
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((questionIndex) => questionIndex + 1);
      }},
    );
  }, [checkAnswer, questionIndex, game.questions.length, toast, endGame]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === "1") {
        setSelectedChoice(0);
      } else if (key === "2") {
        setSelectedChoice(1);
      } else if (key === "3") {
        setSelectedChoice(2);
      } else if (key === "4") {
        setSelectedChoice(3);
      } else if (key === "Enter") {
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
      
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        {loadingEnded ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 
        <div>
          <MCQCounter
            correct_answers={stats.correct_answers}
            wrong_answers={stats.wrong_answers}
          />
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
              className="m-4 text-text border border-text"
              onClick={handleRedo}
            >
              Redo
            </Button>
        </div>
        }
      </div>
    );
  }

  return (
    <div className=" max-w-4xl text-black">
        <div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* topic */}
          <p>
            <span className="text-text">Topic</span> &nbsp;
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-text">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter
          correct_answers={stats.correct_answers}
          wrong_answers={stats.wrong_answers}
        />
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-text">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg text-text">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4 text-text">
        {options.map((option, index) => {
          return (
                <Button
                  key={option}
                  variant={selectedChoice === index ? "default" : "outline"}
                  className={`justify-start w-full py-8 mb-4 text-black`}
                  onClick={() => setSelectedChoice(index)}
                >
                  <div className="flex items-center justify-start">
                    <div className="p-2 px-3 mr-5 border rounded-md" text-black>
                      {index + 1}
                    </div>
                    <div className="text-start">{option}</div>
                  </div>
                </Button>
          );
        })}
        <div className="flex justify-center align-center">
            <Button
            variant="default"
            className="mt-2 text-text border-text"
            size="lg"
            disabled={isChecking || hasEnded}
            onClick={() => {
                handleNext();
            }}
            >
            {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
                variant="outline"
                className="m-4 text-text border border-text"
                onClick={handleRedo}
            >
                Redo
            </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MCQ;
