"use client"; // This is a client component

import React, { useState, useEffect, useRef } from "react";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
} from "@heroicons/react/24/solid";
import SatuPassword from "@public/SatuPasswordNav.svg";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const user = "admin"; // temp value for role
  const [expandSubMenu, setExpandSubMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const topbarMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleSubMenu = () => {
    setShowUserMenu(false);
    setExpandSubMenu((prevExpand) => !prevExpand);
  };

  const toggleUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    // Close other menus before toggling the user menu
    setExpandSubMenu(false);
    setShowUserMenu((prevShow) => !prevShow);
  };

  const closeMenus = () => {
    setExpandSubMenu(false);
    setShowUserMenu(false);
  };

  useEffect(() => {
    // Add event listener to handle clicks on the window
    const handleWindowClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Close the menus if the click is outside of the menus
      if (
        !target.closest(".topbar-menu-container") &&
        topbarMenuRef.current &&
        topbarMenuRef.current.contains(target)
      ) {
        closeMenus();
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("click", handleWindowClick);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <nav className="px-20 bg-[#0F172A]">
      <div className="mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link href="/home">
                <div className="flex items-center">
                  <Image
                    src={SatuPassword}
                    alt="SatuPassword Logo"
                    width={70}
                    priority
                    className="m-6"
                  />
                  <p className="text-xl font-bold text-white">
                    SatuPassword
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="items-center hidden space-x-1 md:flex">
            {user == "admin" && (
              <div
                className="relative topbar-menu-container"
                ref={topbarMenuRef}
              >
                <button
                  onClick={toggleSubMenu}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none"
                >
                  <div className="flex items-center">
                    <CogIcon className="w-6 h-6" />
                  </div>
                </button>
                {expandSubMenu && (
                  <ul
                    className="absolute right-0 z-10 mt-2 bg-[#0F172A] rounded-md shadow-lg"
                    onClick={closeMenus}
                  >
                    <li>
                      <Link
                        href="/accounts"
                        className="block px-4 py-3 text-sm font-medium text-gray-400 rounded-md hover:text-white whitespace-nowrap"
                      >
                        Manage Accounts
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none"
              >
                <UserIcon className="w-6 h-6 text-gray-300" />
              </button>
              {showUserMenu && (
                <ul
                  className="absolute right-0 z-10 w-40 mt-2 bg-[#0F172A] rounded-md font-medium shadow-lg"
                  onClick={closeMenus}
                >
                  <li>
                    <div className="px-4 py-2 text-base font-medium text-white truncate rounded-md">
                      name
                    </div>
                    <div className="px-4 text-xs text-white truncate rounded-md">
                      email
                    </div>
                    <div className="px-4 py-1 text-xs text-white truncate rounded-md">
                      role
                    </div>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="flex px-4 py-3 text-sm text-gray-400 rounded-md hover:text-white"
                    >
                      <UserIcon className="w-5 h-5 mr-2 text-gray-300" />
                      Profile
                    </Link>
                  </li>
                  <div className="max-w-full h-0.5 bg-white ml-1"></div>
                  <li className="flex px-4 py-3 text-sm text-red-400 rounded-md cursor-pointer hover:text-white">
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                    Logout
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
