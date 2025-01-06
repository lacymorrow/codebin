import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";
import { Button } from "../ui/button";
import { RainbowButton } from "../ui/rainbow-button";
import Logo from "../ui/logo";

export default function Header() {
    return (
        <header className="md:px-20 lg:px-32 flex mb-10 justify-between py-3 px-6 items-center">
            <Logo />
            <div className="flex items-center gap-2">
                <Link href="/dashboard">
                    <Button asChild>
                        <RainbowButton>Get Started</RainbowButton>
                    </Button>
                </Link>
                <ThemeSwitcher />
            </div>
        </header>
    );
}