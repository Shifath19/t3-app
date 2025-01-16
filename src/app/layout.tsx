
import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-gray-100`}>
        <TRPCReactProvider >
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}