"use client"
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { setCookie } from 'cookies-next';
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const GoogleAuth = ({variant,size,className,children}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const initAuth = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();
            setCookie('token', token, {
                httpOnly: false,
                secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });
            router.push('/dashboard');
            setLoading(false);
            return window.location.reload();
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    }
    return (
        <Button disabled={loading} size={size} onClick={initAuth} variant={variant} className={className}>
            {children}
        </Button>
    )
};

export default GoogleAuth;