import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard Admin - Product Next 13",
};
  
export default function AdminLayout({
    children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
    <>
        {children}
    </>
);
}
  