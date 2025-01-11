"use client";

import { oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Header from "@/components/page/header";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Copy, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { LANGUAGE_CONFIG } from '@/app/_constants/config';
import Footer from '@/components/page/footer';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function Page({ params }) {
    const [snip, setSnip] = useState(null);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [running, setRunning] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notValid, setNotValid] = useState(false);
    const { theme } = useTheme();
    const outputElement = useRef(null);


    const getSnip = async (id) => {
        try {
            setLoading(true);
            const snipRef = doc(db, 'snippets', params.id); // Fetch snippet directly from the root-level 'snippets' collection
            const docSnap = await getDoc(snipRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setSnip(data);
            } else {
                setNotValid(true);
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
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

            // handle API-level errors
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

    useEffect(() => {
        getSnip();
    }, []);

    if (loading) {
        return (
            <div>
                <Header />
                <div className="px-6 md:px-20 lg:px-32 mb-10">
                    <div className='grid gap-2'>
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-52" />
                    </div>
                    <div className='flex mt-4 gap-2 items-center'>
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                    <div className='mt-5 grid gap-4'>
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
                <Footer />
            </div>
        )
    };
    if (notValid) {
        return (
            <div className='relative'>
                <img
                    src="/bg_gradient.avif"
                    className="absolute w-full -z-50 -top-0"
                />
                <Header />
                <div className="px-6 md:px-20 lg:px-32 mt-32 h-[300px]">
                    <div className='text-center grid place-items-center'>
                        <h1 className="text-3xl mb-2 font-medium">Snippet not found</h1>
                        <p className="text-sm -mt-0.5 text-foreground/80">The snippet you are looking for does not exist or has been deleted.</p>
                        <p className="text-sm -mt-0.5 text-foreground/80">Please check the URL and try again.</p>
                        <div className='mt-4 grid-cols-2 grid gap-2'>
                            <Button asChild>
                                <Link href="/">Go Home</Link>
                            </Button>
                            <Button variant="outline" onClick={() => getSnip()}>Refresh</Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
    return (
        <div>
            <Header />
            <div className="px-6 md:px-20 lg:px-32 mb-10">
                <h1 className="text-lg font-bold">{snip?.title}</h1>
                <p className="text-sm -mt-0.5 text-foreground/80">{snip?.desc ? snip?.desc : "No description"}</p>
                <div className="mt-4">
                    <div className='mb-6 flex items-center gap-2'>
                        <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(snip?.code); toast.success("Copied to clipboard!") }}><Copy className='h-4 w-4' /></Button>
                        <Button disabled={running} asChild onClick={() => executeCode(snip)}>
                            <RainbowButton>Run {running ? <Loader2 className="animate-spin h-4 w-4" /> : <Play className="h-4 w-4" />}</RainbowButton>
                        </Button>
                    </div>
                    <div className='sm:grid grid-cols-2 gap-4'>
                        <ScrollArea className='min-h-40 rounded-md'>
                            <SyntaxHighlighter
                                language={snip?.language}
                                style={theme !== "light" ? vscDarkPlus : oneLight}
                                customStyle={{ margin: 0, padding: '10px', borderRadius: '8px', width: '100%', overflowX: 'hidden', overflowY: 'hidden', fontSize: '14px', minHeight: '256px', height: '100%' }}
                            >
                                {snip?.code}
                            </SyntaxHighlighter>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <ScrollArea
                            className={"relative overflow-x-scroll mt-3 sm:mt-0 scrollbar-hidden rounded-sm p-3 border border-border h-60 sm:h-[366px] bg-secondary/40 w-full max-w-full"}>
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
                                <div className='h-full w-full z-10 flex items-center justify-center absolute top-0 left-0 right-0'>
                                    <span className="text-sm text-foreground/80">No Output.</span>
                                </div>
                            ) : (
                                <div className='h-full w-full z-10 flex items-center justify-center absolute top-0 left-0 right-0'>
                                    <Loader2 className="animate-spin h-4 w-4" />
                                </div>
                            ) : ""}
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <div ref={outputElement} className="sm:hidden"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
