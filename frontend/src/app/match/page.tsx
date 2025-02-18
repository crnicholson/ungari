"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from 'next/navigation';
import { Header, HeaderLogo, HeaderNav } from "../../components/header"
import GradientButton from "../../components/button";
import { Card, CardContainer, CardTitle, CardContent, CardSubtitle, CardBlock, CardButton } from "../../components/card"
import StyledLink from "../../components/styledLink"
import Error from "../../components/error";
import ProfileCard from "../../components/profileCard";

const SERVER = "http://127.0.0.1:38321";
// const SERVER = "https://problem-dating-app.cnicholson.hackclub.app";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [needHelp, setNeedHelp] = useState(false);
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("");
  const [skills, setSkills] = useState([]);
  const [themes, setThemes] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [helpDescription, setHelpDescription] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [timeFrame, setTimeFrame] = useState(0);
  const [polled, setPolled] = useState(false);
  const [settingsPresent, setSettingsPresent] = useState(true);
  const [noMatch, setNoMatch] = useState(false);
  const [imageLink, setImageLink] = useState("");

  const [redirecting, setRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [errorPresent, setErrorPresent] = useState(false);

  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [isLoading, user, router]);

  function isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // useEffect(() => {
  //   if (errorMessage !== "") {
  //     const timer = setTimeout(() => {
  //       setErrorMessage("");
  //     }, 5000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [errorMessage]);

  const getMatch = useCallback(async () => {
    try {
      const response = await fetch(SERVER + "/api/get-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.sub }),
      });
      if (!response.ok) {
        const error = await response.json();
        setErrorMessage("Server-side error: " + error.error);
        // setErrorPresent(true);
      } else {
        setErrorMessage("");

        const data = await response.json();

        if (!(data.settingsPresent ?? true)) {
          console.log("Redirecting to settings...");
          router.push("/settings");
          setSettingsPresent(false);
          setRedirecting(true);
        }

        setName(data.match.name || "");
        setEmail(data.match.email || "");
        setLinkedIn(data.match.linkedIn || "");
        setBio(data.match.bio || "");
        setAvailability(data.match.availability || "");
        setSkills(data.match.skills || []);
        setThemes(data.match.themes || []);
        setNeedHelp(data.match.needHelp || false);
        setProjectName(data.match.projectName || "");
        setProjectDescription(data.match.projectDescription || "");
        setHelpDescription(data.match.helpDescription || "");
        setProjectLink(data.match.projectLink || "");
        setTimeFrame(data.match.timeFrame || "");
        setNoMatch(data.noMatches || false);

        if (data.match.imageLink === "" || !isValidURL(data.match.imageLink)) {
          setImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + data.match.name.replace(" ", "+"));
        } else {
          setImageLink(data.match.imageLink);
        }
      }
    } catch (error) {
      console.error("Error: Failed to fetch settings: ", error);
      setErrorMessage("Client-side error: " + error);
      // setErrorPresent(true);
    }
    setPolled(true);
  }, [user, router]);

  useEffect(() => {
    if (!isLoading && user) {
      getMatch();
    }
  }, [isLoading, user, getMatch]);

  return (
    <>
      <Header>
        <HeaderLogo href="/">
          <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
        </HeaderLogo>
        <HeaderNav>
          <StyledLink href="/settings" className="h-full w-fit flex items-center no-underline">
            <span className="material-symbols-outlined">settings</span>
          </StyledLink>
          <GradientButton className="m-3" href="/api/auth/logout">Logout</GradientButton>
        </HeaderNav>
      </Header>

      {polled && !redirecting && (<Error className="mt-24 sm:w-1/2 w-full">{errorMessage}</Error>)}

      <CardContainer className={`${errorMessage && polled && !redirecting ? 'mt-5' : 'mt-24'}`}>
        <Card className="w-full">
          <CardTitle size={2}>Your match</CardTitle>
          <CardContent>
            {isLoading && !user && !polled ? (
              <p>Loading...</p>
            ) : errorMessage !== "" ? (
              <p>Looks like you{"'"}re not getting your match... try reloading or filling out <a className="underline" href="/settings">settings</a>.</p>
            ) : (!settingsPresent || redirecting) ? (
              <p>Settings empty or missing fields. Redirecting...</p>
            ) : (
              <>
                {noMatch && (
                  <CardBlock>
                    <p>Psst... there are no exact matches, so have a random one!</p>
                  </CardBlock>
                )}
                <CardBlock>
                  <ProfileCard match={{
                    name,
                    email,
                    linkedIn,
                    bio,
                    availability,
                    skills,
                    themes,
                    needHelp,
                    projectName,
                    projectDescription,
                    projectLink,
                    timeFrame,
                    imageLink
                  }} />
                </CardBlock>
                <CardButton onClick={getMatch}>Match!</CardButton>
                <div className="mt-3 flex flex-col md:flex-row gap-3">
                  <CardButton className="w-full" onClick={getMatch}>Save for later</CardButton>
                  <CardButton className="w-full" onClick={getMatch}>Find new match</CardButton>
                </div>
              </>
            )}
          </CardContent>
        </Card >
      </CardContainer >
    </>
  );
}

