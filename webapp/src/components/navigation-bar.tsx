"use client"; // This is a client component

import SatuPassword from "@public/SatuPasswordNav.svg";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import { LogOut, UserCircle, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter(); // Instatiate router for routing to other pages later

  async function logout() {
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      // Trigger Page Refresh
      router.push("/");
    }
  }

  return (
    <nav className="w-screen h-16 bg-slate-900 flex items-center justify-between px-8 sm:px-16 lg:px-[10%]">
      {/*Left Icon*/}
      <Link href="/home">
        <div className="flex items-center">
          <Image
            src={SatuPassword}
            alt="SatuPassword Logo"
            width={70}
            priority
            className="m-6"
          />
          <p
            className="text-xl font-bold text-white"
            style={{ fontFamily: "Inika, sans-serif" }}
          >
            SatuPassword
          </p>
        </div>
      </Link>
      {/*Right Action Buttons*/}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className={"text-character-inverse"}
          >
            <UserCircle />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={"absolute right-0 min-w-[160px]"}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.push("/profile");
            }}
          >
            <UserCog className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
