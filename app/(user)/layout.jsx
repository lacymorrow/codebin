import Footer from "@/components/page/footer";
import Dock from "../_components/dock";
import Header from "../_components/header";

export default function RootLayout({ children }) {
  return (
    <main>
      <Header />
      {children}
      <Footer />
      <Dock />
    </main>
  );
}
