import React from "react";
import {Copy, Pencil, Eye, FileLock2} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordViewEditCard } from "./password-view-edit-dialog";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";
import {Button} from "@components/ui/button";

interface PasswordCardProps {
  passwordData: {
    id: number;
    title: string;
    url: string;
    username: string;
    encryptedPassword: string;
  };
  refreshPasswordVault: () => void;
}

export default function PasswordCard(props: PasswordCardProps) {
  const [dialogViewMode, setDialogViewMode] = React.useState(false)
  const [openDialog, setOpenDialog] = React.useState(false);
  const [decryptedPassword, setDecryptedPassword] = React.useState({password: "",});
  const { toast } = useToast() // Instantiate Toast for status feedback

  // Function to decrypt the note
  const FetchPasswordData = async () => {
    const response = await fetch(
      `api/vault/retrieve/password?password=${props.passwordData.encryptedPassword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    if (response.ok) {
      setDecryptedPassword(json);
    } else {
      console.log(json);
    }
  };


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
        return new Error("Failed to fetch and decrypt the password");
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching password:", error);
      return null; // Return null in case of an error
    }
  }

  // Copy text to the clipboard
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        variant: "default",
        title: "Password Copied!",
        description: `Password successfully copied to the clipboard!`
      })
    } catch (error) {
      console.error("Error copying text to the clipboard:", error);
    }
  }

  async function handleCopyPassword() {
    try {
      const decryptedPassword = await fetchPassword();
      if (decryptedPassword) {
        await copyToClipboard(decryptedPassword);
      } else {
        toast({
          variant: "destructive",
          title: "Password copy failed",
          description: `No password to copy!`
        })
      }
    } catch (error) {
      console.error("Error copying text to the clipboard:", error);
    }
  }

  return (
    <div className="flex items-center p-5 m-2 bg-white rounded-md shadow-lg w-full">
      <FileLock2 className="mr-4" />
      <div className="flex-grow text-left">
        <h2 className="text-lg font-medium">{props.passwordData.title}</h2>
        <p className={"text-sm text-character-secondary"}>{props.passwordData.username}</p>
      </div>
      {/* Right Action Buttons for Password List Cards*/}
      <div className={"flex space-x-1 text-character-secondary"}>
        <Button
          onClick={()=>{
            FetchPasswordData().then(() => {
              setDialogViewMode(true)
              setOpenDialog(true)
            })
          }}
          size={"icon"}
          variant={"ghost"}>
          <Eye/>
        </Button>
        <Button
            onClick={()=>{
              FetchPasswordData().then(() => {
                setDialogViewMode(false)
                setOpenDialog(true)
              })
            }}
            size={"icon"}
            variant={"ghost"}>
          <Pencil/>
        </Button>
        <Button onClick={handleCopyPassword} size={"icon"} variant={"ghost"}>
          <Copy/>
        </Button>
      </div>
      {/* Password Card Details*/}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.passwordData.title}</DialogTitle>
            <DialogDescription>
              <PasswordViewEditCard
                viewMode={dialogViewMode}
                open={openDialog}
                setOpenDetails={setOpenDialog}
                passwordData={props.passwordData}
                decryptedPassword={decryptedPassword}
                refreshPasswordVault={props.refreshPasswordVault}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
