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
import { useToast } from "@components/ui/use-toast";
import React, { Dispatch, SetStateAction } from "react";

interface PasswordCardDialogProps {
  open: boolean;
  setOpenCreatePassword: Dispatch<SetStateAction<boolean>>;
  refreshPasswordVault: () => void;
}

const PasswordCardDialogSchema = z
  .object({
    title: z.string({
      required_error: "Title is required",
    }),
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
  })

const CreatePasswordDialog: React.FC<PasswordCardDialogProps> = ({
  setOpenCreatePassword,
  refreshPasswordVault,
}) => {
  // const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Track form submission status
  // const [formSubmissionStatus, setFormSubmissionStatus] = useState(""); // Track result of submitted form status
  const passwordCardForm = useForm<z.infer<typeof PasswordCardDialogSchema>>({
    resolver: zodResolver(PasswordCardDialogSchema),
  });
  const { toast } = useToast();

  const onStorePasswordCard = async (
    data: z.infer<typeof PasswordCardDialogSchema>
  ) => {
    let title = data.title;
    let url = data.url;
    let username = data.username;
    let password = data.password;

    async function StorePassword() {
      const response = await fetch(`api/vault/store/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          title: "Password Created!",
          description: "Password card has been created successfully!",
        })
        setOpenCreatePassword(false);
      } else {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Password card could not be created!",
        })
        setOpenCreatePassword(false);
      }
    }
    await StorePassword();
  };

  return (
        <Form {...passwordCardForm}>
          <form
            onSubmit={passwordCardForm.handleSubmit(onStorePasswordCard)}
            className="space-y-6"
          >
            {/* Title Items Row */}
            <div className="flex w-full items-end space-x-2 mt-4">
              {/* Title Field */}
              <FormField
                control={passwordCardForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full text-left">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <div className="flex w-full space-x-4">
                        <div className="relative w-full">
                          <Input
                            placeholder="Input your Title here"
                            type="title"
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
            {/* URL Items Row */}
            <div className="flex w-full items-end space-x-2 mt-4">
              {/* URL Field */}
              <FormField
                control={passwordCardForm.control}
                render={({ field }) => (
                  <FormItem className="w-full text-left">
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <div className="flex w-full space-x-4">
                        <div className="relative w-full">
                          <Input placeholder="Website URL" {...field}/>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                name="url"
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
            <PasswordSection ShowConfirmPasswordField={false}/>
            <div className="flex space-x-4 w-full">
              <Button type="button" variant={"outline"} className="w-full" onClick={() => setOpenCreatePassword(false)}>
                Cancel
              </Button>
              <Button type="submit" className="w-full">
                Create
              </Button>
            </div>
          </form>
        </Form>
  );
};

CreatePasswordDialog.displayName = "CreatePasswordDialog";
export { CreatePasswordDialog };
