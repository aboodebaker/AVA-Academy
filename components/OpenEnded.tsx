// @ts-nocheck
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
import { pusherClient } from '@/lib/pusher';
import MCQCounter from "./MCQCounter";
import TabsDemo from '@/components/tabs'
type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
    userId: string
};

const OpenEnded = ({ game, userId }: Props) => {
  const [hasEnded, setHasEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [averagePercentage, setAveragePercentage] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [questions, setQuestions] = useState(game.questions)
  const [currentQuestion, setCurrentQuestion] = useState(questions[questionIndex]);
  const [loadingEnded, setLoadingEnded] = useState(false)
  const [tab, setTab] = useState(null)
  const [customId, setCustomId] = useState(null)
  useEffect(() => {
    setCurrentQuestion(questions[questionIndex]);
  }, [questionIndex, questions]);



  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      setLoadingEnded(true)
      const response = await axios.post(`/api/endGame`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }},);
        setTab(response.data.performance)
        setCustomId(response.data.gameId)
        setLoadingEnded(false)

      return response.data;
    },
  });
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());
  const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
    mutationFn: async () => {
      const payload:any = {
        questionId: currentQuestion.id,
        userInput: userAnswer, // User's entire answer
        userId: userId,
        questionNo: questionIndex,
      };
      const headers = {

  'Content-Type': 'application/json',
};
console.log(userId)
      const response = await fetch(`/api/checkAnswer`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: headers
      });
      
      const responseJson = await response.json()
      console.log(responseJson)
      return responseJson;
    },
    },
  );

  // Retrieve the last saved question index from localStorage on component mount
      useEffect(() => {
    const savedData = localStorage.getItem(`gameData_${game.id}`);
    if (savedData !== null) {
      const { savedIndex, savedPercentage, hasEnded, tabs, id } = JSON.parse(savedData);
      setQuestionIndex(parseInt(savedIndex, 10));
      setAveragePercentage(parseFloat(savedPercentage));
      setHasEnded(hasEnded),
      setTab(tabs),
      setCustomId(id)
    }
  }, [game.id]);

  // Save the current question index to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      savedIndex: questionIndex.toString(),
      savedPercentage: averagePercentage.toString(),
      hasEnded: hasEnded,
      tabs: tab,
      id: customId,
    };
    localStorage.setItem(`gameData_${game.id}`, JSON.stringify(dataToSave));
  }, [questionIndex, averagePercentage, game.id, hasEnded, tab])

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
    setCustomId(null)
    setTab(null)
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
        setQuestionIndex((questionIndex) => questionIndex + 1);
          
          const dataToSave = {
            savedIndex: questionIndex.toString(),
            savedPercentage: averagePercentage.toString(),
            hasEnded: true
            };
            localStorage.setItem(`gameData_${game.id}`, JSON.stringify(dataToSave));

          
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
      
      return;
    }
      
      }

        
    )
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
      <div className='flex justify-center items-center full-screen '>
  <div className='flex flex-col justify-center items-center'>
        {loadingEnded ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 
        <div>
          <OpenEndedPercentage percentage={averagePercentage} />
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
          <TabsDemo data={tab} id={customId} />
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
      </div>
    );
  }

  return (
    
    <div className='flex justify-center items-center full-screen '>
  <div className='flex flex-col justify-center items-center'>
        <div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-1/2">
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
        <OpenEndedPercentage percentage={averagePercentage} />
      </div>
      <Card className=" mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-text">
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
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <Input
          placeholder="Enter your answer here"
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-full max-w-2xl rounded bg-background text-text"
        />

        <div className="flex flex-col justify-center items-center">
                    
              <Button
                variant="outline"
                className="m-4 text-text border border-text"
                disabled={isChecking || hasEnded}
                onClick={handleNext}
              >
                {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            
            <Button
            variant="outline"
            className="m-4 text-text border border-text "
            onClick={handleRedo}
            >
            Redo
            </Button>

        </div>
      </div>
      </div>
      
    </div>
    </div>
  );
};

export default OpenEnded;
