"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  chatId: string;
};

const DeleteButton = ({ chatId }: Props) => {
  const router = useRouter();
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteMessages", {
        chatId,
      });
      return response.data;
    },
  });

  return (
    <Button
      variant={"destructive"}
      size="sm"
      disabled={deleteNote.isLoading}
      onClick={() => {
        deleteNote.mutate(undefined, {
          onSuccess: () => {
            router.refresh();
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
