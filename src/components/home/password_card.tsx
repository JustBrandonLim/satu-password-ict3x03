import React, { useEffect } from "react";
import {
  PencilIcon,
  LockClosedIcon,
  DocumentDuplicateIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordCardDialog } from "./password-card-dialog";
import { PasswordCardDetails } from "./password-card-details";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";

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
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [selectedModal, setSelectedModal] = React.useState("");
  const [decryptedPassword, setDecryptedPassword] = React.useState({
    password: "",
  });
  const { toast } = useToast() // Instatiate Toast for status feedback

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

  useEffect(() => {
    if (decryptedPassword.password !== "" && selectedModal === "dialog") {
      setOpenDialog(true);
    } else if (decryptedPassword.password !== "" && selectedModal === "details") {
      setOpenDetails(true);
    }
  }, [decryptedPassword]);

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

  function openPasswordDialog() {
    setSelectedModal("dialog");
    FetchPasswordData();
  }

  function openPasswordDetails() {
    setSelectedModal("details");
    FetchPasswordData();
  }

  return (
    <div
      className="flex items-center p-5 m-2 bg-white rounded-md shadow-lg w-full"
    >
      <LockClosedIcon className="w-6 h-6 mr-4" />
      <div className="flex-grow text-left">
        <h3 className="text-xl font-bold">{props.passwordData.title}</h3>
        <p>{props.passwordData.username}</p>
      </div>
      <button onClick={openPasswordDetails}>
        <EyeIcon className="w-6 h-6 mr-5" />
      </button>
      <button onClick={handleCopyPassword}>
        <DocumentDuplicateIcon className="w-6 h-6 mr-5" />
      </button>
      {/* Password Card  Button*/}
      <button onClick={openPasswordDialog}>
        <PencilIcon className="w-6 h-6 mr-2" />
      </button>
      {/* Edit Modal */}
      {/* Password Card Dialog*/}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editing {props.passwordData.title}</DialogTitle>
            <DialogDescription>
              <PasswordCardDialog
                open={openDialog}
                setOpenDialog={setOpenDialog}
                passwordData={props.passwordData}
                decryptedPassword={decryptedPassword}
                refreshPasswordVault={props.refreshPasswordVault}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Password Card Details*/}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.passwordData.title}</DialogTitle>
            <DialogDescription>
              <PasswordCardDetails
                open={openDetails}
                setOpenDetails={setOpenDetails}
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
