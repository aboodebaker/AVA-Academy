"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  courseId: string;
};

const DeleteButton = ({ courseId }: Props) => {
  const router = useRouter();
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteCourse", {
        courseId,
      });
      return response.data;

      router.refresh()
    },
  });
  return (
    <Button
      variant={"destructive"}
      size="sm"
      disabled={deleteNote.isLoading}
      className="text-text"
      onClick={() => {
        const confirm = window.confirm(
          "Are you sure you want to delete this course?"
        );
        if (!confirm) return;
        deleteNote.mutate(undefined, {
          onSuccess: () => {
            router.push("/course");
          },
          onError: (err) => {
            console.error(err);
          },
        });
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
