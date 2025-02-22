"use client";

import { Card, CardTitle, CardContent, CardContainer } from "../components/card";
import { Header, HeaderNav, HeaderLogo } from "../components/header";
import Heading from "../components/heading";
import Demo from "../components/demo";
import Button from "../components/button";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/redirect");
    }
  }, [isLoading, user, router]);

  return (
    <>
      <Header>
        <HeaderLogo href="/" className="">
          <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
        </HeaderLogo>
        <HeaderNav>
          {user ? (
            <Button href="/match">Login</Button>
          ) : (
            <Button href="/api/auth/login">Login</Button>
          )}
        </HeaderNav>
      </Header>

      {/* Logo ideas: ⋒ ⊛ ∴ ⋈ ⁂ */}

      <div className="w-full h-fit flex flex-col items-center mt-[120px] px-4 sm:px-0">
        <p className="text-[--light] mb-2 text-center">GET HELP, GIVE HELP</p>
        <h1 className=" w-full sm:w-1/2 text-3xl/[1.5] sm:text-5xl/[1.5] text-center font-[family-name:var(--tiempos)]">
          <span className="text-[--accent] text-4xl font-bold">⁂</span> Matching <span className="underline decoration-[--accent]">expertise</span> with <span className="underline decoration-[--accent]">real-world</span> challenges
        </h1>
        <p className="text-lg sm:text-xl mt-6 text-center">The best way to make real impact.</p>
        <div className="mt-8 sm:mt-10">
          {user ? (
            <Button className="bg-none text-lg sm:text-xl text-[--accent] border-2 border-[--accent]" href="/match">Find new matches</Button>
          ) : (
            <Button className="bg-none text-lg sm:text-xl text-[--accent] border-2 border-[--accent]" href="/api/auth/login">Get started →</Button>
          )}
        </div>
      </div>

      <Demo />

      <div className="relative mt-16 sm:mt-20 w-full sm:w-1/2 px-5">
        <Link href={`${user ? "/match" : "/api/auth/login"}`}>
          <Image
            src="/collaboration.png"
            alt="Hero"
            width={700}
            height={250}
            className="w-full h-auto rounded-xl shadow-lg hover:scale-[101%] transition-transform duration-200"
          />
        </Link>

        <div className="absolute bottom-5 left-0 right-0 flex justify-center px-10">
          <Button
            className="bg-[--card-bg] text-base sm:text-lg md:text-xl text-[--accent] border-2 border-[--accent] w-fit"
            href={`${user ? "/match" : "/api/auth/login"}`}
          >
            {user ? "Log in" : "Are you a resource-constrained scientist? Budding engineer?"}
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-16 sm:mt-20">
        <CardContainer className="flex-col md:flex-row w-full sm:w-5/6 md:w-3/4 xl:w-1/2">
          <Card className="w-1/3">
            <CardTitle className="underline decoration-[--accent]">
              Step 1
            </CardTitle>
            Start by selecting your skills and what you want to work on, or by submitting a problem you have that needs solving.
          </Card>
          <Card className="w-1/3">
            <CardTitle className="underline decoration-[--accent]">
              Step 2
            </CardTitle>
            Get matched with someone whose problem matches your skillset, or vice versa! This could be anyone from a researcher to an entrepreneur.
          </Card>
          <Card className="w-1/3">
            <CardTitle className="underline decoration-[--accent]">
              Step 3
            </CardTitle>
            Collaborate and work together to solve the problem - and ship a meaningful project.
          </Card>
        </CardContainer>
      </div>

      <div className="hidden lg:flex w-full flex-col justify-center items-center mt-20">
        <Heading size={3} className="w-1/2">
          Popular interests
        </Heading>
        <CardContainer className="sm:w-full overflow-x-clip">
          <Card>
            <span className="material-symbols-outlined">bolt</span>
            <p>Electronics</p>
          </Card>
          <Card>
            <span className="material-symbols-outlined">travel</span>
            <p>Aviation</p>
          </Card>
          <Card>
            <span className="material-symbols-outlined">network_intel_node</span>
            <p>Artificial intelligence</p>
          </Card>
          <Card>
            <span className="material-symbols-outlined">rocket_launch</span>
            <p>Space</p>
          </Card>
          <Card>
            <span className="material-symbols-outlined">computer</span>
            <p>Programming</p>
          </Card>
          <Card>
            <span className="material-symbols-outlined">wind_power</span>
            <p>Renewable energy</p>
          </Card>
          <Card>
            <span className="material-symbols-outlined">biotech</span>
            <p>Biotech</p>
          </Card>
        </CardContainer>
      </div>
    </>
  );
}