// @ts-nocheck
"use client";
// Use client
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
  files: Files[]; // Ensure that "files" is an array
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

const QuizCreation: React.FC<Props> = ({ topic: topicParam, files }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("mcq");
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type, selectedFileId, classs }: Input) => {
      console.log(classs)
      const response = await axios.post("/api/activities", {
        amount,
        topic,
        type,
        selectedFileId,
        classs
      });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      subject: "", // Add a new field for subject
      type: "mcq",
      amount: 3,
      selectedFileId: "", // Add a new field for selectedFileId
      classs: 'A',
    },
  });
  
 const uniqueSubjects = Object.values(
  files.reduce((acc, file) => {
    const uniqueId = file.Subject.uniqueId;
    acc[uniqueId] = file.Subject;
    return acc;
  }, {})
);


  const uniqueChatpdfValues = Array.from(new Set(files.map(file => file.chatpdf)));
  const uniqueFiles = uniqueChatpdfValues.map(chatpdf => files.find(file => file.chatpdf === chatpdf));

  const [subjectFiles, setSubjectFiles] = useState<Files[]>([]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const selectedSubject = form.getValues("subject");
      const filteredFiles = uniqueFiles.filter((file) => file.Subject.uniqueId === selectedSubject);
      setSubjectFiles(filteredFiles);
    }, 500); // Run every 1 second

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);



  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions({ ...data, selectedFileId: form.getValues("selectedFileId"), classs: form.getValues("classs") }, {
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
        setError('An error occured. Please try again.')
      },
      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") === "mcq") {
            router.push(`/teacher-platform/activities/mcq/${gameId}`);
          } else if (form.getValues("type") === "open_ended") {
            router.push(`/teacher-platform/activities/open-ended/${gameId}`);
          }
        }, 2000);
      },
    });
  }

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <div className='col m-2 text-text bg-background'>
    <div className='flex justify-center align-center w-[800]'>
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
                    <FormControl className="bg-background">
                      <select {...field} className="mt-1 block w-full py-2 px-3 border border-text bg-background rounded-md shadow-sm focus:outline-none focus:ring text-text focus:ring-indigo-200 focus:border-indigo-300">
                        <option value="">Select a subject</option>
                        {/* Add options for subjects based on your data */}
                        {uniqueSubjects.map((subject, index) => (
                          <option key={index} value={subject.uniqueId} className="text-text">
                            {subject.name}
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
                    <FormControl className="bg-background">
                      <select {...field} className="mt-1 block w-full py-2 px-3 border border-text bg-background rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                        <option value="">Select a file</option>
                        {subjectFiles.map((file, index) => (
                          <option key={index} value={file?.chatpdf} >
                            {file?.pdfName} Grade {file?.grade}
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
                name="classs"
                render={({ field }) => (
                  <FormItem className="bg-background">
                    <div className=" ">
                    <FormLabel className="pr-5 text-text">Choose a class</FormLabel>
                    <FormControl>
                      <select {...field} className="mt-1 block w-full py-2 px-3 border border-text bg-background rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                        <option value="">Select a class</option>
                        <option value='A' >A</option>
                        <option value='B' >B</option>
                        <option value='C' >C</option>
                        <option value='D' >D</option>
                      </select>
                    </FormControl>
                    </div>
                    <FormDescription className="text-text">
                      Select a class for the activity based on the chosen topic and file.
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
                  className={`w-1/2 rounded-none rounded-l-lg text-text ${
                    selectedType === "mcq" ? "text-green-500 font-extrabold" : ""
                  }`}
                  onClick={() => {
                    setSelectedType("mcq");
                    form.setValue("type", "mcq"); // Update the selected type
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
                  className={`w-1/2 rounded-none rounded-l-lg text-text ${
                    selectedType === "open_ended" ? "text-green-500 font-extrabold" : ""
                  }`}
                  onClick={() => {
                    setSelectedType("open_ended");
                    form.setValue("type", "open_ended"); // Update the selected type
                  }}
                  type="button"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </form>
            <p>{error}</p>
          </Form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default QuizCreation;
