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

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
  const [hasEnded, setHasEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [averagePercentage, setAveragePercentage] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [questions, setQuestions] = useState(game.questions)
  const [currentQuestion, setCurrentQuestion] = useState(questions[questionIndex]);

  useEffect(() => {
    setCurrentQuestion(questions[questionIndex]);
  }, [questionIndex, questions]);

  useEffect(() => {
      
    pusherClient.subscribe(game.uniqueId)

    pusherClient.bind('incoming-questions', (data: any) => {
      console.log(data)
      setQuestions([...data]);
    })

    return () => {
      pusherClient.unsubscribe(game.uniqueId)
    }

  }, []);

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/activities/endGame`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }},);
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
      const response = await axios.post(`/api/activities/checkAnswer`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }});
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
        if (questions[questionIndex + 1]?.canAnswer) {
        toast({
          title: `Your answer is ${percentageSimilar}% similar to the correct answer`,
        });
        setAveragePercentage((prev) => {
          return (prev + percentageSimilar) / (questionIndex + 1);
        });
        
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
      }},
      );
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
        <div className="px-4 py-2 mt-2 font-semibold text-black bg-green-500 rounded-md whitespace-nowrap">
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
            className="m-4 text-black"
            onClick={handleRedo}
            >
            Redo
            </Button>


      </div>
    );
  }

  return (
    
    <div className="text-text">
      {questionIndex < questions.length && questions[questionIndex]?.canAnswer ? (
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
          className="w-full max-w-2xl rounded bg- background text-text"
        />

        <div className="flex justify-center align-center text-black">
                    
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
      ) : (
        <div>
        <div>
          <div>
          <p>
            <span className="text-text-text">Topic</span> &nbsp;
            <span className="px-2 py-1 text-white rounded-lg bg-text-text">
              {game.topic}
            </span>
          </p>
          
          <div className="flex self-start mt-3 text-text-text">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <OpenEndedPercentage percentage={averagePercentage} />
      </div>
              <div className="m-4 text-red-500">
                You cannot answer the next question yet.
              </div>
              </div>
            )}
    </div>
    
  );
};

export default OpenEnded;
