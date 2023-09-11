import Image from "next/image";
import SatuPassword from "@public/SatuPassword.svg";
import RegisterForm from "@components/login/register-form";

export default function Register() {
  return (
    <main className="w-full bg-gray-50">
      <div className="flex flex-col items-center justify-center text-center">
        <Image
          src={SatuPassword}
          alt="SatuPassword Logo"
          width={650}
          height={550}
          priority
        />
      </div>
      <RegisterForm />
      <footer className="w-full py-8 text-sm text-center text-gray-400 bg-gray-50">
        <div className="flex flex-row justify-center gap-5 mb-2">
          <div>SatuPassword</div>
        </div>
        <div>Copyright ©2023 Produced by TeamSatu</div>
      </footer>
    </main>
  );
}