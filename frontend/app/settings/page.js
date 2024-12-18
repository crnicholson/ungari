"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Settings() {
  const [isScrolled, setIsScrolled] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState({});

  const interests = [
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Aerospace Engineering",
    "Robotics",
    "Software Engineering",
    "Mechatronics",
    "Materials Science",
    "Bioengineering",
    "Computer Engineering",
  ];

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

  const handleSelectInterest = (interest) => {
    setSelectedInterests((prev) => {
      if (prev[interest]) {
        const { [interest]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [interest]: 1 };
    });
  };

  const handleSkillChange = (interest, level) => {
    setSelectedInterests((prev) => ({
      ...prev,
      [interest]: level,
    }));
  };

  const filteredInterests = interests.filter((interest) =>
    interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const saveSettings = () => {
    console.log("Settings saved:", { name, email, bio, selectedInterests });
    alert("Settings saved successfully!");
  };

  return (
    <>
      <div className="text-stone-600 h-fit w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 animate-gradient-x flex flex-col justify-center items-center">
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
              <Link
                href="/api/auth/logout"
                className="relative inline-block p-3 text-stone-600 bg-opacity-100 border-1 border text-sm font-semibold rounded-xl shadow-lg bg-gradient-to-r from-indigo-50 via-slate-50 to-cyan-50 animate-gradient-x hover:scale-105"
              >
                Logout
              </Link>
            </nav>
          </div>
        </header>

        <div className="mt-[120px] w-1/2">
          <div className="border border-gray-200 rounded-xl p-4 bg-slate-100 shadow-lg">
            <h2 className="text-2xl font-semibold mb-2">Settings</h2>
            <Link
              href="match"
              className="italic underline text-base text-stone-500 mb-6 hover:text-stone-400"
            >
              Back to match
            </Link>

            <div className="mt-5 mb-4">
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                className="w-full p-2 border rounded-lg"
                placeholder="We'll shoot you an email if we find a match"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Availability:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="How many hours per week are you available?"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block mb-2">Bio:</label>
              <textarea
                className="w-full p-2 border rounded-lg"
                placeholder="Tell us about yourself, and some past projects you've worked on"
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Interests and confidence ranking:
              </label>
              <input
                type="text"
                placeholder="Search interests..."
                className="w-full p-2 border rounded-lg mb-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="max-h-32 overflow-y-auto border p-2 rounded">
                {filteredInterests.map((interest) => (
                  <div
                    key={interest}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedInterests.hasOwnProperty(interest)}
                        onChange={() => handleSelectInterest(interest)}
                      />
                      <span className="ml-2">{interest}</span>
                    </label>

                    {selectedInterests[interest] !== undefined && (
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={selectedInterests[interest]}
                        onChange={(e) =>
                          handleSkillChange(interest, e.target.value)
                        }
                        className="w-16 border rounded p-1"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="border border-1 border-stone-200 bg-slate-100 rounded-lg p-3 shadow-lg w-fit hover:scale-105"
              onClick={saveSettings}
            >
              Save Settings
            </button>
          </div>

          {Object.keys(selectedInterests).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Selected Interests & Skill Levels:
              </h3>
              <ul className="list-disc pl-5">
                {Object.entries(selectedInterests).map(([interest, level]) => (
                  <li key={interest} className="mb-1">
                    {interest}: <strong>Level {level}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
