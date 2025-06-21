"use client";
import { useUser } from "@civic/auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../ui/Navbar"

export const Dashboard = ({ showNavbar = true }: { showNavbar?: boolean }) => {
    const { user, signIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            // Redirect to sign-in if user is not authenticated
            signIn().catch((error) => {
                console.error("[Dashboard] Sign in failed:", error);
                router.push("/");
            });
        }
    }, [user, signIn, router]);

    // Don't render dashboard content if user is not authenticated
    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Authenticating...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="text-white text-xl flex-1 p-4 bg-black">
            {showNavbar && <Navbar />}
            <div className="p-6">
                Dashboard
            </div>
        </div>
    )
}