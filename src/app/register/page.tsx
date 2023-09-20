import Image from "next/image";
import SatuPassword from "@public/SatuPassword.svg";
import RegisterForm from "@components/login/register-form";
import Footer from "@/components/page-footer";
import TestForm from "@/components/login/test-form";

export default function Register() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <div className="grow flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            src={SatuPassword}
            alt="SatuPassword Logo"
            width={650}
            height={350}
            priority
          />
        </div>
        <p className="my-3 font-normal text-center text-lg pb-5 text-gray-500">
          Get started with SatuPassword
        </p>
        {/* <RegisterForm /> */}
        <TestForm/>
      </div>
      <Footer/>
    </main>
  );
}