import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search Product - Product Next 13",
};

export default function SearchLayout({
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
  