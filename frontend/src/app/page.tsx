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
            <Button className="m-3" href="/match">Login</Button>
          ) : (
            <Button className="m-3" href="/api/auth/login">Login</Button>
          )}
        </HeaderNav>
      </Header>

      {/* Logo ideas: ⋒ ⊛ ∴ ⋈ ⁂ */}

      <div className="w-full h-fit flex flex-col items-center mt-[120px] px-4 sm:px-0">
        <p className="text-[--light] mb-2 text-center">GET HELP, GIVE HELP</p>
        <h1 className="w-full sm:w-1/2 text-3xl sm:text-5xl text-center font-[family-name:var(--tiempos)]">
          <span className="text-[--accent] text-4xl font-bold">⁂</span> Connecting <span className="underline decoration-[--accent]">problems</span> with <span className="underline decoration-[--accent]">thinkers</span>
        </h1>
        <p className="text-lg sm:text-xl mt-6 text-center">The best way to make real impact.</p>
        <div className="mt-10">
          {user ? (
            <Button className="m-3 bg-none text-lg sm:text-xl text-[--accent] border-2 border-[--accent]" href="/match">Find new matches</Button>
          ) : (
            <Button className="m-3 bg-none text-lg sm:text-xl text-[--accent] border-2 border-[--accent]" href="/api/auth/login">Get started →</Button>
          )}
        </div>
      </div>

      <Demo />

      <Link href={`${user ? "/match" : "/api/auth/login"}`}>
        <Image src="/collaboration.png" alt="Hero" width={700} height={250} className="rounded-xl mt-20 shadow-lg hover:scale-[101%]" />
      </Link>

      <Button className="mx-3 -mt-20 bg-[--card-bg] text-lg sm:text-xl text-[--accent] border-2 border-[--accent]" href={`${user ? "/match" : "/api/auth/login"}`}>{user ? "Log in" : "Are you a resource-constrained scientist? Budding engineer?"}</Button>

      <div className="w-full flex justify-center items-center mt-28">
        <CardContainer className="flex-col md:flex-row w-full sm:w-5/6 md:w-3/4 xl:w-1/2">
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

      <div className="hidden lg:flex w-full flex-col justify-center items-center mt-20">
        <Heading size={3} className="w-1/2">
          Popular interests
        </Heading>
        <CardContainer className="sm:w-full overflow-x-clip">
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
    </>
  );
}