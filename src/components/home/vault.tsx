"use client"; // This is a client component

import { useState, useEffect, useRef } from "react";
import PasswordVault from "@components/home/password_vault";
import NoteVault from "@components/home/note_vault";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";
import { CreatePasswordDialog } from "./create-password-dialog";
import { CreateNoteDialog } from "./create-note-card-dialog";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Vault() {
  const [passwordData, setPasswordData] = useState([]);
  const [noteData, setNoteData] = useState([]);
  const [featureDisplay, setFeatureDisplay] = useState(0);
  const { toast } = useToast(); // Instatiate Toast for status feedback
  const [openCreatePassword, setOpenCreatePassword] = useState(false);
  const [openCreateNote, setOpenCreateNote] = useState(false);

  const FetchPasswordData = async () => {
    const response = await fetch(`api/vault/retrieve/passwords`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (response.ok) {
      setPasswordData(json.passwords);
    } else {
      console.log(json);
    }
  };

  const FetchNotesData = async () => {
    const response = await fetch(`api/vault/retrieve/notes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (response.ok) {
      setNoteData(json.notes);
    } else {
      console.log(json);
    }
  };

  useEffect(() => {
    const FetchData = async () => {
      await FetchPasswordData();
      await FetchNotesData();
    };

    FetchData();
  }, []);

  function refreshPasswordVault() {
    FetchPasswordData();
  }

  function refreshNoteVault() {
    FetchNotesData();
  }

  function handleCreation() {
    if (featureDisplay === 0) {
      setOpenCreatePassword(true);
    } else {
      setOpenCreateNote(true);
    }
  }

  const PageDisplay = () => {
    switch (featureDisplay) {
      case 0:
        // Return the component or content for 'Password'
        return (
          <PasswordVault
            passwordData={passwordData}
            refreshPasswordVault={refreshPasswordVault}
          />
        );
      case 1:
        // Return the component or content for 'Secure Note'
        return (
          <NoteVault noteData={noteData} refreshNoteVault={refreshNoteVault} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-2 w-2/3 mx-auto">
      <div className="flex w-full justify-between">
        <h1 className="flex items-center">Insert User's Name here</h1>
        <button
          type="button"
          className=" flex px-5 py-2 items-center transition-colors duration-150 rounded-md hover:bg-gray-200 bg-white border-2 border-gray-300"
          onClick={handleCreation}
        >
          <PlusIcon className="w-5 h-5 mr-1"/> Add new
        </button>
      </div>
      <div className="flex w-full bg-gray-100 border-2 rounded-lg whitespace-nowrap">
        <button
          type="button"
          className={`${
            featureDisplay === 0 ? "font-semibold bg-white" : ""
          } flex-grow px-5 py-2 transition-colors duration-150 rounded-md hover:bg-gray-200`}
          onClick={() => setFeatureDisplay(0)}
        >
          Password
        </button>
        <button
          type="button"
          className={`${
            featureDisplay === 1 ? "font-semibold bg-white" : ""
          } flex-grow px-5 py-2 transition-colors duration-150 rounded-md hover:bg-gray-200`}
          onClick={() => setFeatureDisplay(1)}
        >
          Secure Note
        </button>
      </div>
      <div className="w-full">{PageDisplay()}</div>
      {/* Create Password Modal*/}
      <Dialog open={openCreatePassword} onOpenChange={setOpenCreatePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Password</DialogTitle>
            <DialogDescription>
              <CreatePasswordDialog
                open={openCreatePassword}
                setOpenCreatePassword={setOpenCreatePassword}
                refreshPasswordVault={refreshPasswordVault}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Create Note Modal*/}
      <Dialog open={openCreateNote} onOpenChange={setOpenCreateNote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new Note</DialogTitle>
            <DialogDescription>
                <CreateNoteDialog open={openCreateNote} setOpenCreateNote={setOpenCreateNote} refreshNoteVault={refreshNoteVault} />
              </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
