"use client"; // This is a client component

import { useState } from "react";
import PasswordVault from "@components/home/password_vault";

export default function Vault() {
  const [passwordData, setPasswordData] = useState([
    { id: "1", name: "test" },
    { id: "2", name: "test2" },
    { id: "3", name: "test3" },
    { id: "4", name: "test4" },
    { id: "1", name: "test" },
    { id: "2", name: "test2" },
    { id: "1", name: "test" },
    { id: "2", name: "test2" },
    { id: "1", name: "test" },
    { id: "2", name: "test2" },
  ]);
  const [featureDisplay, setFeatureDisplay] = useState(0);

  const PageDisplay = () => {
    switch (featureDisplay) {
      case 0:
        // Return the component or content for 'Password'
        return <PasswordVault passwordData={passwordData} />;
      case 1:
        // Return the component or content for 'Secure Note'
        return <div>Secure Note Content Here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center text-center gap-2 w-2/3 mx-auto">
      <div className="flex w-full bg-gray-100 border-2 rounded-lg whitespace-nowrap">
        <button
          type="button"
          className={`${
            featureDisplay === 0 ? "font-semibold bg-white" : ""
          } flex-grow px-5 py-2 transition-colors duration-150 rounded-md hover:bg-gray-200`}
          onClick={() => setFeatureDisplay(0)}
        >
          Password
        </button>
        <button
          type="button"
          className={`${
            featureDisplay === 1 ? "font-semibold bg-white" : ""
          } flex-grow px-5 py-2 transition-colors duration-150 rounded-md hover:bg-gray-200`}
          onClick={() => setFeatureDisplay(1)}
        >
          Secure Note
        </button>
      </div>
      <div className="w-full">{PageDisplay()}</div>
    </div>
  );
}
