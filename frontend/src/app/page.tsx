"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import GradientButton from "../components/gradientButton";
import Heading from "../components/heading";
import { Card, CardImage, CardTitle, CardContent, CardContainer } from "../components/card";
import { Header, HeaderNav, HeaderLogo } from "../components/header";
import Hero from "../components/hero";

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
          Ungari
        </HeaderLogo>
        <HeaderNav>
          {user ? (
            <GradientButton className="m-3" href="/match">Login</GradientButton>

          ) : (
            <GradientButton className="m-3" href="/api/auth/login">Login</GradientButton>
          )}
        </HeaderNav>
      </Header>

      <Hero />

     

      <div className="w-full flex justify-center items-center mt-20">
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
              Get matched with someone whose problem matches your skillset, or vice versa! This could be anyone from a researcher to an entrepreneur.
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
      </div>

      {user ? (
        <GradientButton href="/match" className="px-6 mt-14 m-3 text-xl">Find New Projects</GradientButton>
      ) : (
        <GradientButton href="/api/auth/login" className="px-6 mt-14 m-3 text-xl">Get Started</GradientButton>
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