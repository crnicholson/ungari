"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Header, HeaderLogo, HeaderNav } from "../../components/header"
import GradientButton from "../../components/gradientButton";
import Heading from "../../components/heading";
import { Card, CardContainer, CardTitle, CardImage, CardContent } from "../../components/card"
import StyledLink from "../../components/styledLink"

export default function Home() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/api/auth/login");
    }
  }, [isLoading, user]);

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

      <Heading size={3}>
        Find a match
      </Heading>
    </>
  );
}
