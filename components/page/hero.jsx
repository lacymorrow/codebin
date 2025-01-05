import Link from "next/link";
import { Button } from "../ui/button";
import { Stars } from "lucide-react";
import { RainbowButton } from "../ui/rainbow-button";

export default function Hero() {
    return (
        <div className="px-6 py-10">
            <img
                src="https://tailwindcss.com/_next/static/media/docs@30.8b9a76a2.avif"
                className="absolute -z-50 -top-0 left-10"
            />
            <div className="grid mx-auto max-w-2xl gap-4 text-center place-items-center">
                <h1 className="font-geist text-4xl font-medium tracking-tighter bg-gradient-to-r from-zinc-800 via-stone-800/60 to-purple-800/80 dark:from-zinc-100 dark:via-stone-200/50 dark:to-purple-200/70 bg-clip-text text-transparent sm:text-5xl md:text-6xl">
                    Share code snippets w/ output and syntax highlighting with ease.
                </h1>
                <p className="font-geist font-light sm:text-lg text-sm text-foreground/70">
                    Codebin makes sharing code snippets with output simple. Whether you're a developer or not, you can view and share syntax-highlighted snippets effortlessly.
                </p>
                <div className="flex gap-3 mt-4">
                    <Link href="/dashboard">
                        <Button asChild>
                            <RainbowButton>Get Started</RainbowButton>
                        </Button>
                    </Link>
                    <Link href="https://github.com/r2hu1/codebin">
                        <Button variant="outline">Github <Stars className="h-4 w-4" /></Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}