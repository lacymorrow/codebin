import { SiFirebase, SiNextdotjs, SiTailwindcss } from "react-icons/si";

export default function TechStack() {
    return (
        <div className="py-10 mt-14 px-6 text-center grid gap-4 overflow-clip">
            <h1 className="font-light text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Build with latest technologies.
            </h1>
            <div className="flex items-center flex-wrap justify-center gap-6 sm:gap-8">
                <div className="flex items-center gap-2">
                    <SiNextdotjs className="h-5 w-5" />
                    <h1 className="text-lg font-medium">Next.js</h1>
                </div>
                <div className="flex items-center gap-2">
                    <SiFirebase className="h-5 w-5" />
                    <h1 className="text-lg font-medium">Firebase</h1>
                </div>
                <div className="flex items-center gap-2">
                    <SiTailwindcss className="h-5 w-5" />
                    <h1 className="text-lg font-medium">Tailwind CSS</h1>
                </div>
            </div>
        </div>
    )
};