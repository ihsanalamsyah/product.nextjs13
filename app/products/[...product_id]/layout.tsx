import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { product_id: string } }): Promise<Metadata> {
    const product_id = Number(params.product_id);
    return {
        title: `Product Detail ${product_id} - Product Next 13`,
    };
}
  
export default function ProductDetailLayout({
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
  