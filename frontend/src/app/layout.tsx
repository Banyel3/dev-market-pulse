import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import RightPanel from "@/components/layout/RightPanel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevMarket Pulse",
  description: "Job Market Analytics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="min-h-screen flex">
          <Sidebar />

          <div className="flex-1 flex flex-col ml-64 xl:mr-80 transition-all duration-300">
            <Header />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
          </div>

          <RightPanel />
        </div>
      </body>
    </html>
  );
}
