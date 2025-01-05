import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";

export const metadata = {
  title: "Codebin",
  description: "Share code with output and syntax highlighting with ease.",
};

const open_sans = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200","300","400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={open_sans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
