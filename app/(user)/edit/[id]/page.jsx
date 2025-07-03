"use client";

import {
  oneLight,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Header from "@/components/page/header";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { LANGUAGE_CONFIG } from "@/app/_constants/config";
import Footer from "@/components/page/footer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Editor } from "@monaco-editor/react";
import { Save } from "lucide-react";
import updateSnippet from "@/server_functions/updateSnippet";
import { getCurrentUser } from "@/utils/current-user";

export default function Page({ params }) {
  const [snip, setSnip] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notValid, setNotValid] = useState(false);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { resolvedTheme: theme } = useTheme();
  const outputElement = useRef(null);
  const [user, setUser] = useState(null);

  const getSnip = async (id) => {
    try {
      setLoading(true);
      const snipRef = doc(db, "snippets", id);
      const docSnap = await getDoc(snipRef);
      console.log(docSnap);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.author !== user.uid) {
          toast.error("Unauthorized: You are not the author of this snippet");
          setNotValid(true);
          return;
        }
        setSnip(data);
        setTitle(data.title);
        setDesc(data.desc);
        setCode(data.code);
      } else {
        setNotValid(true);
        toast.error("Snippet not found with ID:", id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async (snipdata) => {
    setError(null);
    setOutput(null);
    const codex = code || snipdata?.code;
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
          files: [{ content: codex }],
        }),
      });

      const data = await response.json();

      console.log("data back from piston:", data);

      // handle API-level errors
      if (data.message) {
        return setOutput({
          error: data.message,
          executionResult: { code, output: "", error: data.message },
        });
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

  const handleUpdateSnippet = async () => {
    setUpdating(true);
    try {
      await updateSnippet(params.id, {
        author: user?.uid,
        code: code,
        title: title,
        desc: desc,
      });
      console.log("Snippet updated with ID:", params.id);
      setUpdating(false);
      toast.success("Snippet updated successfully");
    } catch (error) {
      console.error("Error updating snippet:", error);
      toast.error("Error updating snippet");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    getCurrentUser(setUser);
  }, []);

  useEffect(() => {
    getSnip(params.id);
  }, [user]);

  if (loading) {
    return (
      <div className="px-6 md:px-20 lg:px-32 mb-10">
        <div className="grid gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="flex mt-4 gap-2 items-center">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="mt-5 grid gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  if (notValid) {
    return (
      <div className="px-6 md:px-20 lg:px-32 mt-32 h-[300px]">
        <div className="text-center grid place-items-center">
          <h1 className="text-3xl mb-2 font-medium">Snippet not found</h1>
          <p className="text-sm -mt-0.5 text-foreground/80">
            The snippet you are looking for does not exist or you didn't own it.
          </p>
          <p className="text-sm -mt-0.5 text-foreground/80">
            Please check the URL and try again.
          </p>
          <div className="mt-4 grid-cols-2 grid gap-2">
            <Button asChild>
              <Link href="/me">Go Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={() => getSnip()}>
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="px-6 md:px-20 lg:px-32 mb-10">
      <h1
        contentEditable
        onInput={(e) => setTitle(e.target.innerText)}
        className="text-lg font-bold"
      >
        {snip?.title}
      </h1>
      <p
        contentEditable
        onInput={(e) => setDesc(e.target.innerText)}
        className="text-sm -mt-0.5 text-foreground/80"
      >
        {snip?.desc ? snip?.desc : "No description"}
      </p>
      <div className="mt-4">
        <div className="flex items-start justify-between">
          <div className="mb-6 flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`${location.origin}/s/${params.id}`);
                toast.success("Copied to clipboard!");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              disabled={running}
              asChild
              onClick={() => executeCode(snip)}
            >
              <RainbowButton>
                Run{" "}
                {running ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </RainbowButton>
            </Button>
          </div>
          <Button disabled={updating} asChild onClick={handleUpdateSnippet}>
            <RainbowButton>
              Save{" "}
              {!updating ? (
                <Save className="h-4 w-4" />
              ) : (
                <Loader2 className="animate-spin h-4 w-4" />
              )}
            </RainbowButton>
          </Button>
        </div>
        <div className="sm:grid grid-cols-2 gap-4">
          <div className="rounded-sm shadow-sm overflow-hidden">
            <div className="bg-muted/20 border border-border flex items-center justify-between px-3 py-1 rounded-b-none rounded-sm">
              <h1 className="text-sm">Editing {snip?.title}</h1>
            </div>
            <div className="rounded-sm rounded-t-none border border-border border-t-0 overflow-hidden">
              <Editor
                height="420px"
                width="100%"
                loading={<Loader2 className="h-5 w-5 animate-spin" />}
                value={snip?.code}
                onChange={(data) => setCode(data)}
                language={snip?.language}
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
          <ScrollArea
            className={
              "relative overflow-x-scroll mt-3 sm:mt-0 scrollbar-hidden rounded-sm p-3 border border-border h-60 sm:h-[366px] bg-secondary/40 w-full max-w-full"
            }
          >
            {!error ? (
              output?.error ? (
                <span className="text-red-500 font-mono text-sm">
                  {output.error}
                </span>
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
                <span className="text-red-500 font-mono text-sm">
                  {error.error}
                </span>
              </div>
            )}
            {!error && !output ? (
              !running ? (
                <div className="h-full w-full z-10 flex items-center justify-center absolute top-0 left-0 right-0">
                  <span className="text-sm text-foreground/80">No Output.</span>
                </div>
              ) : (
                <div className="h-full w-full z-10 flex items-center justify-center absolute top-0 left-0 right-0">
                  <Loader2 className="animate-spin h-4 w-4" />
                </div>
              )
            ) : (
              ""
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div ref={outputElement} className="sm:hidden"></div>
        </div>
      </div>
    </div>
  );
}
