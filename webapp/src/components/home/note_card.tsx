import React, { useEffect } from "react";
import { ScrollText, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NoteCardDialog } from "./note-card-dialog";
import {Button} from "@components/ui/button";

interface NoteCardProps {
  noteData: {
    id: number;
    title: string;
    encryptedContent: string;
  };
  refreshNoteVault: () => void;
}

export default function NoteCard(props: NoteCardProps) {
  const [open, setOpen] = React.useState(false);
  const [decryptedNote, setDecryptedNote] = React.useState({ note: "" });

  // Function to decrypt the note
  const FetchNoteData = async () => {
    const response = await fetch(
      `api/vault/retrieve/note?note=${props.noteData.encryptedContent}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      setDecryptedNote(json);
    } else {
      console.log("An unexpected error occurred");
    }
  };

  useEffect(() => {
    if (decryptedNote.note !== "") {
      setOpen(true);
    }
  }, [decryptedNote]);

  return (
    <div className="flex items-center p-5 m-2 bg-white rounded-md shadow-lg w-full">
      <ScrollText className={"mr-4"}/>
      <div className="flex-grow text-left">
        <h3 className="text-lg font-medium">{props.noteData.title}</h3>
      </div>

      {/* Note Card Button*/}
      <Button onClick={FetchNoteData} size={"icon"} variant={"ghost"}>
        <Pencil className={"text-character-secondary"}/>
      </Button>
      {/* Edit Modal */}
      {/* Note Card Dialog*/}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editing {props.noteData.title}</DialogTitle>
            <DialogDescription>
              <NoteCardDialog
                open={open}
                setOpenDialog={setOpen}
                decryptedNote={decryptedNote}
                noteData={props.noteData}
                refreshNoteVault={props.refreshNoteVault}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
