"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const subjectOptions = [
  'Maths',
  'English',
  'Afrikaans',
  'History',
  'Geography',
  'Physics',
  'Life Science',
  'ISW',
  'ISO',
  'Quraanic Arabic',
  'Technology',
  'Creative Arts',
  'Coding and Robotics',
  'Life Orientation',
];

type Props = {};

const CreateNoteDialog = (props: Props) => {
  const router = useRouter();

 
  return (
    <Dialog>
      <DialogTrigger>
        <div>
        <button className="bux">Options</button>
      </div>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Here are some options for your PDF</DialogTitle>
          <DialogDescription>
            
          </DialogDescription>
        </DialogHeader>
        <h1>Have questions. Ask our AI based on your module</h1>
        <button onClick={() => { router.push('/chat/')}}>Chat with your module</button>
      </DialogContent>
    </Dialog>
  );
};
