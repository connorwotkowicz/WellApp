import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/scss/App.scss";
import Navbar from "./components/Navbar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wellness Booking App",
  description: "Book 1:1 wellness sessions easily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar isAuthenticated={true} />
        <main className="page-content">{children}</main>
      </body>
    </html>
  );
}
