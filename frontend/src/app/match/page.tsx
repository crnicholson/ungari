"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Header, HeaderLogo, HeaderNav } from "../../components/header"
import GradientButton from "../../components/gradientButton";
import { Card, CardContainer, CardTitle, CardContent, CardSubtitle, CardBlock, CardButton } from "../../components/card"
import StyledLink from "../../components/styledLink"
import Error from "../../components/error";

// const SERVER = "http://127.0.0.1:5000";
const SERVER = "https://problem-dating-app.cnicholson.hackclub.app";

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

  const [errorMessage, setErrorMessage] = useState("");
  const [errorPresent, setErrorPresent] = useState(false);

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/api/auth/login");
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (errorMessage !== "") {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
        setErrorPresent(true);
      } else {
        const data = await response.json();
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
      }
    } catch (error) {
      console.error("Error: Failed to fetch settings: ", error);
      setErrorMessage("Client-side error: " + error);
      setErrorPresent(true);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && user) {
      getMatch();
    }
  }, [isLoading, user, getMatch]);

  return (
    <>
      <Header>
        <HeaderLogo href="/">
          Ungari
        </HeaderLogo>
        <HeaderNav>
          <StyledLink href="/settings" className="h-full w-fit flex items-center no-underline">
            <span className="material-symbols-outlined">settings</span>
          </StyledLink>
          <GradientButton className="m-3" href="/api/auth/logout">Logout</GradientButton>
        </HeaderNav>
      </Header>

      <Error className="mt-24 w-1/2">{errorMessage}</Error>

      <CardContainer className={`${errorMessage == "" ? 'mt-24' : 'mt-5'}`}>
        <Card className="w-full">
          <CardTitle size={2}>Your match</CardTitle>
          <CardContent>
            {isLoading && !user ? (
              <p>Loading...</p>
            ) : errorPresent ? (
              <p>Looks like you{"'"}re not getting your match... try reloading or filling out <a className="underline" href="/settings">settings</a>.</p>
            ) : (
              <>
                <CardBlock>
                  <CardSubtitle>
                    <StyledLink href={linkedIn}>{name.split(" ")[0]}</StyledLink>
                  </CardSubtitle>

                  <p className="italic text-sm">{name.split(" ")[0]} {needHelp ? "is looking for someone with skills in:" : "has skills in:"} {skills.join(", ")} </p>

                  {!needHelp && (
                    <p>{availability} hours per week</p>
                  )}

                </CardBlock>

                <CardBlock>
                  <CardSubtitle>Bio</CardSubtitle>
                  <p>{bio}</p>
                </CardBlock>

                {needHelp ? (
                  <>
                    <CardTitle size={2}>Project info</CardTitle>
                    <CardBlock>
                      <CardSubtitle>
                        <StyledLink href={projectLink}>{projectName}</StyledLink>
                      </CardSubtitle>
                    </CardBlock>
                    <CardBlock>
                      <CardSubtitle>Project description</CardSubtitle>
                      <p>{projectDescription}</p>
                    </CardBlock>
                    <CardBlock>
                      <CardSubtitle> Project themes</CardSubtitle>
                      <p>{themes.join(", ")}</p>
                    </CardBlock>
                    <CardBlock>
                      <CardSubtitle>Specific help information</CardSubtitle>
                      <p>{helpDescription}</p>
                    </CardBlock>
                    <CardBlock>
                      <CardSubtitle>Time frame</CardSubtitle>
                      <p>
                        {name.split(" ")[0]} estimates the project will take{" "}
                        {timeFrame === 0
                          ? "an unknown number of months"
                          : `${timeFrame} ${timeFrame > 1 ? "months" : "month"}`}.
                      </p>
                    </CardBlock>
                  </>
                ) : (
                  <>
                    <CardBlock>
                      <CardSubtitle>Availability</CardSubtitle>
                      <p>{name.split(" ")[0]} is availble {availability} per week.</p>
                    </CardBlock>
                    <CardBlock>
                      <CardSubtitle>Time frame</CardSubtitle>
                      <p>
                        {name.split(" ")[0]} wants to work on a projecct for{" "}
                        {timeFrame === 0
                          ? "an unknown number of months"
                          : `${timeFrame} ${timeFrame > 1 ? "months" : "month"}`}.
                      </p>
                    </CardBlock>
                    <CardBlock>
                      <CardSubtitle>Themes</CardSubtitle>
                      <p>{name.split(" ")[0]} wants to work on a project with themes: {themes.join(", ")}</p>
                    </CardBlock>
                  </>
                )}

                <CardButton onClick={getMatch}>Match!</CardButton>
                <div className="mt-3 flex flex-row gap-3">
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

