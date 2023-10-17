import React from "react";
import {
  PencilIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
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
    encrypted_password: string;
  };
}

export default function NoteCard(props: NoteCardProps) {
  const [open, setOpen] = React.useState(false);
  const [decryptedNote, setDecryptedNote] = React.useState(false);

  // Function to decrypt the note
  async function fetchNote() {
    try {
      const response = await fetch(
        `api/vault/retrieve/note?note=${props.noteData.encrypted_password}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setDecryptedNote(json.note);
      } else {
        throw new Error("Failed to fetch and decrypt the password");
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching password:", error);
      return null; // Return null in case of an error
    }
  }

  return (
    <div className="flex items-center p-5 m-2 bg-white rounded-md shadow-lg w-full">
      <LockClosedIcon className="w-6 h-6 mr-4" />
      <div className="flex-grow text-left">
        <h3 className="text-xl font-bold">{props.noteData.title}</h3>
      </div>
      {/* Edit Modal */}
      {/* Note Card Dialog*/}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* Note Card Button*/}
          <button>
            <PencilIcon className="w-6 h-6 mr-2" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editing {props.noteData.title}</DialogTitle>
            <DialogDescription>
              <NoteCardDialog
                open={open}
                setOpenDialog={setOpen}
                noteData={props.noteData}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
