"use client";
import { useUser } from "@civic/auth/react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { IconMenu2, IconX, IconUser, IconLogout } from "@tabler/icons-react";
import logo from "../../../public/icons/cropped_logo.jpeg";

export default function Navbar() {
    const { signIn, user, signOut } = useUser();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (current) => {
        if (typeof current === "number") {
            const direction = current - scrollY.getPrevious()!;
            if (scrollY.get() < 50) {
                setVisible(true);
            } else {
                setVisible(direction < 0);
            }
        }
    });

    const doSignIn = useCallback(() => {
        console.log("[Navbar] Starting sign-in process");
        signIn()
            .then(() => {
                console.log("[Navbar] Sign in completed successfully");
                router.push("/dashboard");
            })
            .catch((error) => {
                console.error("[Navbar] Sign in failed:", error);
            });
    }, [signIn, router]);

    const doSignOut = useCallback(() => {
        console.log("[Navbar] Starting sign-out process");
        signOut()
            .then(() => {
                console.log("[Navbar] Sign out completed successfully");
                router.push("/");
            })
            .catch((error) => {
                console.error("[Navbar] Sign out failed:", error);
            });
    }, [signOut, router]);

    return (
        <motion.div
            animate={{
                y: visible ? 0 : -100,
                opacity: visible ? 1 : 0,
            }}
            transition={{
                duration: 0.2,
            }}
            className="fixed top-0 inset-x-0 z-50 w-full"
        >
            <div className="absolute inset-0 bg-black border-b border-white/10" />

            <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-3">
                        <img
                            src={logo.src}
                            alt="ArchiveNET Logo"
                            className="h-10 w-10 rounded-lg"
                        />
                        <span className="text-xl font-bold text-white tracking-tight">
                            ArchiveNET
                        </span>
                    </div>

                    {/* User Authentication */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                                >
                                    <IconUser className="h-4 w-4 text-white" />
                                    <span className="text-white text-sm font-medium hidden sm:block">
                                        {user.name || "User"}
                                    </span>
                                </button>

                                {/* User Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-lg shadow-lg border border-white/10 py-2"
                                    >
                                        <div className="px-4 py-2 border-b border-white/10">
                                            <p className="text-sm text-gray-300">Signed in as</p>
                                            <p className="text-sm font-medium text-white truncate">
                                                {user.email || user.name}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                router.push("/dashboard");
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                doSignOut();
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                                        >
                                            <IconLogout className="h-4 w-4" />
                                            <span>Sign out</span>
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <Button
                                variant="default"
                                onClick={doSignIn}
                                className="p-2 text-black bg-white rounded-lg text-sm font-[bold]"
                            >
                                Sign In
                            </Button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
                        >
                            {isMobileMenuOpen ? (
                                <IconX className="h-5 w-5 text-white" />
                            ) : (
                                <IconMenu2 className="h-5 w-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-4 pb-4"
                    >
                        <div className="bg-black/30 backdrop-blur-md rounded-lg border border-white/10 p-4 space-y-3">

                            {!user && (
                                <Button
                                    variant="default"
                                    onClick={() => { doSignIn; setIsMobileMenuOpen(false); }}
                                    className="p-2 text-black bg-white rounded-2xl"
                                >
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </nav>
        </motion.div>
    );
}