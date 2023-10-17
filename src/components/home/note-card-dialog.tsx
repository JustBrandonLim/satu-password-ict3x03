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
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Textarea } from "../ui/textarea";

interface NoteCardDialogProps {
  noteData: {
    id: number;
    title: string;
    encryptedContent: string;
  };
  open: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const NoteCardDialogSchema = z.object({
  note: z.string({
    required_error: "Note is required",
  }),
});

const NoteCardDialog: React.FC<NoteCardDialogProps> = ({
  setOpenDialog,
  noteData,
}) => {
  const noteCardForm = useForm<z.infer<typeof NoteCardDialogSchema>>({
    resolver: zodResolver(NoteCardDialogSchema),
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [decryptedNote, setDecryptedNote] = React.useState(null);

  useEffect(() => {
    // Function to decrypt the note
    const FetchNoteData = async () => {
      const response = await fetch(
        `api/vault/retrieve/note?note=${noteData.encryptedContent}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        setDecryptedNote(json.notes);
      } else {
        console.log(json);
      }
    };

    const FetchData = async () => {
      await FetchNoteData();
      setIsLoading(false);
    }
    FetchData();
  }, []);

  const onSaveNoteCard = async (data: z.infer<typeof NoteCardDialogSchema>) => {
    // For Debugging
    console.log("Form Submitted");
    console.log(data);
    console.log(typeof data);
    let note = data.note;
  };

  //The HTML elements
  return (
    <>
      {!isLoading && (
        <Form {...noteCardForm}>
          <form
            onSubmit={noteCardForm.handleSubmit(onSaveNoteCard)}
            className="space-y-6"
          >
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
                        <Textarea {...field} defaultValue={decryptedNote !== null ? decryptedNote : ''} />

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
            <div className="flex space-x-4 w-full">
              <Button
                type="reset"
                variant={"outline"}
                className="w-full"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setOpenDialog(false);
                }}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};
NoteCardDialog.displayName = "NoteCardDialog";
export { NoteCardDialog };
