import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/scss/App.scss";
import ClientLayout from "./components/ClientLayout";
import { Metadata } from "next";
import { AuthProvider } from './context/AuthContext';  

import Footer from './components/Footer'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


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
        {}

        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
