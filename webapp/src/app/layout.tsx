import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "SatuPassword",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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