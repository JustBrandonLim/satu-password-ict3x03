import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { ChangeEvent, useState } from 'react';

interface PasswordInputProps {
  onChange: (password: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ onChange }) => {
  const [password, setPassword] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onChange(e.target.value);
  };

  return (
    <Input
      type="password"
      placeholder="Enter password"
      value={password}
      onChange={handleChange}
    />
  );
};

export default PasswordInput;