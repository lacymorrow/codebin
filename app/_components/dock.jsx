"use client"
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { Bell, CodeXml, HelpCircle, Home, LayoutDashboard, Settings, Shield, UserRoundPen } from "lucide-react";
import Link from "next/link";
import { TbCodePlus } from "react-icons/tb";

export default function Dock() {
    const tabs = [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "Snippets", href: "/snippets", icon: CodeXml },
        { title: "Profile", href: "/profile", icon: UserRoundPen },
        { type: "separator" },
        { title: "Create", href: "/create", icon: TbCodePlus, type: "button" },
    ];
    return (
        <div className="fixed z-50 left-0 right-0 bottom-10 mx-auto w-fit">
            <ExpandableTabs tabs={tabs} />
        </div>
    )
}