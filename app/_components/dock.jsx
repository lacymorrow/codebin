"use client"
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { CodeXml, Home, Plus, UserRound } from "lucide-react";

export default function Dock() {
    const tabs = [
        // { title: "Dashboard", href: "/dashboard", icon: Home },
        // { title: "Snippets", href: "/snippets", icon: CodeXml },
        { title: "Profile", href: "/me", icon: UserRound },
        { type: "separator" },
        { type: "button", title: "Create", href: "/new" },
    ];
    return (
        <div className="fixed z-50 left-0 right-0 bottom-5 mx-auto w-fit">
            <ExpandableTabs tabs={tabs} />
        </div>
    )
}