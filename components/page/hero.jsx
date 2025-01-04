import Link from "next/link";
import { Button } from "../ui/button";
import { RainbowButton } from "../ui/rainbow-button";

export default function Hero() {
    return (
        <div className="px-6 py-10">
            <div className="grid gap-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">The only platform to share code snippets with output!</h1>
                <p className="text-sm sm:text-lg text-foreground/70">
                    Codebin is a platform where you can share code snippets with output.
                    Developers and non-developers can now easily share, view code snippets
                    with output and syntax highlighting.
                </p>
                <div className="flex gap-3 mt-4">
                    <Link href="/dashboard">
                        <RainbowButton>Get Started</RainbowButton>
                    </Link>
                    <Button className="h-11 rounded-xl py-2 px-6" variant="outline">Explore</Button>
                </div>
            </div>
        </div>
    );
}