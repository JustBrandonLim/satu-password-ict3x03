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


// Define Schemas that are used to call to api
const RegisterFormSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required",
  }).email('Invalid Email'),
  password: z.string().min(1, {
    message: "Password is required"
  }).min(8, {
    message: "Password should be at least 8 characters"
  }),
  confirmPassword: z.string().min(1, "Password confirmation is required")
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Password do not match'
})

// The actual component
function TestForm() {
  const router = useRouter();

  // For Login Form
  const registerForm = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
  })
  const onRegister = async (data: z.infer<typeof RegisterFormSchema>) => {
    // For Debugging
    console.log("Register Form Submitted")
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
        router.push("/");
      }
  }

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onRegister)} className="w-2/3 space-y-6">
        <FormField
          control={registerForm.control}
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
        <PasswordSection control={registerForm.control}/>
        <Button type="submit" className="w-full">Sign up</Button>
      </form>
      <p className="mt-8 font-medium text-center text-sm pb-5 text-black">
        Already have an account?{" "}
        <Link href={"/"} className="text-blue-500 hover:underline">Login</Link>
      </p>
    </Form>
  )
}
export default TestForm;