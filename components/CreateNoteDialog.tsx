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
  const [input, setInput] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [shared, setIsShared] = React.useState(false);
  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/notes", {
        name: input,
        subject: subject,
        shared: shared,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      window.alert("Please enter a name for your notebook");
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        console.log("created new note:", { note_id });
        // hit another endpoint to uplod the temp dalle url to permanent firebase url
        router.push(`/notes/${note_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to create new notebook");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div>
        <button className="newbutton">+New</button>
      </div>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>New Note Book</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name..."
          />
                      <div className="mb-4">
              
              <select
                id="subject"
                className="w-full border rounded p-2 mt-4"
                value={subject}
                required
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select a subject</option>
                {subjectOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="shared" className="block font-semibold">
                Shared:
              </label>
              <input
                type="checkbox"
                id="shared"
                className="w-4 h-4 mt-2"
                checked={shared}
                onChange={(e) => setIsShared(e.target.checked)}
              />
            </div>
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600"
              disabled={createNotebook.isLoading}
            >
              {createNotebook.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
