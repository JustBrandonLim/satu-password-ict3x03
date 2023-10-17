"use client"; // This is a client component

import { useState, useEffect, useRef } from "react";
import PasswordVault from "@components/home/password_vault";
import NoteVault from "@components/home/note_vault";

export default function Vault() {
  const [passwordData, setPasswordData] = useState([]);

  const [noteData, setNoteData] = useState([]);
  const [featureDisplay, setFeatureDisplay] = useState(0);

  useEffect(() => {
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

    const FetchData = async () => {
      await FetchPasswordData();
      await FetchNotesData();
    };

    FetchData();
  }, []);

  const PageDisplay = () => {
    switch (featureDisplay) {
      case 0:
        // Return the component or content for 'Password'
        return <PasswordVault passwordData={passwordData} />;
      case 1:
        // Return the component or content for 'Secure Note'
        return <NoteVault noteData={noteData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-2 w-2/3 mx-auto">
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
    </div>
  );
}
