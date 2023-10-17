import React, { useEffect } from "react";
import { PencilIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NoteCardDialog } from "./note-card-dialog";

interface NoteCardProps {
  noteData: {
    id: number;
    title: string;
    encryptedContent: string;
  };
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
      console.log(json);
    }
  };

  useEffect(() => {
    if (decryptedNote.note !== "") {
      setOpen(true);
    }
  }, [decryptedNote]);

  return (
    <div className="flex items-center p-5 m-2 bg-white rounded-md shadow-lg w-full">
      <LockClosedIcon className="w-6 h-6 mr-4" />
      <div className="flex-grow text-left">
        <h3 className="text-xl font-bold">{props.noteData.title}</h3>
      </div>

      {/* Note Card Button*/}
      <button onClick={() => FetchNoteData()}>
        <PencilIcon className="w-6 h-6 mr-2" />
      </button>
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
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
