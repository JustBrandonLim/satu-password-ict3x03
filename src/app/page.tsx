import Image from "next/image";
import SatuPassword from "@public/SatuPassword.svg";
import LoginForm from "@components/login/login-form";
import Footer from "@/components/page-footer";

export default function Login() {
  return (
    <main className="w-full flex flex-col items-center justify-center">
      <div className="grow flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center w-5/6">
          <Image className="object-contain"
            src={SatuPassword}
            alt="SatuPassword Logo"
            width={650}
            height={350}
            priority
          />
        </div>
        <p className="my-3 font-normal text-center text-lg pb-5 text-gray-500">
          Log into your Account
        </p>
        <LoginForm/>
      </div>
      <Footer/>
    </main>
  );
}