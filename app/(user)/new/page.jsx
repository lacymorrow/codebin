"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@monaco-editor/react";
import { ArrowDownToLine, Clipboard, ClipboardCopy, Copy, Play, Share2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form"

export default function Page() {
    const { theme } = useTheme();

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data)
    };
    return (
        <div className="px-6 md:px-20 lg:px-32 mb-10">
            <div className="grid gap-3">
                <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-2">
                        <Button size="icon"><ArrowDownToLine className="h-4 w-4" /></Button>
                        <Button size="icon"><Copy className="h-4 w-4" /></Button>
                        <Button variant="outline" className="gap-1">Share <Share2 className="h-4 w-4" /></Button>
                    </div>
                    <Button size="icon" className="!w-10 !h-10">
                        <RainbowButton className="!w-10 px-0 py-0 !h-10">
                            <Play className="h-4 w-4" />
                        </RainbowButton>
                    </Button>
                </div>
                <div className="md:grid columns-3xl md:grid-cols-2 gap-3">
                    <div className="rounded-sm overflow-hidden">
                        <Editor
                            height="400px"
                            defaultLanguage="javascript"
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                wrappingIndent: "none",
                                wordWrap: "on",
                                wordWrapColumn: 80,
                                lineNumbersMinChars: 3,
                                fontSize: 15,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: {
                                    top: 10,
                                    bottom: 10,
                                    right: 10
                                },
                            }}
                        />
                    </div>
                    <div className="mt-5 sm:mt-0">
                        <div className="bg-secondary text-muted-foreground px-3 py-1 rounded-t-sm">
                            <h1>Output</h1>
                        </div>
                        <div className="rounded-sm h-72 sm:h-[366px] w-full bg-gray-900 rounded-t-none">

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