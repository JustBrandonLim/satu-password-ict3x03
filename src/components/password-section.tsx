  import { Input } from "@/components/ui/input"
  import * as React from "react"
  import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Progress } from "@components/ui/progress"
import { Button } from "@components/ui/button"
import zxcvbn from 'zxcvbn';

  export default interface PasswordSectionProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
      control: any
    }

    const PasswordSection = React.forwardRef<HTMLInputElement, PasswordSectionProps>(
      ({ className, type, control, ...props}, ref) => {
        //Password Strength Logic
        const [passwordStrength, setPasswordStrength] = React.useState<number>(0);

        const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const password = e.target.value;
          const result = zxcvbn(password);
          const strength = result.score; // zxcvbn provides a score from 0 to 4
          setPasswordStrength(strength);
        };
        return (
          <div>
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Password" type="password" {...field} onChange={handlePasswordChange}/>
                </FormControl>
                <FormMessage />
              </FormItem>
              )}
            />
            <div className="flex justify-center items-center space-x-4 my-2">
              <label className="text-sm text-character-secondary">Strength</label>
              <Progress value={passwordStrength * 25} className="h-2" />
            </div>
            <Button type="button" variant={'secondary'} className="w-full">Genereate Password</Button>
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="Re-enter Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
              )}
            />
          </div>
        )
      }
    )
    PasswordSection.displayName = "PasswordSection"
    
    export { PasswordSection }


    