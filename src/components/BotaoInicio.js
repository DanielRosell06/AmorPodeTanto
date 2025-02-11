
import Link from 'next/link';
import { Button } from "@/components/ui/button"

export default function BotaoInicio( {children} ) {

    return (
        <div className="flex mt-6 h-[60px]">
            <Link href={"/inicio"}>
                <Button className="w-[50px] h-[50px] bg-slate-200 rounded-full ml-8 mt-auto mb-auto hover:bg-slate-400 text-black"><i className="fas fa-arrow-left"></i></Button>
            </Link>
            <h1 className=" text-3xl mt-auto mb-auto ml-3 underline">{children}</h1>
        </div>
    )
}