import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronRight, Stars, StarsIcon } from "lucide-react";
import { RainbowButton } from "../ui/rainbow-button";
import { BorderBeam } from "../ui/border-beam";
import TechStack from "./techstack";

export default function Hero() {
    return (
        <div className="px-6 py-10">
            <div className="grid mx-auto max-w-2xl gap-4 text-center place-items-center">
                <div className="flex -mb-1 items-center gap-2 bg-background/50 backdrop-blur-lg border-border border rounded-md w-fit px-3 py-0.5">
                    <StarsIcon className="h-3 w-3" />
                    <a href="https://github.com/r2hu1/codebin" target="_blank" className="text-sm text-foreground/80 hover:underline">
                        Give us a Star on Github
                    </a>
                    <ChevronRight className="h-3 w-3" />
                </div>
                <h1 className="font-geist text-4xl font-medium tracking-tighter bg-gradient-to-r from-zinc-800 via-stone-800/80 to-purple-800/70 dark:from-zinc-100 dark:via-stone-200/50 dark:to-purple-200/70 bg-clip-text text-transparent sm:text-5xl md:text-6xl">
                    Share code snippets with output and syntax highlighting with ease.
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
            <TechStack />
            <div className="relative rounded-md p-0.5 mt-10 max-w-[800px] mx-auto">
                <img
                    src="https://via.placeholder.com/800x450?text=in++development"
                    alt="Codebin illustration"
                    className="h-72 sm:h-full max-h-[450px] w-full object-cover rounded-md"
                />
                <BorderBeam borderWidth={2} />
            </div>
        </div>
    );
}