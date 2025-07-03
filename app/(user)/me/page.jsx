"use client";
import Logout from "@/components/auth/logout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import createSnippet from "@/server_functions/createSnippet";
import getUserSnippets from "@/server_functions/getUserSnippets";
import { getCurrentUser } from "@/utils/current-user";
import {
  Copy,
  Edit,
  Loader2,
  MoreHorizontal,
  Play,
  Share,
  Share2,
  Trash,
  Trash2,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
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
} from "@/components/ui/credenza";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  oneLight,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { runCode } from "@/app/_constants/runcode";
import { LANGUAGE_CONFIG } from "@/app/_constants/config";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Pencil } from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const { theme, resolvedTheme } = useTheme();
  const [run, setRun] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [curSnipData, setCurSnipData] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [runningSnip, setRunningSnip] = useState(false);

  const fetchSnippets = async () => {
    if (!user) return;
    try {
      setloading(true);
      const snippets = await getUserSnippets(user.uid);
      setSnippets(snippets);
      console.log(snippets);
    } catch (error) {
      console.error("Error fetching snippets:", error);
    } finally {
      setloading(false);
    }
  };

  const deleteSnippet = async (id) => {
    try {
      setloading(true);
      await deleteDoc(doc(db, "snippets", id));
      toast.success("Snippet deleted successfully.");
      fetchSnippets();
    } catch (error) {
      console.error("Error deleting snippet:", error);
      toast.error("Failed to delete the snippet.");
    } finally {
      setloading(false);
    }
  };

  const executeCode = async (i) => {
    setError(null);
    setOutput(null);
    const code = i.code;
    try {
      setRunningSnip(true);
      const runtime = LANGUAGE_CONFIG[i.language].pistonRuntime;
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
      setRunningSnip(false);
      return;
    }
  };

  const runCodeSnippet = (data) => {
    setCurSnipData(null);
    setCurSnipData(data);
    setRunDialogOpen(true);
    executeCode(data);
  };

  useEffect(() => {
    if (!user) {
      getCurrentUser(setUser);
    }
  }, []);
  useEffect(() => {
    if (!snippets.length) {
      fetchSnippets();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="fixed top-0 left-0 right-0 h-full w-full bg-background flex items-center justify-center z-[99999]">
        <Loader2 className="h-5 w-5 animate-spin"/>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-20 lg:px-32">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <img
            src={user.photoURL}
            alt={`${user.displayName}'s avatar`}
            className="w-10 h-10 rounded-2xl"
            width={50}
            height={50}
          />
          <div className="h-full">
            <h1 className="text-md">
              Welcome,{" "}
              <span className="font-bold font-geist">{user.displayName}</span>
            </h1>
            <div className="flex items-center gap-3">
              <h1 className="text-sm text-foreground/80">
                {snippets.length || 0} Snippets Shared 🎉
              </h1>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href="/new">Create</Link>
        </Button>
      </div>
      <div className="mt-14 grid gap-4 mb-10">
        <h1 className="text-sm text-foreground/80">My Snippets —</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {snippets &&
            snippets.map((snippet) => (
              <div
                key={snippet.id}
                className="border flex flex-col border-border h-full bg-card rounded-md p-2 shadow-sm overflow-hidden"
              >
                <div className="rounded-md mb-4">
                  <ScrollArea className="scrollbar-hidden h-40 rounded-md overflow-hidden">
                    <SyntaxHighlighter
                      language={snippet.language}
                      style={resolvedTheme === "dark" ? vscDarkPlus : oneLight}
                      wrapLines
                      customStyle={{
                        margin: 0,
                        padding: "10px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        width: "100%",
                        overflowX: "hidden",
                        overflowY: "hidden",
                        fontSize: "13px",
                        minHeight: "150px",
                      }}
                    >
                      {snippet.code}
                    </SyntaxHighlighter>
                  </ScrollArea>
                </div>
                <div className="flex justify-between flex-col px-1 h-full">
                  <div className="grid">
                    <div className="mb-2 -mt-2">
                      <Badge>{snippet.language}</Badge>
                    </div>
                    <h1 className="text-base font-medium">{snippet.title}</h1>
                    <p className="text-sm text-foreground/80">
                      {snippet.desc
                        ? snippet.desc.slice(0, 70)
                        : "No description"}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center justify-between mt-2">
                    <div className="flex gap-2 items-center">
                      <Button size="icon" asChild variant="outline">
                        <Link href={`/edit/${snippet.id}`}>
                          <Pencil className="h-3 w-3" />
                        </Link>
                      </Button>
                      <Credenza>
                        <CredenzaTrigger asChild>
                          <Button variant="outline">
                            Share <Share2 className="h-4 w-4" />
                          </Button>
                        </CredenzaTrigger>
                        <CredenzaContent>
                          <CredenzaHeader>
                            <CredenzaTitle className="text-left">
                              {snippet.title}
                            </CredenzaTitle>
                            <CredenzaDescription className="text-left">
                              <div className="mt-2 grid gap-2">
                                <Label htmlFor="link">
                                  This is your public link to share:
                                </Label>
                                <Input
                                  id="link"
                                  defaultValue={`${location.origin}/s/${snippet.id}`}
                                  readOnly
                                />
                                <Button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `${location.origin}/s/${snippet.id}`,
                                    );
                                    toast.success("Link copied!");
                                  }}
                                  size="sm"
                                >
                                  Copy
                                </Button>
                              </div>
                            </CredenzaDescription>
                          </CredenzaHeader>
                        </CredenzaContent>
                      </Credenza>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/edit/${snippet.id}`}
                            className="flex gap-2 items-center justify-between"
                          >
                            Edit <Pencil className="h-4 w-4" />
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex gap-2 items-center justify-between"
                          onClick={() => {
                            navigator.clipboard.writeText(snippet.code);
                            toast.success("Code copied!");
                          }}
                        >
                          Copy <Copy className="h-4 w-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => runCodeSnippet(snippet)}
                          className="flex gap-2 items-center justify-between"
                        >
                          Run <Play className="h-4 w-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex gap-2 hover:!bg-red-600 hover:!text-red-50 items-center justify-between text-red-500"
                          onClick={() => deleteSnippet(snippet.id)}
                        >
                          Delete <Trash className="h-4 w-4" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          {!snippets[0] && !loading && (
            <div className="flex gap-2 items-center h-64 justify-center border border-border rounded-md">
              <p className="text-foreground/80 text-sm">No snippets found.</p>
            </div>
          )}
          {loading && (
            <div className="flex gap-2 items-center h-64 justify-center rounded-md">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
          <Credenza open={runDialogOpen} onOpenChange={setRunDialogOpen}>
            <CredenzaTrigger asChild></CredenzaTrigger>
            <CredenzaContent>
              <CredenzaHeader>
                <CredenzaTitle className="text-left">
                  {curSnipData?.title}
                </CredenzaTitle>
                <CredenzaDescription className="text-left">
                  <p>
                    {curSnipData?.desc
                      ? curSnipData?.desc.slice(0, 70)
                      : "No description"}
                  </p>
                  {output && !runningSnip && (
                    <ScrollArea className="h-44 p-2 overflow-hidden w-full rounded-md bg-secondary/40 border border-border mt-5">
                      <div
                        className="text-sm rounded-md h-44 font-mono whitespace-pre-wrap break-words max-w-full"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {output?.output}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  )}
                  {runningSnip && (
                    <div className="h-44 w-full rounded-md flex items-center justify-center bg-secondary/40 border border-border mt-5">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                  {error && (
                    <ScrollArea className="h-44 overflow-hidden w-full rounded-md bg-secondary/40 border border-border mt-5">
                      <div
                        className="text-sm p-2 rounded-md text-red-500 h-44 font-mono whitespace-pre-wrap break-words max-w-full"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {error?.error}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  )}
                </CredenzaDescription>
              </CredenzaHeader>
            </CredenzaContent>
          </Credenza>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
