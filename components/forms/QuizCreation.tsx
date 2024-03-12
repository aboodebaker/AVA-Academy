// @ts-nocheck
"use client";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "../ui/separator";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingQuestions from "../LoadingQuestions";

type Props = {
  topic: string;
  files: Files[];
  id: string;
};

type Files = {
  id: string;
  pdfName: string;
  pdfUrl: string;
  createdAt: number;
  userId: string;
  fileKey: string;
  subject: string;
  edited: number;
  chatpdf: string | null;
  messages: Messages;
  Subject: any;
};

type Messages = {
  id: string;
  chatId: number | null;
  content: string | null;
  createdAt: number;
  role: string;
  fileId: string;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation: React.FC<Props> = ({ topic: topicParam, files, id }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("mcq");
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type, selectedFileId }: Input) => {
      const response = await axios.post("/api/game", {
        amount,
        topic,
        type,
        selectedFileId,
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      subject: "",
      type: "mcq",
      amount: 3,
      selectedFileId: "",
    },
  });

  const [subjectFiles, setSubjectFiles] = useState<Files[]>([]);

  useEffect(() => {
    const uniqueSubjects = Array.from(new Set(files.map(file => file.subject)));
    const uniqueSubjectFiles: Files[] = uniqueSubjects.map(subject => {
      return files.find(file => file.subject === subject);
    }).filter(Boolean) as Files[];
    setSubjectFiles(uniqueSubjectFiles);
  }, [files]);

  useEffect(() => {
    if (id) {
      const selectedFile = files.find((file) => file.id === id);
      if (selectedFile) {
        form.setValue("subject", selectedFile.Subject.id);
        form.setValue("selectedFileId", selectedFile.chatpdf);
      }
    }
  }, [id, files, form]);

  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions({
      selectedFileId: form.getValues("selectedFileId"),
      type: form.getValues("type"),
      amount: form.getValues('amount'),
      topic: form.getValues('topic')
    }, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast({
              title: "Error",
              description: "Something went wrong. Please try again later.",
              variant: "destructive",
            });
          }
        }
      },
      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") === "mcq") {
            router.push(`/play/mcq/${gameId}`);
          } else if (form.getValues("type") === "open_ended") {
            router.push(`/play/open-ended/${gameId}`);
          }
        }, 2000);
      },
    });
  }

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
      <div className='flex justify-center items-center full-screen md:w-[800] sm:w-[600]'>
  <div className='flex flex-col justify-center items-center'>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
            <CardDescription className="text-text">Choose a topic and subject</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text">Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a topic" {...field} className="text-text" />
                      </FormControl>
                      <FormDescription className="text-text">
                        Please provide any topic you would like to be quizzed on here.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text">Subject</FormLabel>
                      <FormControl className="bg-background text-text">
                        <select {...field} className="mt-1  bg-background text-text  block w-full py-2 px-3 border border-text  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                          <option value="" className="text-black">Select a subject</option>
                          {subjectFiles.map((file, index) => (
                            <option key={index} value={file.Subject.id} className="text-black">
                              {file.Subject.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription className="text-text">
                        Please select the subject for the quiz.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="selectedFileId"
                  render={({ field }) => (
                    <FormItem>
                      <div className=" ">
                        <FormLabel className="pr-5 text-text">Choose a file</FormLabel>
                        <FormControl className="text-text bg-background">
                          <select {...field} className="mt-1 block w-full py-2 px-3 border border-text bg-background text-text rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                            <option value="">Select a file</option>
                            {files.map((file) => (
                              <option key={file.chatpdf} value={file.chatpdf} className="text-black">
                                {file.pdfName}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                      </div>
                      <FormDescription className="text-text">
                        Select a file for the quiz based on the chosen subject.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-text">Number of Questions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How many questions?"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            form.setValue("amount", parseInt(e.target.value));
                          }}
                          min={1}
                          max={10}
                          className="text-text bg-background"
                        />
                      </FormControl>
                      <FormDescription className="text-text">
                        You can choose how many questions you would like to be
                        quizzed on here.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    variant={
                      selectedType === "mcq" ? "default" : "destructive"
                    }
                    className={`w-1/2 rounded-none rounded-l-lg ${
                      selectedType === "mcq" ? "bg-primarys font-extrabold text-white" : "text-text border border-text"
                    }`}
                    onClick={() => {
                      setSelectedType("mcq");
                      form.setValue("type", "mcq");
                      console.log(form.getValues('type'))
                    }}
                    type="button"
                  >
                    <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                  </Button>
                  <Separator orientation="vertical" />
                  <Button
                    variant={
                      selectedType === "open_ended"
                        ? "default"
                        : "secondary"
                    }
                    className={`w-1/2 rounded-none rounded-l-lg ${
                      selectedType === "open_ended" ? "bg-primarys font-extrabold text-white" : "text-text border border-text"
                    }`}
                    onClick={() => {
                      setSelectedType("open_ended");
                      form.setValue("type", "open_ended");
                    }}
                    type="button"
                  >
                    <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                  </Button>
                </div>
                <Button disabled={isLoading} onClick={onSubmit} type="submit" className="text-text border border-text">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizCreation;
