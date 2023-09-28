import React from "react";
import { PencilIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@components/ui/button";
import { PasswordCardDialog } from "./password-card-dialog";

interface PasswordCardProps {
  passwordData: {
    id: string;
    name: string;
  };
}

export default function PasswordCard(props: PasswordCardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center p-5 m-2 bg-white rounded-md shadow-lg w-full">
      <LockClosedIcon className="w-6 h-6 mr-4" />
      <div className="flex-grow text-left">
        <h3 className="text-xl font-bold">Name</h3>
        <p>Description here</p>
      </div>
      {/* Edit Modal */}
      {/* Password Card Dialog*/}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* Password Card  Button*/}
          <Button type="button" variant={"secondary"}>
            <PencilIcon className="w-5 h-5 mr-1" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editing {props.passwordData.name}</DialogTitle>
            <DialogDescription>
              <PasswordCardDialog open={open} setOpenDialog={setOpen} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
