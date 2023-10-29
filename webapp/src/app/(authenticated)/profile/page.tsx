"use client"

import {Separator} from "@components/ui/separator";
import React, {useEffect, useState} from "react";
import {Input} from "@components/ui/input";
import { Label } from "@/components/ui/label"
import {Button} from "@components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import {Toaster} from "@components/ui/toaster";
import {Eye, EyeOff, Copy} from "lucide-react";
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
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@components/ui/dialog";
import EditProfileForm from "@components/profile/profile-form";

export default function Profile() {
    const {toast} = useToast();
    // Dialog open UseState
    const [open, setOpen] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [data, setData] = useState({
        email: "",
        password: "",
        name: "",
    });

    // Copy Button Functionality
    function CopyButton(text: string) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Copied to clipboard');
                setTimeout(() => {}, 2000); // Reset copied state after 2 seconds
                toast({
                    title: "Copied to clipboard",
                })
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                toast({
                    variant: "destructive",
                    title: "Something went wrong",
                })
        });
    }

    // Fetch the data from the API on component mount
    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/profile`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    signal: abortController.signal,
                });

                // if (!response.ok) {
                //     throw new Error(`HTTP error! status: ${response.status}`);
                // }

                const json = await response.json();
                setData(json);
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData().then(() => console.log("Fetched data"));
        // Cleanup function to abort fetch when component unmounts
        return () => {
            abortController.abort();
        };
    }, []); // The empty dependency array ensures the effect runs once on component mount

    return (
        <div className={"grow w-full flex justify-center items-center px-16"}>
            <section className="grow sm:w-1/2 w-5/6 max-w-md space-y-4">
                <h1 className={"text-2xl"}>My Profile</h1>
                <Separator className="my-4"/>
                <div className={"px-2"}>
                    <div className="w-full max-w-md gap-1.5">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className={"flex space-x-4"}>
                            {/* Full name field*/}
                            <Input defaultValue={data.name} readOnly type="text" id="fullName" placeholder="Failed to fetch full name" />
                            <Button onClick={()=>{CopyButton(data.name)}} variant="outline" size="icon" className={"text-character-secondary"}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full max-w-md gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <div className={"flex space-x-4"}>
                            {/* Email field*/}
                            <Input defaultValue={data.email} readOnly type="email" id="email" placeholder="Failed to fetch email" />
                            <Button onClick={()=>{CopyButton(data.email)}} variant="outline" size="icon" className={"text-character-secondary"}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full max-w-md gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <div className={"flex space-x-4"}>
                            <div className={"relative w-full"}>
                                {/* Password field*/}
                                <Input defaultValue={data.password} id='password' placeholder="Failed to fetch password" readOnly type={showPassword?'text':'password'} maxLength={64} />
                                {/* Visibility Toggle Button*/}
                                <Button variant="ghost" type="button" size='icon' className="absolute right-0 bottom-0" aria-label="Toggle Passowrd Visibility" onClick={() => {setShowPassword(!showPassword)}}>
                                    <Eye className="absolute text-slate-400" visibility={showPassword? 'visible':'hidden'}/>
                                    <EyeOff className="absolute text-slate-300" visibility={showPassword? 'hidden':'visible'}/>
                                </Button>
                            </div>
                            <Button onClick={()=>{CopyButton((data.password))}} variant="outline" size="icon" className={"text-character-secondary"}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button type={"button"} className={"w-full mt-8 block"}>Edit Profile</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription className="text-character-secondary">
                                        Edit your profile information
                                    </DialogDescription>
                                </DialogHeader>
                                <EditProfileForm data={data} setOpenDialog={setOpen}/>
                            </DialogContent>
                        </Dialog>
                    </div>

                </div>
                <Separator className="my-4"/>
                <div className={"p-2"}>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type={"button"} variant={"destructive"} className={"w-full mt-8 block"}>Delete Button</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </section>
            <Toaster/>
        </div>
    );
}
