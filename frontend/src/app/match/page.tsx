"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/api/auth/login");
    }
  }, [isLoading, user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="text-stone-600 min-h-screen max-h-fit w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 animate-gradient-x flex flex-col justify-center items-center">
        <header
          className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-stone-500/10 backdrop-blur-lg shadow-md border border-gray-300 mx-4 rounded-xl"
              : "bg-transparent mx-4"
          }`}
        >
          <div className="max-w-8xl p-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              Acme
            </Link>
            <nav className="flex flex-row items-center justify-start">
              <Link className="p-3 mr-2" href="/settings">
                <span className="material-symbols-outlined">settings</span>
              </Link>
              <Link
                href="/api/auth/logout"
                className="relative inline-block p-3 bg-opacity-100 border-1 border text-sm font-semibold rounded-xl shadow-lg bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 animate-gradient-x hover:scale-105"
              >
                Logout
              </Link>
            </nav>
          </div>
        </header>

        <h1 className="mt-[120px] text-2xl w-1/2 font-semibold">
          Find a match
        </h1>
        <div className="w-1/2 flex flex-row justify-center items-center">
          <div className="border border-1 border-stone-200 bg-slate-100 rounded-xl p-4 shadow-lg mt-5 w-fit"></div>
        </div>

        <footer className="border border-1 border-stone-200 bg-slate-100 rounded-xl p-4 shadow-lg mt-[60px] mb-5 w-fit">
          <p>
            Copyright Charles Nicholson 2024. Open source on{" "}
            <Link
              href="https://www.github.com/crnicholson/problem-dating-app"
              className="underline hover:text-stone-500"
            >
              GitHub
            </Link>{" "}
            and hosted on Vercel. Licensed under GPL v3.
          </p>
        </footer>
      </div>
    </>
  );
}
