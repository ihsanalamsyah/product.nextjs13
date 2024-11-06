import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home - Product Next 13",
};
  
export default function ProductsLayout({
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
  