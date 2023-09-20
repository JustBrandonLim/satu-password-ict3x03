"use client"; // This is a client component

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const UserRegister = async (email: string, password: string) => {
    const response = await fetch(`/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, type: "administrator" }),
    });
    const json = await response.json();

    if (!response.ok) {
      console.log(json);
    }
    if (response.ok) {
      router.push("/");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    UserRegister(email, password);
  };

  const navigateToLogin = () => {
    router.push("/");
  };

  return (
    <form
      className="flex flex-col w-2/3 max-w-md gap-2 p-8 mx-auto "
      onSubmit={handleSubmit}
    >
      <p className="mb-3 font-normal text-center text-lg pb-5 text-gray-500">
        Get started with SatuPassword
      </p>
      <label className="font-semibold">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Email"
        className="p-2 rounded-sm ring-2 ring-gray-300"
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="font-semibold">Password</label>
      {/* <input
        id="password"
        type="password"
        placeholder="Password"
        className="p-2 rounded-sm ring-2 ring-gray-300"
        onChange={(e) => setPassword(e.target.value)}
      /> */}
      {/* <PasswordInput/> */}
      <label className="font-semibold">Confirm Password</label>
      <input
        id="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        className="p-2 rounded-sm ring-2 ring-gray-300"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button
        type="submit"
        className="px-5 py-2 mt-4 text-white transition-colors duration-150 bg-black rounded-md hover:bg-black/70"
      >
        Sign In
      </button>
      <p className="mt-3 font-medium text-center text-sm pb-5 text-black">
        Already have an account?{" "}
        <span className=" text-blue-600 font-bold cursor-pointer" onClick={navigateToLogin}>
          {" "}
          Login{" "}
        </span>
      </p>
    </form>
  );
}
