"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React from "react";
import { Eye, EyeOff } from "lucide-react";

// Define Schemas that are used to call to api
const LoginFormSchema = z.object({
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
  confirmPassword: z.string({
    required_error: "Please confirm your password",
    invalid_type_error: "Email must be a string",
  }),
  rememberEmail: z.boolean().optional(),
})

const RecoverFormSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  })
  .email('Invalid Email')
})

// The actual component
function LoginForm() {
  const router = useRouter();
  // Maintain Password Visibility State
  const [showPassword, setShowPassword] = React.useState(false)

  // For Login Form
  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
  })
  const onLogin = async (data: z.infer<typeof LoginFormSchema>) => {
    // For Debugging
    console.log("Login Form Submitted")
    console.log(data)
    console.log(typeof data)
    let email = data.email
    let password = data.password

    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, type: "administrator" }),
    });
    const json = await response.json();

    if (!response.ok) {
      console.log(json);
    }
    if (response.ok) {
      router.push("/home");
    }
  }

  // For Recover Form (in dialog)
  const recoverForm = useForm<z.infer<typeof RecoverFormSchema>>({
    resolver: zodResolver(RecoverFormSchema),
  })
  const onRecover = async (data: z.infer<typeof RecoverFormSchema>) => {
    // For Debugging
    console.log("Recover Form Submitted")
    console.log(data)
    console.log(typeof data)
  }

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onLogin)} className="w-2/3 space-y-6">
        <FormField control={loginForm.control}
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
        <FormField control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input placeholder="Enter Password" type={showPassword?'text':'password'} {...field}/>
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
          <div className="flex justify-between px-1 ">
            <FormField control={loginForm.control}
            name="rememberEmail"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Remember Me
                  </FormLabel>
                </div>
              </FormItem>
            )}/>
            <Dialog>
              <DialogTrigger className="text-character-secondary text-sm hover:underline">Forgot your password?</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Recover your account</DialogTitle>
                    <DialogDescription>
                      Please enter in your email address that is associated with your account
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...recoverForm}>
                    <form onSubmit={recoverForm.handleSubmit(onRecover)} className="w-full space-y-3">
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
                      <FormDescription>
                        A recovery email will be sent if such an account exists
                      </FormDescription> 
                      <Button type="submit" className="w-full">Recover</Button>
                    </form>
                  </Form>
                </DialogContent>
            </Dialog>
          </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>
      <p className="mt-8 font-medium text-center text-sm pb-5 text-black">
        New to SatuPassword?{" "}
        <Link href={"/register"} className="text-blue-500 hover:underline">Sign up</Link>
        {/* <span className=" text-blue-500 hover:underline"
          onClick={() => {router.push("/register");}}>{" "}Sign Up{" "}
        </span> */}
      </p>
    </Form>
  )
}
export default LoginForm;