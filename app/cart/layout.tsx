import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cart - Product Next 13",
};

export default function CartLayout({
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
  