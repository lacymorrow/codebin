"use client"
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { setCookie } from 'cookies-next';
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const GoogleAuth = ({ variant, size, className, children }) => {
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
            setLoading(false);
            return window.location.href = '/me';
        } catch (error) {
            setLoading(false);
            toast.error('Error signing in with Google');
            console.error("Error signing in with Google:", error);
        }
    }
    return (
        <Button disabled={loading} size={size} onClick={initAuth} variant={variant} className={className}>
            {!loading ? children : <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>
    )
};

export default GoogleAuth;