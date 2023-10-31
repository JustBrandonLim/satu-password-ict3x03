import React from "react";
import PasswordCard from "@components/home/password_list_card";

interface PasswordVaultProps {
  passwordData: PasswordData[];
  refreshPasswordVault: () => void;
}

interface PasswordData {
  id: number;
  title: string;
  url: string;
  username: string;
  encryptedPassword: string;
}

export default function PasswordVault(props: PasswordVaultProps) {
  return (
    <>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden max-h-96 border-2 pr-4 border-gray-200 shadow-md sm:rounded-lg">
        {props.passwordData && Array.isArray(props.passwordData) ? (
          props.passwordData.map((data) => (
            <PasswordCard key={data.id} passwordData={data} refreshPasswordVault={props.refreshPasswordVault} />
          ))
        ) : (
          <p className="p-5">No password data available</p>
        )}
      </div>
    </>
  );
}
