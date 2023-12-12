"use client";
import { SessionProvider } from 'next-auth/react'
import { Flip, ToastContainer } from "react-toastify";
import "./globals.css";
import "./data-tables-css.css";
import "react-toastify/dist/ReactToastify.css";

export default function Root({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar
          newestOnTop={true}
          closeOnClick
          draggable
          pauseOnHover
          theme="colored"
          transition={Flip}
        />
      </body>
    </html>
  );
}