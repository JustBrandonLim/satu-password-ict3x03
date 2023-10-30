"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import React, { Dispatch, SetStateAction } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import {toast} from "@components/ui/use-toast";

interface NoteCardDialogProps {
  open: boolean;
  setOpenCreateNote: Dispatch<SetStateAction<boolean>>;
  refreshNoteVault: () => void;
}

const NoteCardDialogSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  note: z.string().optional(),
});

const CreateNoteDialog: React.FC<NoteCardDialogProps> = ({
  setOpenCreateNote,
  refreshNoteVault,
}) => {
  const noteCardForm = useForm<z.infer<typeof NoteCardDialogSchema>>({
    resolver: zodResolver(NoteCardDialogSchema),
    defaultValues: {
        title: "",
        note: "",
    }
  });

  const onStoreNoteCard = async (
    data: z.infer<typeof NoteCardDialogSchema>
  ) => {
    let title = data.title;
    let note = data.note;

    async function StoreNote() {
      const response = await fetch(`api/vault/store/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: note,
        }),
      });

      if (response.ok) {
        refreshNoteVault();
        toast({
          variant: "default",
          title: "Note created successfully!",
          description: "Your note has been created successfully!",
        })
        setOpenCreateNote(false);
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Note could not be created!",
        })
        setOpenCreateNote(false);
      }
    }
    await StoreNote();
  };

  //The HTML elements
  return (
        <Form {...noteCardForm}>
          <form
            onSubmit={noteCardForm.handleSubmit(onStoreNoteCard)}
            className="space-y-6"
          >
            {/* Title Items Row */}
            <div className="flex w-full items-end space-x-2 mt-4">
              {/* Title Field */}
              <FormField
                control={noteCardForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full text-left">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <div className="flex w-full space-x-4">
                        <div className="relative w-full">
                          <Input
                            placeholder="Input your Title here"
                            type="title"
                            {...field}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Items Row */}
            <div className="flex w-full items-end space-x-2 mt-4">
              {/* Textarea Field */}
              <FormField
                control={noteCardForm.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="w-full text-left">
                    <FormLabel>Your note</FormLabel>
                    <FormControl>
                      <div className="flex-col w-full space-x-4">
                        <div className="relative w-full">
                          <Textarea
                            {...field}
                            placeholder="Input your note here"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-gray-500">
                      {" "}
                      Your note will be encrypted on the servers.
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex space-x-4 justify-between w-full">
              <Button
                type="button"
                variant={"outline"}
                className="w-full"
                onClick={() => setOpenCreateNote(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full">
                Create
              </Button>
            </div>
          </form>
        </Form>
  );
};
CreateNoteDialog.displayName = "CreateNoteDialog";
export { CreateNoteDialog };
