import { cn } from "@/lib/utils";
import Link from "next/link";
import { AiFillCode } from "react-icons/ai";
export default function Logo({ className }) {
  return (
    <Link href="/">
      <div className={cn("flex items-center gap-1", className)}>
        <h1 className="text-xl font-bold">Codebin</h1>
        <AiFillCode className="h-5 w-5" />
      </div>
    </Link>
  );
}
