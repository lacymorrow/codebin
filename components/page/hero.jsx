import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronRight, Stars, StarsIcon } from "lucide-react";
import TechStack from "./techstack";
import { BorderTrail } from "../ui/border-trail";
import GetStartedBtn from "./get-started-btn";

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
                    <GetStartedBtn />
                    <Link href="/s/tFOrJEARI2SbxKQR92PF">
                        <Button variant="outline">View Demo <Stars className="h-4 w-4" /></Button>
                    </Link>
                </div>
            </div>
            <TechStack />
            <div className="relative rounded-md p-[1px] mt-10 max-w-6xl w-full mx-auto">
                <img
                    src="/dash-prv.png"
                    alt="Codebin"
                    className="border border-border h-full w-full object-fit rounded-md"
                />
                <BorderTrail />
            </div>
        </div>
    );
}