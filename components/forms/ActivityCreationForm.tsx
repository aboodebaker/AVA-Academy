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
  const { toast } = useToast();
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type, selectedFileId }: Input) => {
      const response = await axios.post("/api/activities", {
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
      subject: "", // Add a new field for subject
      type: "open_ended",
      amount: 3,
      selectedFileId: "", // Add a new field for selectedFileId
    },
  });
  
  const uniqueSubjects = Array.from(new Set(files.map(file => file.subject)));

    const uniqueChatpdfValues = Array.from(new Set(files.map(file => file.chatpdf)));
  const uniqueFiles = uniqueChatpdfValues.map(chatpdf => files.find(file => file.chatpdf === chatpdf));

  const [subjectFiles, setSubjectFiles] = useState<Files[]>([]);
  
  useEffect(() => {
    // Update the subjectFiles when the subject field changes
    const selectedSubject = form.getValues("subject");
    const filteredFiles = files.filter((file) => file.subject === selectedSubject);
    setSubjectFiles(filteredFiles);
  }, [form.getValues("subject"), files]);



  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions({ ...data, selectedFileId: form.getValues("selectedFileId") }, {
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
    <div className='col m-2 '>
    <div className='flex justify-center align-center w-[800]'>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic and subject</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic" {...field} />
                    </FormControl>
                    <FormDescription>
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
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <select {...field} className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                        <option value="">Select a subject</option>
                        {/* Add options for subjects based on your data */}
                        {uniqueSubjects.map((subject, index) => (
                          <option key={index} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
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
                    <FormLabel className="pr-5">Choose a file</FormLabel>
                    <FormControl>
                      <select {...field} className="mt-1 block w-full py-2 px-3 border border-black bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                        <option value="">Select a file</option>
                        {uniqueFiles.map((file, index) => (
                          <option key={index} value={file?.chatpdf}>
                            {file?.pdfName} Grade {file?.grade}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    </div>
                    <FormDescription>
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
                    <FormLabel>Number of Questions</FormLabel>
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
                    <FormDescription>
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
                  className={`w-1/2 rounded-none rounded-l-lg ${
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
          </Form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default QuizCreation;
