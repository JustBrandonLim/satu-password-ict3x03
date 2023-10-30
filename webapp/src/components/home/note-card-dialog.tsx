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
import React, { Dispatch, SetStateAction, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

interface NoteCardDialogProps {
  noteData: {
    id: number;
    title: string;
    encryptedContent: string;
  };
  decryptedNote: {
    note: string;
  };
  open: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  refreshNoteVault: () => void;
}

const NoteCardDialogSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  note: z.string({
    required_error: "Note is required",
  }),
});

const NoteCardDialog: React.FC<NoteCardDialogProps> = ({
  setOpenDialog,
  decryptedNote,
  noteData,
  refreshNoteVault,
}) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Track form submission status
  const [formSubmissionStatus, setFormSubmissionStatus] = useState(""); // Track result of submitted form status
  const noteCardForm = useForm<z.infer<typeof NoteCardDialogSchema>>({
    resolver: zodResolver(NoteCardDialogSchema),
    defaultValues: {
      title: noteData.title,
    },
  });

  const onSaveNoteCard = async (data: z.infer<typeof NoteCardDialogSchema>) => {
    let id = noteData.id;
    let title = data.title;
    let note = data.note;

    async function SaveNote() {
      const response = await fetch(`api/vault/update/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          title: title,
          content: note,
        }),
      });

      if (response.ok) {
        refreshNoteVault();
        setIsFormSubmitted(true);
        setFormSubmissionStatus("Note has been updated successfully!");
      } else {
        setIsFormSubmitted(true);
        setFormSubmissionStatus("Error! Note could not be updated!");
      }
    }
    SaveNote();
  };

  function handleDeleteNote() {
    async function DeleteNote() {
      const response = await fetch(`api/vault/delete/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: noteData.id,
        }),
      });

      if (response.ok) {
        refreshNoteVault();
        setIsFormSubmitted(true);
        setFormSubmissionStatus("Note has been deleted successfully!");
      } else {
        setIsFormSubmitted(true);
        setFormSubmissionStatus("Error! Note could not be deleted!");
      }
    }
    DeleteNote();
  }

  //The HTML elements
  return (
    <>
      {!isFormSubmitted ? (
        <Form {...noteCardForm}>
          <form
            onSubmit={noteCardForm.handleSubmit(onSaveNoteCard)}
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
                            defaultValue={
                              decryptedNote.note !== null
                                ? decryptedNote.note
                                : ""
                            }
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
              <div>
                <Button
                  type="button"
                  className="w-full"
                  variant={"destructive"}
                  onClick={() => handleDeleteNote()}
                >
                  Delete
                </Button>
              </div>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-full"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      ) : (
        // Render a success message
        <div>
          <p>{formSubmissionStatus}</p>
        </div>
      )}
    </>
  );
};
NoteCardDialog.displayName = "NoteCardDialog";
export { NoteCardDialog };
