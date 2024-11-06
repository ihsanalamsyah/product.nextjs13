import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/styles/globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Login - Product Next 13",
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
          content="382388236597-cm20345fj4bqid3el0mt9ut3vogl52nt.apps.googleusercontent.com"
        ></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
         <script src="https://accounts.google.com/gsi/client" async></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
