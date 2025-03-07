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
import { set } from "@auth0/nextjs-auth0/dist/session";

const SERVER = "http://127.0.0.1:38321";
// const SERVER = "https://problem-dating-app.cnicholson.hackclub.app";

export default function Home() {
  const [user_id, setUserID] = useState("");
  const [match_id, setMatchID] = useState("");

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

  const [noMatches, setNoMatches] = useState(false);
  const [noNewMatches, setNoNewMatches] = useState(false);
  const [polled, setPolled] = useState(false);

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

  useEffect(() => {
    if (!isLoading && user) {
      const getStatus = async () => {
        try {
          const response = await fetch(SERVER + "/api/get-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ auth0_id: user.sub }),
          });
          if (!response.ok) {
            const error = await response.json();
            setErrorMessage("Server-side error: " + error.error);
          } else {
            const data = await response.json();

            if (data.someSettings ?? false) {
              const message = encodeURIComponent("You were redirected here because some fields are not filled out or a new field was added.");
              router.push(`/settings?redirectMessage=${message}`);
            }
            if (data.noSettings ?? false) {
              const message = encodeURIComponent("You were redirected because this is your first time using the platform and you need to complete onboarding.");
              router.push(`/onboarding?redirectMessage=${message}`);
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

  // Verification 
  function isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Syncing with backend
  const createChat = useCallback(async () => {
    try {
      const response = await fetch(SERVER + "/api/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth0_id: user.sub, match_id: match_id }),
      });
      if (!response.ok) {
        const error = await response.json();
        setErrorMessage("Server-side error: " + error.error);
      } else {
        const message = encodeURIComponent(match_id);
        router.push(`/chat?match_id=${message}`);
      }
    } catch (error) {
      console.error("Error: Failed to fetch settings: ", error);
      setErrorMessage("Client-side error: " + error);
    }
  }, [user, match_id, router]);

  const saveForLater = useCallback(async () => {
    try {
      const response = await fetch(SERVER + "/api/save-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth0_id: user.sub, match_id: match_id }),
      });
      if (!response.ok) {
        const error = await response.json();
        setErrorMessage("Server-side error: " + error.error);
      }
    } catch (error) {
      console.error("Error: Failed to fetch settings: ", error);
      setErrorMessage("Client-side error: " + error);
    }
  }, [user, match_id]);

  const getMatch = useCallback(async () => {
    try {
      const response = await fetch(SERVER + "/api/get-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auth0_id: user.sub }),
      });
      if (!response.ok) {
        const error = await response.json();
        setErrorMessage("Server-side error: " + error.error);
        setPolled(false);
      } else {
        setErrorMessage("");
        setPolled(true);

        const data = await response.json();

        console.log(data);

        setMatchID(data.match.match_id);
        setUserID(data.match.user_id);

        setName(data.match.name || "");
        setEmail(data.match.email || "");
        setLinkedIn(data.match.linkedIn || "");
        setX(data.match.x || "");
        setGitHub(data.match.gitHub || "");
        setPersonalWebsite(data.match.personalWebsite || "");

        setBio(data.match.bio || "");
        setCountry(data.match.country || "");
        setCity(data.match.city || "");
        setAvailability(data.match.availability || "");

        setNeedHelp(data.match.needHelp || false);
        setProjectName(data.match.projectName || "");
        setProjectDescription(data.match.projectDescription || "");
        setHelpDescription(data.match.helpDescription || "");
        setProjectLink(data.match.projectLink || "");
        setTimeFrame(data.match.timeFrame || "");

        setSkills(data.match.skills || []);
        setSkillLevels(data.match.skillLevels || {});
        setThemes(data.match.themes || []);

        setNoMatches(data.noMatches || false);
        setNoNewMatches(data.noNewMatches || false);

        // if (data.match.image === "" || !isValidURL(data.match.image)) {
        //   setImage("https://ui-avatars.com/api/?size=256&background=random&name=" + data.match.name.replace(" ", "+"));
        // } else {
        //   setImage(data.match.image);
        // }

        setImage(data.match.image);
      }
    } catch (error) {
      console.error("Error: Failed to fetch settings: ", error);
      setErrorMessage("Client-side error: " + error);
      setPolled(false);
    }
  }, [user]);

  // Get match on page load 
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
          <CardTitle size={2} className="mb-3">Your match</CardTitle>
          {isLoading && !user && !polled ? (
            <p>Loading...</p>
          ) : errorMessage !== "" ? (
            <p>Looks like you{"'"}re not getting your match... our backend seems to be down. Try reloading or coming back later.</p>
          ) : (
            <>
              {(noMatches || noNewMatches) && (
                <CardBlock>
                  <p>Psst... there are no {noNewMatches ? "new" : "exact"} matches, so have a random one!</p>
                </CardBlock>
              )}
              <CardBlock>
                <ProfileCard user={{
                  match_id,
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
              </CardBlock>
              <CardButton onClick={createChat}>Match!</CardButton>
              <div className="mt-3 flex flex-col md:flex-row gap-3">
                <CardButton className="w-full" onClick={getMatch}>Save for later</CardButton>
                <CardButton className="w-full" onClick={getMatch}>Find new match</CardButton>
              </div>
            </>
          )}
        </Card >
      </CardContainer >
    </>
  );
}

