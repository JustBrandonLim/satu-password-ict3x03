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
import React, { Dispatch, SetStateAction } from "react";
import {toast} from "@components/ui/use-toast";
import {Copy, Eye, EyeOff} from "lucide-react";
import {PasswordSection} from "@components/password-section";

interface PasswordCardDetailsProps {
  viewMode?: boolean;
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
    title: z.string({
      required_error: "Title is required",
    }),
    url: z.string({
      required_error: "URL is required",
    }),
    username: z.string({
      required_error: "Username is required",
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

const PasswordViewEditCard: React.FC<PasswordCardDetailsProps> = ({
  viewMode =  true,
  setOpenDetails,
  passwordData,
  decryptedPassword,
  refreshPasswordVault,
}) => {
  const [showPassword, setShowPassword] = React.useState(false); // Show password state
  const [isViewMode, setIsViewMode] = React.useState(viewMode); // View mode state
  const passwordCardForm = useForm<z.infer<typeof PasswordCardDetailsSchema>>({
    resolver: zodResolver(PasswordCardDetailsSchema),
    defaultValues: {
        title: passwordData.title,
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

  const onSave = async (
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
        toast({
            variant: "default",
            title: "Password Updated!",
            description: `Password card has been updated successfully!`
        })
        setIsViewMode(true)
      } else {
        toast({
            variant: "destructive",
            title: "Password Update Failed!",
            description: `Error! Password card could not be updated!`
        })
        setOpenDetails(false);
      }
    }
    await SavePassword();
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

  // Copy Button Functionality
  function CopyButton(text: string) {
    navigator.clipboard.writeText(text)
        .then(() => {
          setTimeout(() => {}, 2000); // Reset copied state after 2 seconds
          toast({
            title: "Copied to clipboard",
          })
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          toast({
            variant: "destructive",
            title: "Something went wrong",
          })
        });
  }

  //The HTML elements
  return (
        <Form {...passwordCardForm}>
          <form
            onSubmit={passwordCardForm.handleSubmit(onSave)}
            className={`space-y-4 ${isViewMode? '':'pt-2'}`}
          >
            {/* Title Field */}
            <FormField
                control={passwordCardForm.control}
                name="title"
                render={({ field }) => (
                    <FormItem className={`w-full ${isViewMode? 'hidden':''}`}>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                          <Input readOnly={isViewMode} placeholder="Website URL" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            {/* URL Field */}
            <FormField
              control={passwordCardForm.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <div className={"flex space-x-4"}>
                      <Input readOnly={isViewMode} placeholder="Website URL" type="text" {...field}/>
                      <Button
                          type={"button"}
                          onClick={()=>{CopyButton(passwordData.url)}}
                          variant="outline"
                          size="icon"
                          className={`text-character-secondary  ${isViewMode? '':'hidden'}`}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Username Field */}
            <FormField
              control={passwordCardForm.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className={"flex space-x-4"}>
                      <Input readOnly={isViewMode} placeholder="Input your Username here" type="text" {...field}/>
                      <Button type={"button"}
                              onClick={()=>{CopyButton(passwordData.username)}}
                              variant="outline"
                              size="icon"
                              className={`text-character-secondary ${isViewMode? '':'hidden'}`}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={passwordCardForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className={`w-full ${isViewMode? '':'hidden'}`}>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className={"flex space-x-4"}>
                      <div className="relative w-full">
                        <Input readOnly={isViewMode} className={"pr-10"} placeholder="Enter Password" type={showPassword?'text':'password'} {...field} maxLength={64} onInput={handlePassword}/>
                        <Button variant="ghost" type="button" size='icon' className="absolute right-0 bottom-0" aria-label="Toggle Passowrd Visibility" onClick={() => {setShowPassword(!showPassword)}}>
                          <Eye className="absolute text-slate-400" visibility={showPassword? 'visible':'hidden'}/>
                          <EyeOff className="absolute text-slate-300" visibility={showPassword? 'hidden':'visible'}/>
                        </Button>
                      </div>
                      <Button type={"button"}
                              onClick={()=>{CopyButton(decryptedPassword.password)}}
                              variant="outline"
                              size="icon"
                              className={`text-character-secondary ${isViewMode? '':'hidden'}`}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <div className={isViewMode? 'hidden':''}>
                  <PasswordSection ShowConfirmPasswordField={false}/>
              </div>
            {/*  Button Section / Call to actions */}
            <div className="flex space-x-4 justify-between w-full">
              <div>
                <Button
                  type="button"
                  size={"sm"}
                  className="w-full text-red-500"
                  variant={"link"}
                  onClick={() => handleDeletePasswordCard()}
                >
                  Delete
                </Button>
              </div>
              <div className="flex space-x-4 grow justify-end">
                <Button
                  type="button"
                  variant={"outline"}
                  className="w-[80px]"
                  onClick={() => setOpenDetails(false)}
                >
                  Cancel
                </Button>
                <Button type="button" className={`w-[80px] ${isViewMode? 'block': 'hidden'}`} onClick={()=>{setIsViewMode(false)}}>
                  Edit
                </Button>
                <Button type="submit" className={`w-[80px] ${isViewMode? 'hidden': 'block'}`}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
  );
};
PasswordViewEditCard.displayName = "PasswordViewEditCard";
export { PasswordViewEditCard };
