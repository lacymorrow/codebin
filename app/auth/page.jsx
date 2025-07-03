"use client";

import GithubAuth from "@/components/auth/github";
import GoogleAuth from "@/components/auth/google";
import Logo from "@/components/ui/logo";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";

export default function Page() {
  const token = getCookie("token");
  const router = useRouter();
  useEffect(() => {
    if (token) return router.push("/dashboard");
  }, []);
  return (
    <div className="px-6 h-full w-full absolute top-0 left-0 right-0 bottom-0 grid place-items-center">
      <div className="absolute top-0 z-[-2] h-full w-full dark:bg-neutral-950 bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      {/* <div className="absolute text-center top-10 grid place-items-center">
                <Logo />
            </div> */}
      <div className="grid gap-5 w-full max-w-sm">
        <div className="text-center max-w-xs mx-auto grid gap-2 mb-3">
          <h1 className="text-xl font-bold">Welcome Back!</h1>
          <p className="text-sm text-foreground/80">
            Login or create an account to continue!
          </p>
        </div>
        <div className="grid gap-4 w-full">
          <GoogleAuth
            variant="outline"
            size="lg"
            className="items-center gap-4"
          >
            <FcGoogle className="h-4 w-4" />
            Continue with Google
          </GoogleAuth>
          <GithubAuth
            variant="default"
            size="lg"
            className="items-center gap-4"
          >
            <SiGithub className="h-4 w-4" />
            Continue with GitHub
          </GithubAuth>
        </div>
      </div>
    </div>
  );
}
