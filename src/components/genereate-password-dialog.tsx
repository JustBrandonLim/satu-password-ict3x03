"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import React from "react"
import { Eye, EyeOff, RefreshCcw } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const genereatePasswordFormSchema = z.object({
    password: z.string().min(2, {
        message: "Password must be at least 8 characters.",}),
    uppercase: z.boolean().optional(),
    lowercase: z.boolean().optional(),
    numerical: z.boolean().optional(),
    symbols: z.boolean().optional(),
    minNumber: z.coerce.number().min(1, {
        message: "Minimum Numericals Required"}).lte(64),
    passwordLength: z.coerce.number().min(8, {
        message: 'Password length must be at least 8'
    }).lte(64)}).refine((data) => data.minNumber <= data.passwordLength, {
    path: ['minNumber'],
    message: 'Number of numericals must be less than the password length'
  })

export function GeneratePasswordForm() {
  // 1. Define your form.
  const genereatePasswordForm = useForm<z.infer<typeof genereatePasswordFormSchema>>({
    resolver: zodResolver(genereatePasswordFormSchema),
    defaultValues: {
      password: "",
    },
  })
  // 2. Define a submit handler.
  function onGenereate(data: z.infer<typeof genereatePasswordFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    data.minNumber = parseInt(data.minNumber.toString());
    data.passwordLength = parseInt(data.passwordLength.toString());
    console.log(data)
  }
  // For password visiblity
  const [showPassword, setShowPassword] = React.useState(false)
  
  return (
    <Form {...genereatePasswordForm}>
      <form onSubmit={genereatePasswordForm.handleSubmit(onGenereate)} className="space-y-6">
        {/* Password Items Row */}
        <div className="flex w-full items-end space-x-2 mt-4">
            {/* Password Field */}
            <FormField
                control={genereatePasswordForm.control}
                name="password"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <div className="flex w-full space-x-4">
                            <div className="relative w-full">
                                <Input placeholder="Generate password button ->" type={showPassword?'text':'password'} {...field}/>
                                <Button variant="ghost" type="button" size='icon' className="absolute right-0 bottom-0" aria-label="Toggle Passowrd Visibility" onClick={() => {setShowPassword(!showPassword)}}>
                                    <Eye className="absolute text-slate-400" visibility={showPassword? 'visible':'hidden'}/>
                                    <EyeOff className="absolute text-slate-300" visibility={showPassword? 'hidden':'visible'}/>
                                </Button>
                            </div>
                            <Button variant={'default'} type="button" size={'icon'} aria-label="Genereate New Password" className="p-2" onClick={genereatePasswordForm.handleSubmit(onGenereate)}>
                                <RefreshCcw />
                            </Button>
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {/* Genereate Password Trigger */}
            
        </div>
        <div className="flex justify-between px-2 h-2">
            <FormField
                control={genereatePasswordForm.control}
                name="uppercase"
                render={({ field }) => (
                <FormItem className="flex items-end space-x-2">
                    <FormControl>
                    <Checkbox id="Uppercase" />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">A-Z</FormLabel>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={genereatePasswordForm.control}
                name="lowercase"
                render={({ field }) => (
                <FormItem className="flex items-end space-x-2">
                    <FormControl>
                    <Checkbox id="Lowercase" />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">a-z</FormLabel>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={genereatePasswordForm.control}
                name="numerical"
                render={({ field }) => (
                <FormItem className="flex items-end space-x-2">
                    <FormControl>
                    <Checkbox id="numerical" />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">0-9</FormLabel>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={genereatePasswordForm.control}
                name="symbols"
                render={({ field }) => (
                <FormItem className="flex items-end space-x-2">
                    <FormControl>
                    <Checkbox id="symbol" />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Symbols</FormLabel>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
    
        <FormField
            control={genereatePasswordForm.control}
            name="passwordLength"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>Length of password</FormLabel>
                    <FormControl>
                    <div className="flex space-x-8">
                        <Input min={8} max={64} defaultValue={12} placeholder="Enter number"  {...field} type="number"/>
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex space-x-4 w-full">
            <Button type="reset" variant={'outline'} className="w-full">Cancel</Button> 
            <Button type="button" className="w-full">Use Password</Button>
        </div>
      </form>
    </Form>
  )
}
