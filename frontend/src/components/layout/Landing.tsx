import { NavBar } from "./NavBar";
import background from "../../../public/pictures/blackhole_bg.jpg"
import Image from "next/image";
import { UserButton } from "@civic/auth/react";
import { ThreeDCardDemo } from "./ThreeDCard";

export const Landing = () => {
    return (
        <>
            <Image src={background} alt="Background" className="absolute inset-0 object-cover w-full h-full z-[-1]" />
            <div className="w-full bg-transparent h-screen">
                <NavBar />
            </div>

            <div className="absolute bottom-0 left-0 p-4 max-w-[40%]">
                <div>
                    <h1 className="font-[Black] text-white text-4xl">WORLD'S FIRST DECENTRALIZED PROTOCOL FOR LLMS</h1>
                    <h2 className="font-[semiBold] text-white text-md mt-5">Introducing the world&apos;s first decentralized protocol for Agentic Models — a trustless, scalable framework that lets AI agents access, store, and manage context securely across networks. Built for interoperability, privacy, and permanence, it redefines how large language models collaborate and learn over time.</h2>
                </div>
            </div>

            {/* Lower right corner div */}
            <div className="absolute bottom-0 right-0 p-4">

            </div>
        </>
    )
}