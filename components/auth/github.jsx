"use client"
import { auth, githubProvider } from "@/lib/firebase";
import { setCookie } from "cookies-next";
import { signInWithPopup } from "firebase/auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const GithubAuth = ({ variant, size, className, children }) => {
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
            return window.location.href = '/dashboard';
        } catch (error) {
            setLoading(false);
            toast.error('Error signing in with GitHub');
            console.error("Error signing in with GitHub:", error);
        }
    };

    return (
        <Button disabled={loading} size={size} onClick={initAuth} variant={variant} className={className}>
            {!loading ? children : <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>
    );
};

export default GithubAuth;