"use client"
import { auth } from "@/libs/firebase";
import { deleteCookie } from "cookies-next";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    return (
        <button onClick={() => {signOut(auth); deleteCookie('token', { path: '/' }); router.push('/'); }}>logout</button>
    );
}