import Navbar from "@components/navigation-bar";
import Footer from "@components/page-footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"h-screen flex flex-col"}>
      <main className="grow flex flex-col">
        <Navbar />
        {children}
      </main>
      <Footer />
    </div>
  );
}
