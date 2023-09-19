import Image from "next/image";
import SatuPassword from "@public/SatuPassword.svg";
import RegisterForm from "@components/login/register-form";
import Footer from "@/components/page-footer";

export default function Register() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center">
      <div className="grow flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center ">
          <Image
            src={SatuPassword}
            alt="SatuPassword Logo"
            width={650}
            height={350}
            priority
          />
        </div>
        <RegisterForm />
      </div>
      <Footer/>
    </main>
  );
}