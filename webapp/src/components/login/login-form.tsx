"use client"

import React, { useState } from "react";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster } from "../ui/toaster";
import { useToast } from "../ui/use-toast";

// Login Form Schemas
const formSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email('Invalid Email'),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .min(8, {
    message: "Password should be at least 8 characters"
  })
  .max(64, {message: "Password can not exceed 64 characters"})
  .regex(new RegExp(/^\S*$/), "Password cannot contain spaces"),
  otp: z.string({
    required_error: "OTP is required",
  })
  .min(6, "OTP must have 6 numbers")
  .length(6, "OTP must have 6 numbers")
  .regex(new RegExp("^[0-9]*$"), "OTP can only contain numbers"),
  rememberMe: z.boolean().optional(),
})

// Recover Account Schema
const RecoverFormSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  })
  .email('Invalid Email')
})

// MAIN Component Code
function LoginForm() {
  const router = useRouter(); // Instantiate router for routing to other pages later
  const { toast } = useToast() // Instantiate Toast for status feedback
  const [isLoading, setIsLoading] = useState(false) //used to maintain loading state
  // Define and Instantiate Login Form
  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
        password: "",
        otp: "",
        rememberMe: false,
    },
  })
  // Handle login form submit
  async function onLoginSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log("Login Form Submitted");
    setIsLoading(true)
    console.log(data);
    let email = data.email;
    let password = data.password;
    let otp = data.otp;

    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, otp }),
    });
    const json = await response.json();

    // DEBUG RESPONSE
    console.log("DEBUG")
    console.log(response)
    console.log(json)
    // Catch HTTP Response Errors
    if (!response.ok) {
      console.log(response);
      const responseError = Response.error();
      toast({
        variant: "destructive",
        title: "Error",
        description: `Request Error: ${response.status} ${response.statusText}, ${responseError.body}`
      })
    }
    else{
      console.log(response)
      console.log(json)
      toast({
        variant: "default",
        title: "Success!",
        description: `${json.message}`
      })
      router.push("/home");
        router.refresh()
    }
    setIsLoading(false)
  }

  // Define and Instantiate RECOVER Form
  const recoverForm = useForm<z.infer<typeof RecoverFormSchema>>({
    resolver: zodResolver(RecoverFormSchema),
    defaultValues: {
        email: "",
    }
  })
  // Handle RECOVER form submit
  const onRecover = async (data: z.infer<typeof RecoverFormSchema>) => {
    setIsLoading(true)
    // For Debugging
    console.log("Recover Form Submitted")
    console.log(data)
    console.log(typeof data)
    setTimeout(()=>{setIsLoading(false)}, 1000);
  }

  // Maintain Password Visibility State
  const [showPassword, setShowPassword] = React.useState(false)
  // To handle Password Field, removing spaces
  const handlePassword = (event: React.FormEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value
    .replace(/\s/g, ""); // Remove spaces
  };

  // To handle OTP Field, removing non-numerical characters
  const handleOTP = (event: React.FormEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value
      .replace(/[^0-9.]/g, "") // Remove non-numeric characters except '.'
      .replace(/(\..*)\./g, "$1"); // Remove extra '.' characters
  };

  return (
    <div className="sm:w-2/3 w-5/6 ">
      <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField control={loginForm.control}
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
         {/* Password Field */}
         <FormField control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input placeholder="Enter Password" type={showPassword?'text':'password'} {...field} maxLength={64} onInput={handlePassword}/>
                  <Button variant="ghost" type="button" size='icon' className="absolute right-0 bottom-0" aria-label="Toggle Passowrd Visibility" onClick={() => {setShowPassword(!showPassword)}}>
                    <Eye className="absolute text-slate-400" visibility={showPassword? 'visible':'hidden'}/>
                    <EyeOff className="absolute text-slate-300" visibility={showPassword? 'hidden':'visible'}/>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
            )}
          />
          {/* OTP Field */}
          <FormField control={loginForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One Time Password (OTP)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter OTP" type="text" inputMode="numeric" maxLength={6} onInput={handleOTP}{...field} />
                </FormControl>
                <FormDescription className="text-character-secondary">
                  Check your Authenticator app
                </FormDescription>
                <FormMessage />
              </FormItem> 
            )}
          />
          {/* Remember Me Checkbox */}
          <div className="flex justify-between px-1 pb-8">
            <FormField control={loginForm.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Remember Me
                  </FormLabel>
                </div>
              </FormItem>
            )}/>
            {/* Forget and Recover Password Dialog */}
            <Dialog>
              <DialogTrigger className="text-character-secondary text-sm hover:underline">Forgot your password?</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Recover your account</DialogTitle>
                    <DialogDescription className="text-character-secondary">
                      Please enter in your email address associated with your account
                    </DialogDescription>
                  </DialogHeader>
                  {/* Recover Form */}
                  <Form {...recoverForm}>
                    <form className="w-full space-y-3" >
                      {/* Recover Email Field */}
                      <FormField
                        control={recoverForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormDescription className="text-character-secondary">
                        A recovery email will be sent if such an account exists
                      </FormDescription> 
                      {/* Revere Form Submit */}
                      <Button type="button" className={`w-full ${isLoading ? 'hidden' : ''}`} onClick={recoverForm.handleSubmit(onRecover)}>Recover</Button>
                      <Button disabled className={`w-full ${isLoading ? '' : 'hidden'}`}>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
            </Dialog>
          </div>
          {/* Login Button */}
        <Button type="submit" className={`w-full ${isLoading ? 'hidden' : ''}`}>Login</Button>
        <Button disabled className={`w-full ${isLoading ? '' : 'hidden'}`}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      </form>
      <p className="mt-16 font-medium text-center text-sm pb-5 text-black">
        New to SatuPassword?{"   "}
        <Link href={"/register"} className="text-blue-500 hover:underline">Sign up</Link>
      </p>
    </Form>
     {/* Submit Status Toast */}
     <Toaster />
    </div>
  )
}
export default LoginForm;