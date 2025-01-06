import Logout from "@/components/auth/logout";
import Logo from "@/components/ui/logo";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export default function Header() {
    return (
        <header className="md:px-20 lg:px-32 flex mb-10 justify-between py-4 px-6 items-center">
            <Logo />
            <div className="flex items-center gap-2">
                <Logout />
                <ThemeSwitcher />
            </div>
        </header>
    );
}