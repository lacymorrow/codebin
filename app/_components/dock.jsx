"use client"
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { CodeXml, Home, Plus, UserRoundPen } from "lucide-react";

export default function Dock() {
    const tabs = [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "Snippets", href: "/snippets", icon: CodeXml },
        { title: "Profile", href: "/profile", icon: UserRoundPen },
        { type: "separator" },
        { type: "button", title: "Create", href: "/create" },
    ];
    return (
        <div className="fixed z-50 left-0 right-0 bottom-10 mx-auto w-fit">
            <ExpandableTabs tabs={tabs} />
        </div>
    )
}