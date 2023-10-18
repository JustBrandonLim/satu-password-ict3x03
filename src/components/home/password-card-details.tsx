"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordSection } from "@components/password-section";
import { Input } from "@components/ui/input";
import { useForm } from "react-hook-form";
import React, { Dispatch, SetStateAction } from "react";

interface PasswordCardDetailsProps {
  passwordData: {
    id: number;
    title: string;
    url: string;
    username: string;
    encryptedPassword: string;
  };
  open: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const PasswordCardDetailsSchema = z.object({
  url: z.string({
    required_error: "URL is required",
    invalid_type_error: "URL must be a string",
  }),
  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string",
  }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, { message: "Password should be at least 8 characters" })
    .max(64, { message: "Password cannot exceed 64 characters" })
    .regex(new RegExp(/^\S*$/), "Password cannot contain spaces"),
  confirmPassword: z.string({
    required_error: "Please confirm your password",
    invalid_type_error: "Password must be a string",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

const PasswordCardDetails: React.FC<PasswordCardDetailsProps> = ({
  setOpenDialog,
  passwordData,
}) => {
  const passwordCardForm = useForm<z.infer<typeof PasswordCardDetailsSchema>>({
    resolver: zodResolver(PasswordCardDetailsSchema),
    defaultValues: {
      url: passwordData.url,
      username: passwordData.username,
    },
  });

  const onSavePasswordCard = async (data: z.infer<typeof PasswordCardDetailsSchema>) => {
    // For Debugging
    console.log("Form Submitted");
    console.log(data);
    console.log(typeof data);
    let url = data.url;
    let username = data.username;
    let password = data.password;
  };

  //The HTML elements
  return (
    <Form {...passwordCardForm}>
      <form
        onSubmit={passwordCardForm.handleSubmit(onSavePasswordCard)}
        className="space-y-6"
      >
        {/* URL Items Row */}
        <div className="flex w-full items-end space-x-2 mt-4">
          {/* URL Field */}
          <FormField
            control={passwordCardForm.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full text-left">
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <div className="flex w-full space-x-4">
                    <div className="relative w-full">
                      <Input placeholder="Website URL" type="url" {...field} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Username Items Row */}
        <div className="flex w-full items-end space-x-2 mt-4">
          {/* Username Field */}
          <FormField
            control={passwordCardForm.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full text-left">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="flex w-full space-x-4">
                    <div className="relative w-full">
                      <Input
                        placeholder="Input your Username here"
                        type="username"
                        {...field}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Generate Password Component*/}
        <PasswordSection/>
        <div className="flex space-x-4 w-full">
          <Button
            type="reset"
            variant={"outline"}
            className="w-full"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              setOpenDialog(false);
            }}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
PasswordCardDetails.displayName = "PasswordCardDetails";
export { PasswordCardDetails };
