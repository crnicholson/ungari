"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Heading from "../components/heading";
import { Card, CardImage, CardTitle, CardContent, CardContainer } from "../components/card";
import { Header, HeaderNav, HeaderLogo } from "../components/header";
import Demo from "../components/demo";
import Button from "../components/button";
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/match");
    }
  }, [isLoading, user, router]);

  return (
    <div className="min-h-screen">
      <Header>
        <HeaderLogo href="/" className="">
          <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
        </HeaderLogo>
        <HeaderNav>
          {user ? (
            <Button className="m-3" href="/match">Login</Button>
          ) : (
            <Button className="m-3" href="/api/auth/login">Login</Button>
          )}
        </HeaderNav>
      </Header>

      {/* Logo ideas: ⋒ ⊛ ∴ ⋈ ⁂ */}

      <div className="w-full h-fit flex flex-col items-center mt-[120px]">
        <p className="text-[--light] mb-2">GET HELP, GIVE HELP</p>
        <h1 className="w-1/2 text-5xl text-center font-[tiempos]">
          <span className="text-[--accent] text-4xl font-bold">⁂</span> Connecting <span className="underline decoration-[--accent]">problems</span> with <span className="underline decoration-[--accent]">thinkers</span>
        </h1>
        <p className="text-xl mt-6">The best way to make real impact.</p>
        <div className="mt-10">
          {user ? (
            <Button className="m-3 bg-none text-xl text-[--accent] border-2 border-[--accent]" href="/match">Find new matches</Button>
          ) : (
            <Button className="m-3 bg-none text-xl text-[--accent] border-2 border-[--accent]" href="/api/auth/login">Get started →</Button>
          )}
        </div>
      </div>

      <Demo />

      <div className="w-full flex justify-center items-center mt-20">
        <CardContainer>
          <Card className="w-1/3">
            <CardTitle className="underline decoration-[--accent]">
              Step 1
            </CardTitle>
            <CardContent>
              Start by selecting your skills and what you want to work on, or by submitting a problem you have that needs solving.
            </CardContent>
          </Card>
          <Card className="w-1/3">
            <CardTitle className="underline decoration-[--accent]">
              Step 2
            </CardTitle>
            <CardContent>
              Get matched with someone whose problem matches your skillset, or vice versa! This could be anyone from a researcher to an entrepreneur.
            </CardContent>
          </Card>
          <Card className="w-1/3">
            <CardTitle className="underline decoration-[--accent]">
              Step 3
            </CardTitle>
            <CardContent>
              Collaborate and work together to solve the problem - and ship a meaningful project.
            </CardContent>
          </Card>
        </CardContainer>
      </div>

      <div className="w-full flex flex-col justify-center items-center mt-20">
        <Heading size={3} className="w-1/2">
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
      </div>
    </div >
  );
}