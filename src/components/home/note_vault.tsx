import React from "react";
import NoteCard from "@components/home/note_card";

interface NoteVaultProps {
  noteData: NoteData[];
}

interface NoteData {
  id: number,
  title: string,
  encrypted_password: string,
}

export default function NoteVault(props: NoteVaultProps) {
  return (
    <>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden max-h-96 border-2 pr-4 border-gray-200 shadow-md sm:rounded-lg">
        {props.noteData.map(data => (
          <NoteCard key={data.id} noteData={data} />
        ))}
      </div>
    </>
  );
}
