import Link from "next/link";
import { AiFillCode } from "react-icons/ai";
export default function Logo() {
    return (
        <Link href="/">
            <div className="flex items-center gap-1">
                <h1 className="text-xl font-bold">Codebin</h1>
                <AiFillCode className="h-5 w-5" />
            </div>
        </Link>
    )
}