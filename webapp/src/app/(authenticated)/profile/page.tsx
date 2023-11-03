"use client";

import { Separator } from "@components/ui/separator";
import { useEffect, useState, useRef } from "react";
import { Input } from "@components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@components/ui/toaster";
import { Copy } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import EditProfileForm from "@components/profile/profile-form";
import { useRouter } from "next/navigation";

export default function Profile() {
  const isCalled = useRef(false);

  const { toast } = useToast();
  const router = useRouter();
  // Dialog open UseState
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
  });

  // Copy Button Functionality
  function CopyButton(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setTimeout(() => {}, 2000); // Reset copied state after 2 seconds
        toast({
          title: "Copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      });
  }

  // Delete on delete button click
  function DeleteButton() {
    fetch(`/api/profile`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.ok) {
        toast({
          title: "User deleted",
        });
        router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
        });
      }
    });
  }

  // Fetch the data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/profile`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const json = await response.json();
        setData(json.profile);
        // Set the values of the input fields
        const emailFiled = document.getElementById("email");
        const fullNameField = document.getElementById("fullName");
        // set the value of the input fields if they are not null
        if (emailFiled !== null) emailFiled.setAttribute("value", json.profile.email);
        if (fullNameField !== null) fullNameField.setAttribute("value", json.profile.name);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        // Set the values of the input fields
        const emailFiled = document.getElementById("email");
        const fullNameField = document.getElementById("fullName");
        // set the value of the input fields if they are not null
        if (emailFiled !== null) emailFiled.setAttribute("value", "Error fetching data");
        if (fullNameField !== null) fullNameField.setAttribute("value", "Error fetching data");
      }
    };

    if (!isCalled.current) {
      fetchData();
    }

    // Cleanup function to abort fetch when component unmounts
    return () => {
      isCalled.current = true;
    };
  }, []); // The empty dependency array ensures the effect runs once on component mount

  return (
    <div className={"grow w-full flex justify-center items-center px-8"}>
      <section className="grow sm:w-1/2 w-5/6 max-w-md space-y-4">
        <h1 className={"text-2xl"}>My Profile</h1>
        <Separator className="my-4" />
        <div className={"px-2"}>
          <div className="w-full max-w-md gap-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <div className={"flex space-x-4"}>
              {/* Full name field*/}
              <Input readOnly type="text" id="fullName" placeholder="Retrieving full name ..." />
              <Button
                onClick={() => {
                  CopyButton(data.name);
                }}
                variant="outline"
                size="icon"
                className={"text-character-secondary"}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="w-full max-w-md gap-1.5">
            <Label htmlFor="email">Email</Label>
            <div className={"flex space-x-4"}>
              {/* Email field*/}
              <Input readOnly type="email" id="email" placeholder="Retrieving email ..." />
              <Button
                onClick={() => {
                  CopyButton(data.email);
                }}
                variant="outline"
                size="icon"
                className={"text-character-secondary"}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button type={"button"} className={"w-full mt-8 block"}>
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription className="text-character-secondary">Edit your profile information</DialogDescription>
                </DialogHeader>
                <EditProfileForm data={data} setOpenDialog={setOpen} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Separator className="my-4" />
        <div className={"p-2"}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type={"button"} variant={"destructive"} className={"w-full mt-8 block"}>
                Delete Button
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={DeleteButton}>DELETE</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
      <Toaster />
    </div>
  );
}
