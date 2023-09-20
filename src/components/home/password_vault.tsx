import React, { useEffect, useState } from "react";
import PasswordCard from "@components/home/password_card";

interface PasswordVaultProps {
  passwordData: PasswordData[];
}

interface PasswordData {
  id: string;
  name: string;
}

export default function PasswordVault(props: PasswordVaultProps) {
  return (
    <>
      <div className="flex flex-col overflow-y-auto h-full border-2 border-gray-200 shadow-md sm:rounded-lg">
        {props.passwordData.map(data => (
          <PasswordCard key={data.id} passwordData={data} />
        ))}
      </div>
    </>
  );
}
