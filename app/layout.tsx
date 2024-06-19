import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from 'next/head';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rumah"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-signin-client_id"
          content="507909387104-c04gsjipd57or5uuoeie1d95kqb60s3d.apps.googleusercontent.com"
        ></meta>
         <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className={inter.className}>
      
        {children}
        </body>
    </html>
  );
}
