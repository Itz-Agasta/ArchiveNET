"use client";
import { Web3Payment } from "@/components/layout/payment";
import WagmiWrapper from "@/context/WagmiWrapper";
import { WagmiProvider } from "wagmi";

// #TODO: Make this mobile responsive
export default function PaymentsPage() {
    return (
        <div>
            <WagmiWrapper>
                <Web3Payment />
            </WagmiWrapper>
        </div>
    )
}