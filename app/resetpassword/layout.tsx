import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password - Product Next 13",
};
  
export default function ResetPasswordLayout({
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
  