<<<<<<< HEAD
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
=======
import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from "@/components/theme-provider"
>>>>>>> 0f1bc797ecbbc69113df4a55cb15463e2c2e1049

export const metadata: Metadata = {
  title: "SatuPassword",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='min-h-screen light'>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
    </html>
  );
}
