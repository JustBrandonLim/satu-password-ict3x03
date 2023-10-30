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
import { Input } from "@components/ui/input";
import { useForm } from "react-hook-form";
import React, { Dispatch, SetStateAction, useState } from "react";
import {toast} from "@components/ui/use-toast";
import {Eye, EyeOff} from "lucide-react";

interface PasswordCardDetailsProps {
  passwordData: {
    id: number;
    title: string;
    url: string;
    username: string;
    encryptedPassword: string;
  };
  decryptedPassword: {
    password: string;
  };
  open: boolean;
  setOpenDetails: Dispatch<SetStateAction<boolean>>;
  refreshPasswordVault: () => void;
}

const PasswordCardDetailsSchema = z
  .object({
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
  });

const PasswordCardDetails: React.FC<PasswordCardDetailsProps> = ({
  setOpenDetails,
  passwordData,
  decryptedPassword,
  refreshPasswordVault,
}) => {
  const [showPassword, setShowPassword] = React.useState(false); // Show password state
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Track if form has been submitted
  const [formSubmissionStatus, setFormSubmissionStatus] = useState(""); // Track result of submitted form status
  const passwordCardForm = useForm<z.infer<typeof PasswordCardDetailsSchema>>({
    resolver: zodResolver(PasswordCardDetailsSchema),
    defaultValues: {
      url: passwordData.url,
      username: passwordData.username,
      password: decryptedPassword.password,
    },
  });

  // To handle Password Field, removing spaces
  const handlePassword = (event: React.FormEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value
        .replace(/\s/g, ""); // Remove spaces
  };

  const onSavePasswordCard = async (
    data: z.infer<typeof PasswordCardDetailsSchema>
  ) => {
    let id = passwordData.id;
    let title = passwordData.title;
    let url = data.url;
    let username = data.username;
    let password = data.password;

    async function SavePassword() {
      const response = await fetch(`api/vault/update/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          title: title,
          url: url,
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        refreshPasswordVault();
        setIsFormSubmitted(true);
        setFormSubmissionStatus("✅Password card has been updated successfully!");
      } else {
        setIsFormSubmitted(true);
        setFormSubmissionStatus("Error! Password card could not be updated!");
      }
    }
    SavePassword();
  };

  function handleDeletePasswordCard() {
    async function DeletePassword() {
      const response = await fetch(`api/vault/delete/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: passwordData.id,
        }),
      });
      if (response.ok) {
        refreshPasswordVault();
        toast({
          variant: "default",
          title: "Password Deleted!",
          description: `Password has been deleted successfully!`
        })
      } else {
        toast({
            variant: "destructive",
            title: "Password Deletion Failed!",
            description: `Password card could not be deleted!`
        })
      }
    }
    DeletePassword();
  }

  //The HTML elements
  return (
    <>
      {!isFormSubmitted ? (
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
                          <Input
                            placeholder="Website URL"
                            type="url"
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
            {/* Password Items Row */}
            <div className="flex w-full items-end space-x-2 mt-4">
              {/* Password Field */}
              <FormField
                control={passwordCardForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full text-left">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input className={"pr-10"} placeholder="Enter Password" type={showPassword?'text':'password'} {...field} maxLength={64} onInput={handlePassword}/>
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
            </div>
            <div className="flex space-x-4 justify-between w-full">
              <div>
                <Button
                  type="button"
                  className="w-full"
                  variant={"destructive"}
                  onClick={() => handleDeletePasswordCard()}
                >
                  Delete
                </Button>
              </div>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-full"
                  onClick={() => setOpenDetails(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      ) : (
        // Render a success message
        <div>
          <p>{formSubmissionStatus}</p>
        </div>
      )}
    </>
  );
};
PasswordCardDetails.displayName = "PasswordCardDetails";
export { PasswordCardDetails };
