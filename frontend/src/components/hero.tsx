import GradientButton from "./gradientButton"
import { useState, useCallback } from "react"
import { useUser } from "@auth0/nextjs-auth0/client";

const SERVER = "http://127.0.0.1:5000"

export default function Hero() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [needHelp, setNeedHelp] = useState(false);
    const [bio, setBio] = useState("");
    const [availability, setAvailability] = useState("");
    const [skills, setSkills] = useState([]);
    const [themes, setThemes] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [helpDescription, setHelpDescription] = useState("");
    const [projectLink, setProjectLink] = useState("");
    const [timeFrame, setTimeFrame] = useState(0);

    const [errorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [noMatches, setNoMatches] = useState(false);

    const { user, isLoading } = useUser();

    const handleSelectSkill = (skill) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter((t) => t !== skill));
        } else {
            setSkills([...skills, skill]);
        }
    };

    const handleSelectTheme = (theme) => {
        if (themes.includes(theme)) {
            setThemes(themes.filter((t) => t !== theme));
        } else {
            setThemes([...themes, theme]);
        }
    };

    const getMatch = useCallback(async () => {
        try {
            const response = await fetch(SERVER + "/api/get-match", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ needHelp: needHelp, skills: skills, themes: themes, demo: true }),
            });
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage("Server-side error: " + error.error);
                setErrorPresent(true);
                setNoMatches(error.noMatches);
            } else {
                const data = await response.json();
                setName(data.match.name || "");
                setEmail(data.match.email || "");
                setLinkedIn(data.match.linkedIn || "");
                setBio(data.match.bio || "");
                setAvailability(data.match.availability || "");
                setSkills(data.match.skills || []);
                setThemes(data.match.themes || []);
                setNeedHelp(data.match.needHelp || false);
                setProjectName(data.match.projectName || "");
                setProjectDescription(data.match.projectDescription || "");
                setHelpDescription(data.match.helpDescription || "");
                setProjectLink(data.match.projectLink || "");
                setTimeFrame(data.match.timeFrame || "");

                console.log("Match: ", data.match);
            }
        } catch (error) {
            console.error("Error: Failed to fetch settings: ", error);
            setErrorMessage(error);
            setErrorPresent(true);
        }
    }, [needHelp, skills, themes]);

    return (
        <div className="flex flex-row w-full h-fit">
            <div className="w-20 h-full"></div>
            <div className="relative w-full px-10 mt-[95px] pt-20 pb-14 mb-16 bg-gradient-to-br from-indigo-100 via-white to-cyan-200 animate-gradient-x rounded-3xl shadow-lg">
                <div className="w-full flex justify-center items-center mb-16">
                    <div className="w-full max-w-3xl">
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
                </div>

                <div
                    className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 h-fit w-fit  p-3 border border-stone-200 bg-slate-100 rounded-xl shadow-lg text-lg"
                >
                    <div className="flex items-center gap-3">
                        <select
                            defaultValue=""
                            className="w-fit border border-stone-200 p-3 rounded-xl hover:ring-2 hover:ring-indigo-300 hover:outline-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            onChange={(e) => setNeedHelp(e.target.value === "true")}
                        >
                            <option value="false">I want to help</option>
                            <option value="true">I need help</option>
                        </select>

                        <p>with</p>

                        <select defaultValue="" className="w-fit border border-stone-200 p-3 rounded-xl hover:ring-2 hover:ring-indigo-300 hover:outline-none focus:outline-none focus:ring-2 focus:ring-indigo-300" onChange={(e) => handleSelectSkill(e.target.value)}>
                            <option value="electrical engineering">electrical engineering</option>
                            <option value="Python">Python programming</option>
                            <option value="Fusion 360">Autodesk Fusion</option>
                            <option value="none" disabled>...and many more!</option>
                        </select>

                        <p>on</p>

                        <select defaultValue="" className="w-fit border border-stone-200 p-3 rounded-xl hover:ring-2 hover:ring-indigo-300 hover:outline-none focus:outline-none focus:ring-2 focus:ring-indigo-300" onChange={(e) => handleSelectTheme(e.target.value)}>
                            <option value="environment">an evironmental project</option>
                            <option value="passion project">a passion project</option>
                            <option value="healthcare">a medical project</option>
                            <option value="none" disabled>...and many more!</option>
                        </select>

                        <GradientButton
                            onClick={getMatch}
                            className="px-5 py-3 m-0 text-lg font-normal"
                            href=""
                            type="button"
                        >
                            Search
                        </GradientButton>
                    </div>
                    <div className="w-full flex justify-center items-center mt-20">
                        {noMatches && (<p>Oh snap. No matches can be found. Please broaden your horizons.</p>)}
                    </div>
                </div>
            </div>
            <div className="w-20 h-full"></div>
        </div>
    )
}