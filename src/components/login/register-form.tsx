"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation";
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

// Define Schemas that are used to call to api
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

  // For Login Form
  const registerForm = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
  })
  const onRegister = async (data: z.infer<typeof RegisterFormSchema>) => {
    // For Debugging
    console.log("Register Form Submitted")
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
        console.log(json);
        toast({
          variant: "default",
          title: "Success!!",
          description: json.otpUrl,
        })
      }
      else{
        console.log(response)
        console.log(json);
        // router.push("/");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: json.message,
        })
      }
  }

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onRegister)} className="w-2/3 space-y-6">
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
        <Button type="submit" className="w-full">Sign up</Button>
      </form>
      <p className="mt-8 font-medium text-center text-sm pb-5 text-black">
        Already have an account?{" "}
        <Link href={"/"} className="text-blue-500 hover:underline">Login</Link>
      </p>
      <Toaster />
    </Form>
  )
}
export default RegsiterForm;