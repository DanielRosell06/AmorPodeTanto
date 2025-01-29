import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Image from 'next/image';
import { Toaster } from "@/components/ui/sonner"
import Link from 'next/link';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Amor Pode Tanto",
  description: "Sistema Interno Não Sabia Que o Meu Amor Podia Tanto",
};


<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />

export default function Layout({ children }) {
  return (
    <html lang="en">
      
      <head>
        {/* Font Awesome */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          rel="stylesheet"
        />
      </head>


      <body>
        <div className="flex gap-2 justify-between">

          <div className="flex w-[33.3%]">
            <Image
              src='/Logo.png'
              alt='Logo'
              width={84}
              height={50}
              quality={100}
              className="ml-4 mt-[5px] w-[84px] h-[50px]"
            />
          </div>



          <div className="flex w-[33.3%] justify-between">
            <Link href={"/inicio"} className="w-[25%]">
              <button className="bg-white text-black hover:bg-pink-100 hover:shadow-pink-100 transition-all duration-200 ease-in-out transform w-full h-[60px]">
                Início
              </button>
            </Link>
            <Link href={"/doadores"} className="w-[25%]">
            <button className="bg-white text-black hover:bg-pink-100 hover:shadow-pink-100 transition-all duration-200 ease-in-out transform w-full h-[60px]">
                Doadores
              </button>
            </Link>
            <Link href={"/doacoes"} className="w-[25%]">
            <button className="bg-white text-black hover:bg-pink-100 hover:shadow-pink-100 transition-all duration-200 ease-in-out transform w-full h-[60px]">
                Doações
              </button>
              </Link>
            <Link href={"/produtos"} className="w-[25%]">
            <button className="bg-white text-black hover:bg-pink-100 hover:shadow-pink-100 transition-all duration-200 ease-in-out transform w-full h-[60px]">
                Produtos
              </button>
              </Link>
          </div>



          <div className="w-[33.3%]">
            <div className="flex w-[40px] h-[100%] float-right mr-10">
              <a href="#" className="mt-auto mb-auto ">Sair</a>
            </div>
          </div>


        </div>
        <hr></hr>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
