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
import { useEffect, useRef, useState } from "react";
import { TbBrandCpp } from "react-icons/tb";
import { LANGUAGE_CONFIG } from "@/app/_constants/config";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/ui/credenza"
import createSnippet from "@/server_functions/createSnippet";
import { getCurrentUser } from "@/utils/current-user";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function Page() {
    const { theme } = useTheme();
    const languages = [
        { name: "JavaScript", straightName: "JavaScript", icon: <IoLogoJavascript className="h-3 w-3" /> },
        { name: "Python", straightName: "Python", icon: <IoLogoPython className="h-3 w-3" /> },
        { name: "Java", straightName: "Java", icon: <FaJava className="h-3 w-3" /> },
        { name: "C++", straightName: "Cpp", icon: <TbBrandCpp className="h-3 w-3" /> },
    ];
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [code, setCode] = useState(null);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [running, setRunning] = useState(false);
    const [user, setUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const outputElement = useRef(null);
    const [pubId, setPubId] = useState(null);
    const [shareDialog, setShareDialog] = useState(false);

    const onSubmit = (data) => {
        const title = data.title;
        const desc = data.description;
        if (!code) return toast.error("Please write some code!");
        const uId = user.uid;
        try {
            setPublishing(true);
            const newDoc = createSnippet(uId, { title, desc, code, language: selectedLanguage.straightName.toLowerCase() });
            newDoc.then((e) => {
                setPubId(null);
                toast.success("Snippet created successfully!");
                setCode(null);
                setOutput(null);
                setPubId(e);
            });
            newDoc.finally(() => {
                setShareDialog(true);
                setDialogOpen(false);
                setPublishing(false);
            });
        }
        catch (e) {
            setPublishing(false);
            setDialogOpen(false);
            setShareDialog(true);
            console.log(e);
            toast.error("Error creating snippet!");
        }
    };

    useEffect(() => {
        getCurrentUser(setUser);
    }, []);

    const executeCode = async () => {
        if (!code) {
            toast.error("Please enter some code");
            return;
        }
        setError(null);
        setOutput(null);
        try {
            setRunning(true);
            const runtime = LANGUAGE_CONFIG[selectedLanguage.straightName.toLowerCase()].pistonRuntime;
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language: runtime.language,
                    version: runtime.version,
                    files: [{ content: code }],
                }),
            });

            const data = await response.json();

            console.log("data back from piston:", data);

            // handle API-level erros
            if (data.message) {
                return setOutput({ error: data.message, executionResult: { code, output: "", error: data.message } });
            }

            // handle compilation errors
            if (data.compile && data.compile.code !== 0) {
                const error = data.compile.stderr || data.compile.output;
                return setError({
                    error,
                    executionResult: {
                        code,
                        output: "",
                        error,
                    },
                });
            }

            if (data.run && data.run.code !== 0) {
                const error = data.run.stderr || data.run.output;
                return setError({
                    error,
                    executionResult: {
                        code,
                        output: "",
                        error,
                    },
                });
            }

            // if we get here, execution was successful
            const output = data.run.output;

            return setOutput({
                output: output.trim(),
                error: null,
                executionResult: {
                    code,
                    output: output.trim(),
                    error: null,
                },
            });
        } catch (error) {
            console.log("Error running code:", error);
            return setError({
                error: "Error running code",
                executionResult: { code, output: "", error: "Error running code" },
            });
        } finally {
            setRunning(false);
            if (outputElement.current) {
                outputElement.current.scrollIntoView({ behavior: "smooth" });
            }
            return;
        }
    };

    return (
        <div className="px-6 md:px-20 lg:px-32 mb-10">
            <div className="grid gap-4">
                <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(code); toast.success("Copied to clipboard!"); }}><Copy className="h-4 w-4" /></Button>
                        <Credenza open={dialogOpen} onOpenChange={setDialogOpen}>
                            <CredenzaTrigger asChild>
                                <Button>Publish</Button>
                            </CredenzaTrigger>
                            <CredenzaContent>
                                <CredenzaHeader>
                                    <CredenzaTitle className="text-start">Publishing your snippet!</CredenzaTitle>
                                    <CredenzaDescription className="text-start">
                                        <p>Please fill out the form below to publish your snippet</p>
                                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5">
                                            <Label className="-mb-2" htmlFor="title">Title</Label>
                                            <Input id="title" placeholder="e.g: Hello World in JavaScript" {...register("title", { required: true })} />
                                            {errors.title && <span className="text-red-500 text-sm -mt-2">Title is required</span>}
                                            <Label className="-mb-2" htmlFor="description">Description (optional)</Label>
                                            <Textarea id="description" placeholder="e.g: A simple hello world in JavaScript" {...register("description")} />
                                            {pubId && (
                                                <div className="grid gap-1 mt-2">
                                                    <Label className="text-foreground">Snippet URL Generated!</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input readOnly value={`${location.origin}/s/${pubId}`} />
                                                        <Button type="button" size="icon" className="!w-10" onClick={() => { navigator.clipboard.writeText(`${location.origin}/s/${pubId}`); toast.success("Copied to clipboard!"); }}><Copy className="h-4 w-4" /></Button>
                                                    </div>
                                                </div>
                                            )}
                                            <Button disabled={publishing} type="submit" className="w-full">
                                                {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
                                            </Button>
                                        </form>
                                    </CredenzaDescription>
                                </CredenzaHeader>
                            </CredenzaContent>
                        </Credenza>
                    </div>
                    <Button size="icon" asChild onClick={executeCode} disabled={running}>
                        <RainbowButton className="!w-10 px-0 py-0 !h-10">
                            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
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
                                height="420px"
                                width="100%"
                                loading={<Loader2 className="h-5 w-5 animate-spin" />}
                                value={code}
                                onChange={(data) => setCode(data)}
                                language={selectedLanguage.straightName.toLowerCase()}
                                theme={theme === "dark" ? "vs-dark" : ""}
                                options={{
                                    minimap: {
                                        enabled: false,
                                    },
                                    wrappingIndent: "none",
                                    wordWrap: "off",
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: {
                                        top: 10,
                                        bottom: 10,
                                        right: 8,
                                    },
                                    quickSuggestions: false,
                                    links: false,
                                    lineNumbersMinChars: 2,
                                    lineNumbers: "on",
                                    scrollbar: {
                                        vertical: "visible",
                                        horizontal: "visible",
                                    },
                                    suggestLineHeight: 0,
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-0 shadow-sm max-w-full">
                        <div className="bg-muted/20 border border-border flex items-center justify-between px-3 py-1 rounded-b-none rounded-sm">
                            <h1 className="text-sm text-foreground/80">Code Output</h1>
                            <Copy className="!h-3 !w-3" onClick={() => { navigator.clipboard.writeText(output?.output || error.error); toast.success("Copied to clipboard!"); }} />
                        </div>
                        <ScrollArea
                            className="overflow-x-scroll scrollbar-hidden rounded-sm p-3 border border-border border-t-0 h-60 sm:h-[366px] bg-secondary/40 rounded-t-none w-full max-w-full"
                        >
                            {!error ? (
                                output?.error ? (
                                    <span className="text-red-500 font-mono text-sm">{output.error}</span>
                                ) : (
                                    <div
                                        className="text-sm font-mono whitespace-pre-wrap break-words max-w-full"
                                        style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                    >
                                        {output?.output}
                                    </div>
                                )
                            ) : (
                                <div
                                    className="text-sm font-mono whitespace-pre-wrap break-words max-w-full"
                                    style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                >
                                    <span className="text-red-500 font-mono text-sm">{error.error}</span>
                                </div>
                            )}
                            {!error && !output ? !running ? (
                                <span className="text-sm text-foreground/80">No Output.</span>
                            ) : (
                                <span className="text-sm text-foreground/80">Running...</span>
                            ) : ""}
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <div ref={outputElement} className="sm:hidden"></div>
                    </div>
                </div>
            </div>
            <AlertDialog open={shareDialog} onOpenChange={setShareDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader className="text-left">
                        <AlertDialogTitle>Snipped Link Generated!</AlertDialogTitle>
                        <AlertDialogDescription>
                            <p className="-mt-2 mb-3">Share this link with anyone.</p>
                            <Label htmlFor="link">Snippet Link</Label>
                            <Input id="link" className="mt-1" readOnly value={`${location.origin}/s/${pubId}`} />
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <Button onClick={() => { navigator.clipboard.writeText(`${location.origin}/s/${pubId}`); toast.success("Copied to clipboard!"); }}>Copy</Button>
                                <Button onClick={() => setShareDialog(false)} variant="outline">Close</Button>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
