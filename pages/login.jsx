import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function Login() {
  return (
    <div className="h-[100vh] flex flex-col">
      <div className="flex flex-1 flex-col justify-center md:items-center">
        <Link href="/signup">
          <button className="hidden md:block md:absolute lg:block lg:absolute right-5 top-[15%] bg-[#D16527] font-chakra w-[190px] h-[41px] text-[#fff] uppercase">
            Resgitrarse
          </button>
        </Link>

        <h1 className="text-[#FFF] text-center font-chakra text-[32px] font-bold leading-normal mb-[50px]">
          Welcome to the FaiRefac
        </h1>
        <LoginForm />
        <div className="flex w-full md:hidden lg:hidden justify-start  px-[32px]  mt-5">
          <Link href="/signup">
            <button className="bg-[#fff] font-chakra w-[190px] h-[41px] text-[#000] uppercase">
              Registrarse
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
