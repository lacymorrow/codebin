"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@monaco-editor/react";
import { ArrowDownToLine, ChevronDown, Clipboard, ClipboardCopy, Copy, Loader2, Play, Share2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form"
import { IoLogoJavascript, IoLogoPython } from "react-icons/io5";
import { FaJava } from "react-icons/fa";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { TbBrandCpp } from "react-icons/tb";


export default function Page() {
    const { theme } = useTheme();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const languages = [
        { name: "JavaScript", straightName: "JavaScript", icon: <IoLogoJavascript className="h-3 w-3" /> },
        { name: "Python", straightName: "Python", icon: <IoLogoPython className="h-3 w-3" /> },
        { name: "Java", straightName: "Java", icon: <FaJava className="h-3 w-3" /> },
        { name: "C++", straightName: "Cpp", icon: <TbBrandCpp className="h-3 w-3" /> },
    ];

    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

    const onSubmit = (data) => {
        console.log(data)
    };
    return (
        <div className="px-6 md:px-20 lg:px-32 mb-10">
            <div className="grid gap-4">
                <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-2">
                        <Button size="icon"><ArrowDownToLine className="h-4 w-4" /></Button>
                        <Button size="icon"><Copy className="h-4 w-4" /></Button>
                        <Button variant="outline" className="gap-1">Share <Share2 className="h-4 w-4" /></Button>
                    </div>
                    <Button size="icon" asChild>
                        <RainbowButton className="!w-10 px-0 py-0 !h-10">
                            <Play className="h-4 w-4" />
                        </RainbowButton>
                    </Button>
                </div>
                <div className="md:grid grid:columns-3xl md:grid-cols-2 md:gap-5">
                    <div className="rounded-sm shadow-sm overflow-hidden">
                        <div className="bg-muted/20 border border-border flex items-center justify-between px-3 py-1 rounded-b-none rounded-sm">
                            <h1 className="text-sm">Code Editor</h1>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="text-sm px-3 h-7">{selectedLanguage.icon}{selectedLanguage.name} <ChevronDown className="h-3 w-3" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {languages.map((language, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={() => setSelectedLanguage(language)}
                                        >
                                            {language.icon}
                                            <span className="ml-2">{language.name}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="rounded-sm rounded-t-none border border-border border-t-0 overflow-hidden">
                            <Editor
                                height="400px"
                                width="100%"
                                loading={<Loader2 className="h-4 w-4 animate-spin" />}
                                defaultValue="// Write your code here"
                                onChange={(data) => console.log(data)}
                                defaultLanguage={languages[0].straightName.toLowerCase()}
                                language={selectedLanguage.straightName.toLowerCase()}
                                theme={theme === "dark" ? "vs-dark" : ""}
                                options={{
                                    minimap: {
                                        enabled: false,
                                    },
                                    wrappingIndent: "none",
                                    wordWrap: "on",
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: {
                                        top: 10,
                                        bottom: 10,
                                        right: 10,
                                    },
                                    quickSuggestions: false,
                                    links: false,
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-0 shadow-sm">
                        <div className="bg-muted/20 border border-border flex items-center justify-between px-3 py-1 rounded-b-none rounded-sm">
                            <h1 className="text-sm">Code Output</h1>
                            <Copy className="!h-3 !w-3" />
                        </div>
                        <div className="rounded-sm border border-border border-t-0 h-72 sm:h-[366px] w-full bg-secondary/40 rounded-t-none">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
{/* <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5">
    <Label className="-mb-2" htmlFor="title">Title</Label>
    <Input id="title" placeholder="e.g: Hello World in JavaScript" {...register("title", { required: true })} />
    <Label className="-mb-2" htmlFor="description">Description</Label>
    <Textarea id="description" placeholder="e.g: A simple hello world in JavaScript" {...register("description")} />
    <Button type="submit" asChild className="w-full">
        <RainbowButton>Create</RainbowButton>
    </Button>
</form> */}