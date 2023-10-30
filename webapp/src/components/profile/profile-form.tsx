"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {Dispatch, SetStateAction, useState} from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { PasswordSection } from "@components/password-section";
import { useToast } from "@components/ui/use-toast";
import {Loader2} from "lucide-react";
import * as React from "react";

interface ProfileFormProps {
    data: {
        email: string;
        password: string;
        name: string;
    };
    setOpenDialog?: Dispatch<SetStateAction<boolean>>
}

// Schemas
const ProfileFormSchema = z.object({
    name: z.string({
        required_error: "Full name is required",
        invalid_type_error: "Full name must be a string"
    }),
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email('Please enter in a valid email format'),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    })
        .min(8, {message: "Password should be at least 8 characters"})
        .max(64, {message: "Password can not exceed 64 characters"})
        .regex(new RegExp(/^\S*$/), "Password cannot contain spaces"),
    confirmPassword: z.string({
        required_error: "Please confirm your password",
        invalid_type_error: "Email must be a string",
    })
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match'
})

// The actual component. Pass in data prop to prefill the form
function EditProfileForm({ data, setOpenDialog }: ProfileFormProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    // For Login Form
    const editProfileForm = useForm<z.infer<typeof ProfileFormSchema>>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            name: data.name,
            email: data.email,
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof ProfileFormSchema>) => {
        let name: string = data.name
        let email: string = data.email
        let password: string = data.password

        const response = await fetch(`/api/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const json = await response.json();

        if ((response.ok) && (json.otpUrl!=null))  {
            setIsLoading(false)
            console.log(json);
            toast({
                variant: "default",
                title: "Success!!",
            })
        }
        else{
            console.log(response)
            console.log(json);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: json.message,
            })
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full flex flex-col items-center">
            <Form {...editProfileForm}>
                <form onSubmit={editProfileForm.handleSubmit(onSubmit)} className="w-full px-4 space-y-6">
                    {/* Full name field */}
                    <FormField
                        control={editProfileForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Full name" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Email field */}
                    <FormField
                        control={editProfileForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Email" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Password field */}
                    <PasswordSection/>
                    {/* Submit Button */}
                    <div className={"flex space-x-4 justify-end"}>
                        <Button onClick={() => setOpenDialog ? setOpenDialog(false) :{}}
                                type={"button"} variant={"outline"} className={"w-24"}>
                            Cancel
                        </Button>
                        <Button type="submit" className={`w-24 ${isLoading ? 'hidden' : ''}`}>Save</Button>
                        <Button disabled className={`w-24 ${isLoading ? '' : 'hidden'}`}>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    </div>
                </form>
            </Form>
            {/* Submit Status Toast */}
        </div>
    )
}
export default EditProfileForm;