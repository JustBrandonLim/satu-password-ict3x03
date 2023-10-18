import Navbar from "@components/navigation-bar";
import Footer from "@components/page-footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-col min-h-screen grow bg-[#F1F5F9]">
        <Navbar />
        {children}
      </main>
      <Footer />
    </>
  );
}