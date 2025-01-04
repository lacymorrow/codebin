"use client"
import { auth } from "@/lib/firebase";
import { deleteCookie } from "cookies-next";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function Logout() {
    const router = useRouter();

    return (
        <Button onClick={() => { signOut(auth); deleteCookie('token'); window.location.reload(); router.push('/'); }}>logout</Button>
    );
}