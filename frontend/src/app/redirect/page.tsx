"use client";

import { Card, CardTitle, CardContainer } from "../../components/card";
import { Header, HeaderLogo } from "../../components/header";
import Error from "../../components/error";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useUser } from "@auth0/nextjs-auth0/client";

const SERVER = "http://127.0.0.1:38321";

export default function Home() {
    const { user, isLoading } = useUser();
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!isLoading && user) {
            const getStatus = async () => {
                try {
                    const response = await fetch(SERVER + "/api/get-status", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: user.sub }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        setErrorMessage("Server-side error: " + error.error);
                    } else {
                        const data = await response.json();

                        if (data.allSettings ?? false) {
                            router.push("/match");
                        }
                        if (data.someSettings ?? false) {
                            router.push(`/settings?someSettings=true&redirectMessage=${encodeURIComponent(data.redirectMessage)}&missingFields=${encodeURIComponent(data.missingFields)}`);
                        }
                        if (data.noSettings ?? false) {
                            router.push("/onboarding");
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch settings:", error);
                    setErrorMessage("Client-side error: " + error);
                }
            };

            getStatus();
        }
    }, [isLoading, user, router]);

    return (
        <>
            <Header>
                <HeaderLogo href="/" className="">
                    <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
                </HeaderLogo>
            </Header>

            {errorMessage !== "" && <Error>{errorMessage}</Error>}

            <CardContainer className={`${errorMessage !== "" ? "mt-5" : "mt-0"}`}>
                <Card className="w-full">
                    {errorMessage !== "" ? (
                        <>
                            <CardTitle>
                                We{"'"}re down right now
                            </CardTitle>
                            Try reloading or coming back later
                        </>
                    ) : (
                        <>
                            <CardTitle>
                                Hang tight
                            </CardTitle>
                            We are we redirecting you...
                        </>
                    )}
                </Card>
            </CardContainer >
        </>
    );
}