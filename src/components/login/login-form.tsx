"use client"; // This is a client component

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const UserLogin = async (email: string, password: string) => {
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
      router.push("/dashboard");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    UserLogin(email, password);
  };

  const navigateToRegister = () => {
    router.push("/register");
  };

  return (
    <form
      className="flex flex-col w-2/3 max-w-md gap-2 p-8 mx-auto "
      onSubmit={handleSubmit}
    >
      <p className="mb-3 font-normal text-center text-lg pb-5 text-gray-500">
        Log into your Account
      </p>
      <p className="font-semibold">Email</p>
      <input
        id="email"
        type="email"
        placeholder="Email"
        className="p-2 rounded-sm ring-2 ring-gray-300"
        onChange={(e) => setEmail(e.target.value)}
      />
      <p className="font-semibold">Password</p>
      <input
        id="password"
        type="password"
        placeholder="Password"
        className="p-2 rounded-sm ring-2 ring-gray-300"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex flex-col items-center justify-between gap-5 my-3 md:flex-row md:gap-0">
        <label className="flex items-center">
          <input type="checkbox" className="mr-1" />
          Remember Me
        </label>

        <label className="flex items-center">
          <a
            className="mr-1 cursor-pointer hover:text-black/70"
            onClick={() => setShowModal(true)}
          >
            Forgot your password?
          </a>
        </label>
      </div>
      <button
        type="submit"
        className="px-5 py-2 text-white transition-colors duration-150 bg-black rounded-md hover:bg-black/70"
      >
        Log In
      </button>
      <p className="mt-3 font-medium text-center text-sm pb-5 text-black">
        New to SatuPassword?{" "}
        <span
          className=" text-blue-600 font-bold cursor-pointer"
          onClick={navigateToRegister}
        >
          {" "}
          Sign Up{" "}
        </span>
      </p>
      {showModal && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative min-w-[420px] max-w-xs mx-auto my-6">
              <div className="relative flex flex-col bg-white border-0 rounded-md shadow-lg outline-none w-fullm-12 focus:outline-none">
                <div className="relative flex-auto px-5 py-6">
                  <div className="flex items-start justify-center">
                    <div className="flex flex-col gap-2.5">
                      <span className="text-xl font-bold leading-relaxed text-black ">
                        Recover your account
                      </span>
                      <div>
                        <p className="pb-6">
                          Please enter in your email address that is associated
                          with your account
                        </p>
                        <p className="py-1 text-sm font-semibold"> Email</p>
                        <input
                          id="email"
                          type="email"
                          placeholder="Email"
                          className="w-full p-2 rounded-sm ring-2 ring-gray-300"
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                        />
                        <p className="py-2 text-sm text-gray-400">
                          A recovery email will be sent if such an account
                          exists
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 px-6 pb-6">
                  <button
                    className="flex px-5 py-2 text-black transition-colors duration-150 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-200"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex h-full px-8 py-2 text-white transition-colors duration-150 bg-black rounded-md hover:bg-black/70"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Recover
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </form>
  );
}
