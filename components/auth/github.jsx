"use client"
import { auth, githubProvider } from "@/lib/firebase";
import { setCookie } from "cookies-next";
import { signInWithPopup } from "firebase/auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GithubAuth = ({variant,size,className,children}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const initAuth = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, githubProvider);
            const token = await result.user.getIdToken();
            setCookie('token', token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });
            setLoading(false);
            router.push('/dashboard');
            return window.location.reload();
        } catch (error) {
            console.error("Error signing in with GitHub:", error);
        }
    };

    return (
        <Button disabled={loading} size={size} onClick={initAuth} variant={variant} className={className}>
            {children}
        </Button>
    );
};

export default GithubAuth;