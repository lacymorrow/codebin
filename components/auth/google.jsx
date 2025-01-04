"use client"
import { auth, googleProvider } from "@/libs/firebase";
import { signInWithPopup } from "firebase/auth";
import { setCookie } from 'cookies-next';

const GoogleAuth = () => {
    const initAuth = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();
            setCookie('token', token, {
                httpOnly: false,
                secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });
        } catch (error) {
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);
            console.error("Full Error Object:", error);
        }
    }
    return (
        <button onClick={initAuth}>Sign in with Google</button>
    )
};

export default GoogleAuth;