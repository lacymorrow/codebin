"use client"
import { auth, githubProvider } from "@/libs/firebase";
import { setCookie } from "cookies-next";
import { signInWithPopup } from "firebase/auth";

const GithubAuth = () => {
    const initAuth = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            const token = await result.user.getIdToken();
            setCookie('token', token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24,
            });
        } catch (error) {
            console.error("Error signing in with GitHub:", error.message);
        }
    };

    return (
        <button onClick={initAuth}>Sign in with GitHub</button>
    );
};

export default GithubAuth;