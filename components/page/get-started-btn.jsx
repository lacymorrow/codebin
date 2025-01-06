"use client"
import { getCookie } from "cookies-next";
import { Button } from "../ui/button";
import Link from "next/link";
import { RainbowButton } from "../ui/rainbow-button";

export default function GetStartedBtn() {
    const token = getCookie('token');
    return (
        <Link href={!token ? "/auth" : "/dashboard"}>
            <Button asChild>
                <RainbowButton>{!token ? "Get Started" : "Dashboard"}</RainbowButton>
            </Button>
        </Link>
    )
}