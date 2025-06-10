'use client';

import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />  {}
      <main className="page-content">{children}</main>
      <ToastContainer aria-label="Notification messages" />
    </ThemeProvider>
  );
}
