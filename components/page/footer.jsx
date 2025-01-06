import { StarsIcon } from "lucide-react";
import Logo from "../ui/logo";

export default function Footer() {
    return (
        <footer className="py-10 px-6 md:px-20 grid gap-4 lg:px-32">
            <div>
                <Logo />
                <h1 className="text-sm text-foreground/80">Proudly open-source, built by <a href="https://github.com/r2hu1" className="underline">r2hu1</a>.</h1>
            </div>
            <div className="flex flex-wrap gap-2">
                <a className="text-sm underline-offset-2 hover:decoration-gray-700 underline text-foreground/80" href="https://github.com/sponsors/r2hu1">Sponsor Project</a>
                <a className="text-sm underline-offset-2 hover:decoration-gray-700 underline text-foreground/80" href="https://github.com/r2hu1/codebin">Github Repository</a>
                <a className="text-sm underline-offset-2 hover:decoration-gray-700 underline text-foreground/80" href="https://github.com/r2hu1/codebin/issues">Found A Bug?</a>
            </div>
        </footer>
    );
};