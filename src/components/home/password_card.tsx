import React from "react";
import { PencilIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

interface PasswordCardProps {
  passwordData: {
    id: string;
    name: string;
  };
}

export default function PasswordCard(props: PasswordCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  return (
    <div className="flex items-center p-5 m-2 bg-white rounded-md shadow-lg w-full">
      <LockClosedIcon className="w-6 h-6 mr-4" />
      <div className="flex-grow text-left">
        <h3 className="text-xl font-bold">Name</h3>
        <p>Description here</p>
      </div>
      <button
        className="px-3 py-1 text-sm font-medium text-black hover:text-green-600 focus:outline-none"
        onClick={toggleEditModal}
      >
        <PencilIcon className="w-5 h-5 mr-1" />
      </button>
      {/* Edit Modal */}
      {showEditModal && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-sm mx-auto my-6 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="flex flex-col px-6 py-6 gap-2.5">
                <h2 className="text-xl font-bold text-left text-black">
                  Password Name
                </h2>
                <label className="text-sm font-semibold text-left text-black">
                  URL
                </label>
                <input
                  id="url"
                  type="text"
                  placeholder="URL"
                  className="w-full p-2 rounded-sm ring-2 ring-gray-300"
                />
                <label className="text-sm font-semibold text-left text-black">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="w-full p-2 rounded-sm ring-2 ring-gray-300"
                />
                <label className="text-sm font-semibold text-left text-black">
                  Password
                </label>
                Insert generate Password component here
              </div>
              <div className="flex items-center justify-end px-6 py-4">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 text-black transition-colors duration-150 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-200"
                  onClick={toggleEditModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-white transition-colors duration-150 bg-black rounded-md hover:bg-white-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </div>
  );
}
