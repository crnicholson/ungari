"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import GradientButton from "../components/gradientButton";
import Heading from "../components/heading";
import { Card, CardImage, CardTitle, CardContent, CardContainer } from "../components/card";
import { Header, HeaderNav, HeaderLogo } from "../components/header";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header>
        <HeaderLogo href="/">
          Acme
        </HeaderLogo>
        <HeaderNav>
          {user ? (
            <GradientButton href="/match">Login</GradientButton>

          ) : (
            <GradientButton href="/api/auth/login">Login</GradientButton>
          )}
        </HeaderNav>
      </Header>

      <div className="w-1/3 mt-[120px] mb-[60px]">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-300 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-6xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          Connecting problems with thinkers{" "}
          <span className="text-black">⚡</span>
        </h1>
        <p className="text-center pt-3 text-lg">
          A tool to help you find your next project - with impact.
        </p>
      </div>

      <CardContainer>
        <Card className="w-1/3">
          <CardTitle>
            Step 1 📝
          </CardTitle>
          <CardContent>
            Start by selecting your skills and what you want to work on, or by submitting a problem you have that needs solving.
          </CardContent>
        </Card>
        <Card className="w-1/3">
          <CardTitle>
            Step 2 🔗
          </CardTitle>
          <CardContent>
            Get matched with someone whose problem matches your skillset! This could be anyone from a researcher to an entrepreneur.
          </CardContent>
        </Card>
        <Card className="w-1/3">
          <CardTitle>
            Step 3 🚀
          </CardTitle>
          <CardContent>
            Collaborate and work together to solve the problem - and ship a meaningful project.
          </CardContent>
        </Card>
      </CardContainer>

      {user ? (
        <GradientButton href="/match" className="px-6 mt-14 text-xl">Find New Projects</GradientButton>
      ) : (
        <GradientButton href="/api/auth/login" className="px-6 mt-14 text-xl">Get Started</GradientButton>
      )}

      <Heading size={3} className="mt-10">
        Popular interests
      </Heading>
      <CardContainer className="w-fit overflow-x-clip">
        <Card>
          <CardContent>
            <span className="material-symbols-outlined">bolt</span>
            <p>Electronics</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <span className="material-symbols-outlined">travel</span>
            <p>Aviation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <span className="material-symbols-outlined">network_intel_node</span>
            <p>Artificial intelligence</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <span className="material-symbols-outlined">rocket_launch</span>
            <p>Space</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <span className="material-symbols-outlined">computer</span>
            <p>Programming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <span className="material-symbols-outlined">wind_power</span>
            <p>Renewable energy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <span className="material-symbols-outlined">biotech</span>
            <p>Biotech</p>
          </CardContent>
        </Card>
      </CardContainer>

      <Heading size={3} className="mt-10">
        Featured collaborations
      </Heading>
      <CardContainer>
        <Card className="w-1/2">
          <CardImage src="/james-hojnowski.png" alt="James and Prof. Hojnowski" />
          <CardTitle>James x Prof. Hojnowski</CardTitle>
          <CardContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          </CardContent>
        </Card>
        <Card className="w-1/2">
          <CardImage src="/james-hojnowski.png" alt="James and Prof. Hojnowski" />
          <CardTitle>James x Prof. Hojnowski</CardTitle>
          <CardContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          </CardContent>
        </Card>
      </CardContainer>
    </>
  );
}