"use client";

import { Card, CardTitle, CardContainer } from "../components/card";
import { Header, HeaderLogo } from "../components/header";
import Error from "../components/error";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function NotFound() {
    const { user, isLoading } = useUser();
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState("");
    const [redirectCountdown, setRedirectCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setRedirectCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                }
                return prev - 1;
            });
        }, 1000);

        if (redirectCountdown === 0) {
            if (!isLoading && !user) {
                router.push("/api/auth/login");
            }
            if (!isLoading && user) {
                router.push("/match");
            }
        }

        if (redirectCountdown < 0) {
            setRedirectCountdown(0);
        }

        return () => clearInterval(timer);
    }, [user, isLoading, router, redirectCountdown]);

    return (
        <>
            <Header>
                <HeaderLogo href="/" className="">
                    <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
                </HeaderLogo>
            </Header>

            <CardContainer>
                <Card className="w-full">
        
                        <>
                            <CardTitle>
                                404 - page not found!
                            </CardTitle>
                        Redirecting you in {redirectCountdown} {redirectCountdown == 1 ? "second" : "seconds"}...
                        </>
                
                </Card>
            </CardContainer >
        </>
    );
}