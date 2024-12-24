"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Header, HeaderLogo, HeaderNav } from "../../components/header"
import GradientButton from "../../components/gradientButton";
import Heading from "../../components/heading";
import { Card, CardContainer, CardTitle, CardImage, CardContent, CardSubtitle, CardBlock, CardButton } from "../../components/card"
import StyledLink from "../../components/styledLink"
import { useCallback } from "react";
import Error from "../../components/error";
import { set } from "@auth0/nextjs-auth0/dist/session";

const SERVER = "http://127.0.0.1:5000";

export default function Home() {
  const { user, isLoading } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("");
  const [interests, setInterests] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

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
        body: JSON.stringify({ id: user.sub, name: user.name }),
      });
      if (!response.ok) {
        const error = await response.json();
        setErrorMessage("Server-side error: " + error.error);
      } else {
        const data = await response.json();
        setName(data.matches.name || "");
        setEmail(data.matches.email || "");
        setLinkedIn(data.matches.linkedIn || "");
        setBio(data.matches.bio || "");
        setAvailability(data.matches.availability || "");
        setInterests(data.matches.interests || {});
      }
    } catch (error) {
      console.error("Error: Failed to fetch settings: ", error);
      setErrorMessage("Client-side error: " + error);
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
          Acme
        </HeaderLogo>
        <HeaderNav>
          <StyledLink href="/settings" className="h-full w-fit flex items-center no-underline">
            <span className="material-symbols-outlined">settings</span>
          </StyledLink>
          <GradientButton href="/api/auth/logout">Logout</GradientButton>
        </HeaderNav>
      </Header>

      <Error className="mt-24 w-1/2">{errorMessage}</Error>

      <CardContainer className={`${errorMessage == "" ? 'mt-24' : 'mt-5'}`}>
        <Card className="w-full">
          <CardTitle size={2}>Your match</CardTitle>
          <CardContent>
            {isLoading && !user ? (
              <p>Loading...</p>
            ) : (
              <>
                <CardBlock>
                  <CardSubtitle>Name:</CardSubtitle>
                  <p>{name}</p>
                </CardBlock>
                <CardBlock>
                  <CardSubtitle>LinkedIn:</CardSubtitle>
                  <p>{linkedIn}</p>
                </CardBlock>
                <CardBlock>
                  <CardSubtitle>About {name.split(' ')[0].charAt(0).toUpperCase() + name.split(' ')[0].slice(1)}:</CardSubtitle>
                  <p>{bio}</p>
                </CardBlock>
                <CardBlock>
                  <CardSubtitle>Available hours per week:</CardSubtitle>
                  <p>{availability}</p>
                </CardBlock>

                <CardBlock>
                  <CardSubtitle>Interests:</CardSubtitle>
                  <ul className="list-disc ml-5">
                    {Object.entries(interests).map(([interest, level]) => (
                      <li key={interest}>
                        <div className="font-semibold inline">{interest}</div> at a level of <div className="font-semibold inline">{String(level)}</div>
                      </li>
                    ))}
                  </ul>
                </CardBlock>

                <CardButton onClick={getMatch}>Match!</CardButton>
                <div className="mt-3 flex flex-row gap-3">
                  <CardButton className="w-full" onClick={getMatch}>Save for later</CardButton>
                  <CardButton className="w-full" onClick={getMatch}>Find new match</CardButton>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </CardContainer>
    </>
  );
}

