"use client"
import { ThemeSwitcher } from "../ui/theme-switcher";
import Logo from "../ui/logo";
import GetStartedBtn from "./get-started-btn";

export default function Header() {
    return (
        <header className="md:px-20 lg:px-32 flex mb-10 justify-between py-4 px-6 items-center">
            <Logo />
            <div className="flex items-center gap-2">
                <GetStartedBtn />
                <ThemeSwitcher />
            </div>
        </header>
    );
}