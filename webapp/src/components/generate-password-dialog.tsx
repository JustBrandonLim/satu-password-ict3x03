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
import React, { Dispatch, SetStateAction } from "react"
import { Eye, EyeOff, RefreshCcw } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const generatePasswordFormSchema = z.object({
    password: z.string(),
    uppercase: z.boolean(),
    lowercase: z.boolean(),
    numerical: z.boolean(),
    symbols: z.boolean(),
    passwordLength: z.coerce.number({
        required_error: "Length of password is required",})
        .min(8, {message: 'Password length must be at least 8'})
        .lte(64)})

  interface GeneratePasswordFormProps {
    updatePasswordCallback: (data: string) => void; // Callback function for passing data to the parent
    // setOpenDialog: (value: boolean | ((prevVar: boolean) => boolean)) => void;
    setOpenDialog : Dispatch<SetStateAction<boolean>>
  }
  
const GeneratePasswordForm: React.FC<GeneratePasswordFormProps> = ({updatePasswordCallback,setOpenDialog}) => {
    // For password visibility
    const [showPassword, setShowPassword] = React.useState(false)

    // To handle Password Field, removing spaces
    const handlePassword = (event: React.FormEvent<HTMLInputElement>) => {
        const inputElement = event.target as HTMLInputElement;
        inputElement.value = inputElement.value
        .replace(/\s/g, ""); // Remove spaces
    };

    // 1. Define your form.
    const generatePasswordForm = useForm<z.infer<typeof generatePasswordFormSchema>>({
        resolver: zodResolver(generatePasswordFormSchema),
        defaultValues: {
            password: "",
            passwordLength: 12,
            uppercase: false,
            lowercase: false,
            numerical: false,
            symbols: false,
        },
    })
    // 2. Define a submit handler.
    function onGenerate(data: z.infer<typeof generatePasswordFormSchema>) {
        // Do something with the form values.This will be type-safe and validated.
        data.passwordLength = parseInt(data.passwordLength.toString());
        console.log(data)
    }

    //Triggers the callback function when UsePassword Button is triggered
    function handleUsePassword(){
    let generatedPassword = generatePasswordForm.getValues('password')
    updatePasswordCallback(generatedPassword)
    }

    //The HTML elements
    return(
    <Form {...generatePasswordForm}>
        <form onSubmit={generatePasswordForm.handleSubmit(onGenerate)} className="space-y-6">
             {/*Password Items Row*/}
            <div className="flex w-full items-end space-x-2 mt-4">
                {/* Password Field */}
                <FormField
                control={generatePasswordForm.control}
                name="password"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <div className="flex w-full space-x-4">
                            <div className="relative w-full">
                                <Input placeholder="Generate password button ->" type={showPassword?'text':'password'} {...field} onInput={handlePassword}/>
                                <Button variant="ghost" type="button" size='icon' className="absolute right-0 bottom-0" aria-label="Toggle Password Visibility" onClick={() => {setShowPassword(!showPassword)}}>
                                    <Eye className="absolute text-slate-400" visibility={showPassword? 'visible':'hidden'}/>
                                    <EyeOff className="absolute text-slate-300" visibility={showPassword? 'hidden':'visible'}/>
                                </Button>
                            </div>
                            <Button variant={'default'} type="button" size={'icon'} aria-label="Generate New Password" className="p-2" onClick={generatePasswordForm.handleSubmit(onGenerate)}>
                                <RefreshCcw/>
                            </Button>
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
         {/*Generate Password Options*/}
        <div className="flex justify-between px-2 h-2">
            <FormField
                control={generatePasswordForm.control}
                name="uppercase"
                render={({ field }) => (
                <FormItem className="flex items-end space-x-2">
                    <FormControl>
                        <Checkbox id="Uppercase" onCheckedChange={field.onChange}/>
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">A-Z</FormLabel>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={generatePasswordForm.control}
                name="lowercase"
                render={({ field }) => (
                <FormItem className="flex items-end space-x-2">
                    <FormControl>
                    <Checkbox id="Lowercase" onCheckedChange={field.onChange}/>
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">a-z</FormLabel>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={generatePasswordForm.control}
                name="numerical"
                render={({ field }) => (
                <FormItem className="flex items-end space-x-2">
                    <FormControl>
                    <Checkbox id="numerical" onCheckedChange={field.onChange}/>
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">0-9</FormLabel>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={generatePasswordForm.control}
                name="symbols"
                render={({ field }) => (
                <FormItem className="flex items-end space-x-2">
                    <FormControl>
                    <Checkbox id="symbol" onCheckedChange={field.onChange}/>
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Symbols</FormLabel>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        {/* Generate Password Length */}
        <FormField
            control={generatePasswordForm.control}
            name="passwordLength"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>Length of password</FormLabel>
                    <FormControl>
                    <div className="flex space-x-8">
                        <Input min={8} max={64} placeholder="Enter number"  {...field} type="number" />
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex space-x-4 w-full">
            <Button type="reset" variant={'outline'} className="w-full" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="button" className="w-full" onClick={() => {handleUsePassword(); setOpenDialog(false)}}>
                Use Password
            </Button>
        </div>
        </form>
    </Form>
    )
}
GeneratePasswordForm.displayName = "GeneratePasswordForm"
export{GeneratePasswordForm}