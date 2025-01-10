"use client";

import { oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Header from "@/components/page/header";
import { db } from "@/lib/firebase";
import { getCurrentUser } from "@/utils/current-user";
import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Copy, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { LANGUAGE_CONFIG } from '@/app/_constants/config';
import Footer from '@/components/page/footer';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function Page({ params }) {
    const [user, setUser] = useState(null);
    const [snip, setSnip] = useState(null);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [running, setRunning] = useState(false);
    const { theme } = useTheme();

    const getSnip = async (id) => {
        try {
            const userRef = doc(db, 'users', id);
            const snipRef = doc(collection(userRef, 'snippets'), params.id);

            const docSnap = await getDoc(snipRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setSnip(data);
                console.log("Snippet data:", data);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    };

    const executeCode = async (snipdata) => {
        setError(null);
        setOutput(null);
        const code = snipdata.code;
        try {
            setRunning(true);
            const runtime = LANGUAGE_CONFIG[snipdata.language].pistonRuntime;
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
            return;
        }
    };

    useEffect(() => {
        getCurrentUser(setUser);
    }, []);
    useEffect(() => {
        getSnip(user?.uid);
    }, [user]);

    return (
        <div>
            <Header />
            <div className="px-6 md:px-20 lg:px-32 mb-10">
                <h1 className="text-lg font-bold">{snip?.title}</h1>
                <p className="text-sm -mt-0.5 text-foreground/80">{snip?.description ? snip?.description : "No description"}</p>
                <div className="mt-4">
                    <div className='mb-4 flex items-center gap-2'>
                        <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(snip?.code); toast.success("Copied to clipboard!") }}><Copy className='h-4 w-4' /></Button>
                        <Button disabled={running} asChild onClick={() => executeCode(snip)}>
                            <RainbowButton>Run {running ? <Loader2 className="animate-spin h-4 w-4" /> : <Play className="h-4 w-4" />}</RainbowButton>
                        </Button>
                    </div>
                    <div className='sm:grid grid-cols-2 gap-4'>
                        <ScrollArea className='min-h-40 rounded-md'>
                            <SyntaxHighlighter
                                language={snip?.language}
                                style={theme === "dark" ? vscDarkPlus : oneLight}
                                customStyle={{ margin: 0, padding: '10px', borderRadius: '8px', width: '100%', overflowX: 'hidden', overflowY: 'hidden', fontSize: '14px', minHeight: '150px', height: '100%' }}
                            >
                                {snip?.code}
                            </SyntaxHighlighter>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <ScrollArea
                            className={cn("overflow-x-scroll mt-6 sm:mt-0 scrollbar-hidden rounded-sm p-3 border border-border h-60 sm:h-[366px] bg-secondary/40 w-full max-w-full", running && "flex items-center justify-center", !output && "flex items-center justify-center", !error && "flex items-center justify-center")}
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
                                <Loader2 className="animate-spin h-4 w-4" />
                            ) : ""}
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}