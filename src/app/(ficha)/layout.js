import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Image from 'next/image';
import Providers from "@/components/Providers"; // Importando o Provider


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ficha de retirada",
  description: "Ficha de retirada",
};


<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <head>
        {/* Font Awesome */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          rel="stylesheet"
        />
      </head>


      <body className="mt-0">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
