"use client";

import { Card, CardContainer, CardTitle, CardBlock, CardButton } from "../../components/card"
import { Header, HeaderLogo, HeaderNav } from "../../components/header"
import Button from "../../components/button";
import StyledLink from "../../components/styledLink"
import Error from "../../components/error";
import Warning from "../../components/warning";
import ProfileCard from "../../components/profileCard";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from 'next/navigation';
import { create } from "domain";

const SERVER = "http://127.0.0.1:38321";
// const SERVER = "https://problem-dating-app.cnicholson.hackclub.app";

export default function Home() {
    const [_id, setID] = useState("");

    const [image, setImage] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [x, setX] = useState("");
    const [gitHub, setGitHub] = useState("");
    const [personalWebsite, setPersonalWebsite] = useState("");

    const [bio, setBio] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [availability, setAvailability] = useState("");

    const [needHelp, setNeedHelp] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [helpDescription, setHelpDescription] = useState("");
    const [projectLink, setProjectLink] = useState("");
    const [timeFrame, setTimeFrame] = useState(0);

    const [skills, setSkills] = useState([]);
    const [skillLevels, setSkillLevels] = useState<{ [key: string]: number }>({});
    const [themes, setThemes] = useState([]);

    const [polled, setPolled] = useState(false);
    const [noUser, setNoUser] = useState(false);

    const [warningMessage, setWarningMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { user, isLoading } = useUser();
    const router = useRouter();

    // Basic auth
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/api/auth/login");
        }
    }, [isLoading, user, router]);

    // useEffect(() => {
    //     if (!isLoading && user) {
    //         const getStatus = async () => {
    //             try {
    //                 const response = await fetch(SERVER + "/api/get-status", {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({ auth0_id: user.sub }),
    //                 });
    //                 if (!response.ok) {
    //                     const error = await response.json();
    //                     setErrorMessage("Server-side error: " + error.error);
    //                 } else {
    //                     const data = await response.json();

    //                     if (data.someSettings ?? false) {
    //                         const message = encodeURIComponent("You were redirected here because some fields are not filled out or a new field was added.");
    //                         router.push(`/settings?redirectMessage=${message}`);
    //                     }
    //                     if (data.noSettings ?? false) {
    //                         const message = encodeURIComponent("You were redirected because this is your first time using the platform and you need to complete onboarding.");
    //                         router.push(`/onboarding?redirectMessage=${message}`);
    //                     }
    //                 }
    //             } catch (error) {
    //                 console.error("Failed to fetch settings:", error);
    //                 setErrorMessage("Client-side error: " + error);
    //             }
    //         };

    //         getStatus();
    //     }
    // }, [isLoading, user, router]);

    // Verification 
    function isValidURL(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    const getProfile = useCallback(async () => {
        try {
            const response = await fetch(SERVER + "/api/get-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: _id }),
            });
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage(error.error);
                // setErrorMessage("Server-side error: " + error.error);
                setNoUser(error.noUser);
                setPolled(false);
            } else {
                setErrorMessage("");
                setPolled(true);

                const data = await response.json();

                console.log(data);

                setName(data.user.name || "");
                setEmail(data.user.email || "");
                setLinkedIn(data.user.linkedIn || "");
                setX(data.user.x || "");
                setGitHub(data.user.gitHub || "");
                setPersonalWebsite(data.user.personalWebsite || "");

                setBio(data.user.bio || "");
                setCountry(data.user.country || "");
                setCity(data.user.city || "");
                setAvailability(data.user.availability || "");

                setNeedHelp(data.user.needHelp || false);
                setProjectName(data.user.projectName || "");
                setProjectDescription(data.user.projectDescription || "");
                setHelpDescription(data.user.helpDescription || "");
                setProjectLink(data.user.projectLink || "");
                setTimeFrame(data.user.timeFrame || "");

                setSkills(data.user.skills || []);
                setSkillLevels(data.user.skillLevels || {});
                setThemes(data.user.themes || []);

                setImage(data.user.image);
            }
        } catch (error) {
            console.error("Error: Failed to fetch settings: ", error);
            setErrorMessage("Client-side error: " + error);
            setPolled(false);
        }
    }, [_id]);

    // Get _id 
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const result = params.get('_id');
        if (result) {
            setID(result);
        } else {
            setErrorMessage("No _id provided. Redirecting to home page...");
            setTimeout(() => {
                router.push("/");
            }, 2500);
        }
    }, [router]);

    // Get profile on page load 
    useEffect(() => {
        if (!isLoading && user && _id !== "") {
            getProfile();
        }
    }, [isLoading, user, getProfile, _id]);

    return (
        <>
            <Header>
                <HeaderLogo href="/">
                    <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
                </HeaderLogo>
                <HeaderNav>
                    <StyledLink href="/chat" className="h-full w-fit flex items-center no-underline">
                        <span title="Chat" className="material-symbols-outlined">mail</span>
                    </StyledLink>
                    <StyledLink href="/match" className="h-full w-fit flex items-center no-underline">
                        <span title="Match" className="material-symbols-outlined">hub</span>
                    </StyledLink>
                    <StyledLink href="/settings" className="h-full w-fit flex items-center no-underline">
                        <span title="Settings" className="material-symbols-outlined">settings</span>
                    </StyledLink>
                    <Button href="/api/auth/logout">Logout</Button>
                </HeaderNav>
            </Header>

            {errorMessage !== "" && (
                <Error className="w-full sm:w-1/2 mt-24">{errorMessage}</Error>
            )}

            {warningMessage !== "" && (
                <Warning onClick={() => setWarningMessage("")} className={`w-full sm:w-1/2 ${errorMessage !== "" ? 'mt-5' : 'mt-24'}`}>{warningMessage}</Warning>
            )}

            <CardContainer className={`sm:w-3/4 lg:w-2/3 xl:w-1/2 w-full ${(errorMessage !== "" || warningMessage !== "") ? 'mt-5' : 'mt-24'}`}>
                <Card className="w-full">
                    {isLoading && !user && !polled ? (
                        <p>Loading...</p>
                    ) : errorMessage !== "" ? (
                        noUser ? (
                            <p>This user does not exist!</p>
                        ) : (
                            <p>Looks like you{"'"}re not getting this profile... our backend might be down. Try reloading or coming back later.</p>
                        )
                    ) : (
                        <>
                            <ProfileCard user={{
                                match_id: _id,
                                name,
                                email,
                                linkedIn,
                                x,
                                gitHub,
                                personalWebsite,
                                image,
                                bio,
                                country,
                                city,
                                availability,
                                needHelp,
                                projectName,
                                projectDescription,
                                helpDescription,
                                projectLink,
                                timeFrame,
                                skills,
                                skillLevels,
                                themes,
                            }} />
                        </>
                    )}
                </Card>
            </CardContainer >
        </>
    );
}

