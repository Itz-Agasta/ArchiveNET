"use client";
import { useUser } from "@civic/auth/react";
import { useCallback } from "react";

export default function CustomSignIn() {
    const { signIn, user } = useUser();

    const doSignIn = useCallback(() => {
        console.log("[Page] Starting sign-in process");
        signIn()
            .then(() => {
                console.log("[Page] Sign in completed successfully");
            })
            .catch((error) => {
                console.error("[Page] Sign in failed:", error);
            });
    }, [signIn]);

    return (
        <>
            {!user && (
                <button
                    onClick={doSignIn}
                    style={{
                    }}
                >
                    Sign in
                </button>
            )}
        </>
    );
}