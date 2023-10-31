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
  note: z.string().optional(),
});

const NoteCardDialog: React.FC<NoteCardDialogProps> = ({
  setOpenDialog,
  decryptedNote,
  noteData,
  refreshNoteVault,
}) => {
  const noteCardForm = useForm<z.infer<typeof NoteCardDialogSchema>>({
    resolver: zodResolver(NoteCardDialogSchema),
    defaultValues: {
      title: noteData.title,
      note: decryptedNote.note,
    },
  });

  const onSaveNoteCard = async (data: z.infer<typeof NoteCardDialogSchema>) => {
    let id = noteData.id;
    let title = data.title;
    let note = data.note;
    console.log(id);
    console.log(title);
    console.log(note);
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
        toast({
            variant: "default",
            title: "Note has been updated successfully!",
            description: "Your note has been updated successfully!",
        })
        setOpenDialog(false);
      } else {
        toast({
            variant: "destructive",
            title: "Error! Note could not be updated!",
            description: "Your note could not be updated!",
        })
        setOpenDialog(false);
      }
    }
    await SaveNote();
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
        toast({
          variant: "default",
          title: "Note has been deleted successfully!",
          description: "Your note has been deleted successfully!",
        })
        setOpenDialog(false);
      } else {
        toast({
            variant: "destructive",
            title: "Error! Note could not be deleted!",
            description: "Your note could not be deleted!",
        })
        setOpenDialog(false);
      }
    }
    DeleteNote().then(() => { console.log("Note deleted") });
  }

  //The HTML elements
  return (
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
                            placeholder="Input your note here"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-gray-500">
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
                  className="w-full text-red-500"
                  variant={"link"}
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
  );
};
NoteCardDialog.displayName = "NoteCardDialog";
export { NoteCardDialog };
