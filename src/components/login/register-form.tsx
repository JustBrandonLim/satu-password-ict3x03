"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PasswordSection } from "../password-section";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";
import {QRCodeSVG} from 'qrcode.react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Loader2 } from "lucide-react";

// Schemas
const RegisterFormSchema = z.object({
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

// The actual component
function RegsiterForm() {
  const router = useRouter();
  const { toast } = useToast()
  const [showQR, setShowQR] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  //To get client window width for QR code size
  const [QRWidth, setQRWidth] = useState(200);
  const [QRValue, setQRValue] = useState("https://www.youtube.com/watch?v=Tt7bzxurJ1I&list=PL_lmLuli5dOtfis_RpuGzXNRNJKzHq8se&index=81");
  useEffect(function mount() {
    // browser code
    const portrait = window.matchMedia("(orientation: portrait)").matches;
    const hasWindow = typeof window !== 'undefined';
    var width = hasWindow ? window.innerWidth : Number()
    if (portrait){
      setQRWidth(width/2)
    }
    else{
      setQRWidth(width/4)
    }
  });

  // For Login Form
  const registerForm = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
  })
  
  const onRegister = async (data: z.infer<typeof RegisterFormSchema>) => {
    // For Debugging
    console.log("Register Form Submitted")
    setIsLoading(true)
    console.log(data)
    console.log(typeof data)
    let name = data.name
    let email = data.email
    let password = data.password

    const response = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, type: "administrator" }),
      });
      const json = await response.json();
  
      if ((response.ok) && (json.otpUrl!=null))  {
        setIsLoading(false)
        console.log(json);
        toast({
          variant: "default",
          title: "Success!!",
          description: "Opening QR Code..." + json.otpUrl,
        })
        setQRValue(json.otpUrl)
        setShowQR(true)
      }
      else{
        setIsLoading(false)
        console.log(response)
        console.log(json);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: json.message,
        })
      }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onRegister)} className="sm:w-2/3 w-5/6 space-y-6">
        {/* Full name field */}
        <FormField
          control={registerForm.control}
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
          control={registerForm.control}
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
        {/* Password fieldsss */}
        <PasswordSection/>
        {/* Sign up Button */}
        <Button type="submit" className={`w-full ${isLoading ? 'hidden' : ''}`}>Sign up</Button>
        <Button disabled className={`w-full ${isLoading ? '' : 'hidden'}`}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      </form>
      <p className="mt-8 font-medium text-center text-sm pb-5 text-black">
        Already have an account?{" "}
        <Link href={"/"} className="text-blue-500 hover:underline">Login</Link>
      </p>
    </Form>
    {/* Submit Status Toast */}
    <Toaster />
    {/* QR Code Dialog */}
    <Dialog open={showQR} onOpenChange={setShowQR}>
      <DialogTrigger asChild className="">
        <Button type="button">DEBUGGIN ONLY: Open QR</Button>
      </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>2FA: DO NOT CLOSE OR REFRESH</DialogTitle>
            <DialogDescription className="text-character-secondary">
              <text>
              You will <span className="font-black">NOT</span> be able to log in if you lose it. <br/>
              <span className="font-black">Scan</span> the <span className="font-black">QR Code</span> with your preferred Authenticator app.
              </text>
            </DialogDescription>
          </DialogHeader>
            <QRCodeSVG value={QRValue} size={QRWidth} className="w-full p-4"/>   
            <Button type="button" onClick={() => {router.push("/");}}>I've configured my Authenticator app</Button>         
        </DialogContent>
    </Dialog>
    </div>    
  )
}
export default RegsiterForm;