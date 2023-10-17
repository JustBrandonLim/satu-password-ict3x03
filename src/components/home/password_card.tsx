import React from "react";
import { PencilIcon, LockClosedIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PasswordCardDialog } from "./password-card-dialog";

interface PasswordCardProps {
  passwordData: {
    id: number;
    title: string;
    url: string;
    username: string;
    encryptedPassword: string;
  };
}

export default function PasswordCard(props: PasswordCardProps) {
  const [open, setOpen] = React.useState(false);

  // Function to decrypt the password
  async function fetchPassword() {
    try {
      const response = await fetch(
        `api/vault/retrieve/password?password=${props.passwordData.encryptedPassword}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        return json.password; // Return the decrypted password
      } else {
        throw new Error("Failed to fetch and decrypt the password");
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching password:", error);
      return null; // Return null in case of an error
    }
  }

  async function MockRetrievePassword() {
    let encryptedPassword = prompt("Enter encrypted password!");

    const checkResponse = await fetch(`api/vault/retrieve/password?password=${encryptedPassword}`, {
      method: "GET",
    });

    if (checkResponse.ok) {
      alert(JSON.stringify(await checkResponse.json()));
    }else{
      alert(checkResponse.status);
    }
  }

  // Copy text to the clipboard
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (error) {
      console.error("Error copying text to the clipboard:", error);
    }
  }

  async function handleCopyPassword() {
    try {
      const decryptedPassword = await fetchPassword();
      MockRetrievePassword();
      // if (decryptedPassword) {
      //   await copyToClipboard(decryptedPassword);
      //   alert("Copied to clipboard!");
      // } else {
      //   alert("No password to copy.");
      // }
    } catch (error) {
      console.error("Error copying text to the clipboard:", error);
    }
  }
  

  return (
    <div className="flex items-center p-5 m-2 bg-white rounded-md shadow-lg w-full">
      <LockClosedIcon className="w-6 h-6 mr-4" />
      <div className="flex-grow text-left">
        <h3 className="text-xl font-bold">{props.passwordData.title}</h3>
        <p>{props.passwordData.username}</p>
      </div>
      <button onClick={handleCopyPassword}>
        <DocumentDuplicateIcon className="w-6 h-6 mr-5" />
      </button>
      {/* Edit Modal */}
      {/* Password Card Dialog*/}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* Password Card  Button*/}
          <button>
            <PencilIcon className="w-6 h-6 mr-2" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editing {props.passwordData.title}</DialogTitle>
            <DialogDescription>
              <PasswordCardDialog
                open={open}
                setOpenDialog={setOpen}
                passwordData={props.passwordData}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
