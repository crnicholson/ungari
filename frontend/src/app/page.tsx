"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import Link from "next/link";

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
      <div className="text-stone-600 h-fit w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 animate-gradient-x flex flex-col justify-center items-center">
        <header
          className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "bg-stone-500/10 backdrop-blur-lg shadow-md border border-gray-300 mx-4 rounded-xl"
            : "bg-transparent mx-4"
            }`}
        >
          <div className="max-w-8xl p-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              Acme
            </Link>
            <nav>
              {user ? (
                <Link
                  href="/match"
                  className="relative inline-block p-3 bg-opacity-100 border-1 border text-sm font-semibold rounded-xl shadow-lg bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 animate-gradient-x hover:scale-105"
                >
                  Login
                </Link>
              ) : (
                <Link
                  href="/api/auth/login"
                  className="relative inline-block p-3 bg-opacity-100 border-1 border text-sm font-semibold rounded-xl shadow-lg bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 animate-gradient-x hover:scale-105"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </header>

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
        <div className="flex flex-row justify-center space-x-3 w-1/2">
          {[
            {
              step: "Step 1 📝",
              description:
                "Start by selecting your skills and what you want to work on, or by submitting a problem you have that needs solving.",
            },
            {
              step: "Step 2 🔗",
              description:
                "Get matched with someone whose problem matches your skillset! This could be anyone from a researcher to an entrepreneur.",
            },
            {
              step: "Step 3 🚀",
              description:
                "Collaborate and work together to solve the problem - and ship a meaningful project.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="border-1 border black bg-slate-100 rounded-xl p-4 shadow-lg mt-5 w-1/3"
            >
              <h1 className="font-bold mb-2">{item.step}</h1>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {user ? (
          <Link
            href="/match"
            className="relative inline-block px-6 bg-opacity-100 py-3 border-1 border text-xl font-semibold rounded-xl shadow-lg mt-14 bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 animate-gradient-x hover:scale-105"
          >
            Find New Projects
          </Link>
        ) : (
          <Link
            href="/api/auth/login"
            className="relative inline-block px-6 bg-opacity-100 py-3 border-1 border text-xl font-semibold rounded-xl shadow-lg mt-14 bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 animate-gradient-x hover:scale-105"
          >
            Get Started
          </Link>
        )}

        <h1 className="w-1/2 text-center mt-14 text-2xl font-semibold">
          Popular interests
        </h1>
        <div className="flex flex-row justify-center space-x-3 w-fit overflow-clip">
          {[
            { icon: "bolt", title: "Electronics" },
            { icon: "travel", title: "Aviation" },
            { icon: "network_intel_node", title: "Artificial intelligence" },
            { icon: "rocket_launch", title: "Space" },
            { icon: "computer", title: "Programming" },
            { icon: "wind_power", title: "Renewable energy" },
            { icon: "biotech", title: "Biotech" },
          ].map((item, index) => (
            <div
              key={index}
              className="border border-1 border-stone-200 bg-slate-100 rounded-xl p-4 shadow-lg mt-5 w-fit"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <h1>{item.title}</h1>
            </div>
          ))}
        </div>

        <h1 className="w-1/2 text-center mt-14 text-2xl font-semibold">
          Featured collaborations
        </h1>
        <div className="flex flex-row justify-center space-x-3 w-1/2">
          {[
            {
              image: "/james-hojnowski.png",
              alt: "James and Prof. Hojnowski",
              title: "James x Prof. Hojnowski",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam",
            },
            {
              image: "/james-hojnowski.png",
              alt: "James and Prof. Hojnowski",
              title: "James x Prof. Hojnowski",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="border border-1 border-stone-200 bg-slate-100 rounded-xl p-4 shadow-lg mt-5 w-1/2"
            >
              <div className="w-full flex justify-center">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={500}
                  height={500}
                  className="object-cover rounded-xl"
                />
              </div>
              <h1 className="font-bold mt-5 mb-1">{item.title}</h1>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <footer className="border border-1 border-stone-200 bg-slate-100 rounded-xl p-4 shadow-lg mt-[60px] mb-5 w-fit">
          <p>
            Copyright Charles Nicholson 2024. Open source on{" "}
            <Link
              href="www.github.com/crnicholson/problem-dating-app"
              className="underline hover:text-stone-500"
            >
              GitHub
            </Link>{" "}
            and hosted on Vercel. Licensed under GPL v3.
          </p>
        </footer>
      </div >
    </>
  );
}