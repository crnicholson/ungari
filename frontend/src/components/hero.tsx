import GradientButton from "./gradientButton"
import { useState, useCallback } from "react"
import { useUser } from "@auth0/nextjs-auth0/client";
import StyledLink from "./styledLink";
import { set } from "@auth0/nextjs-auth0/dist/session";

// const SERVER = "http://127.0.0.1:5000"
const SERVER = "https://problem-dating-app.cnicholson.hackclub.app"

export default function Hero() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [needHelp, setNeedHelp] = useState(false);
    const [bio, setBio] = useState("");
    const [availability, setAvailability] = useState("");
    const [skills, setSkills] = useState(["Python"]);
    const [themes, setThemes] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [helpDescription, setHelpDescription] = useState("");
    const [projectLink, setProjectLink] = useState("");
    const [timeFrame, setTimeFrame] = useState(0);

    const [errorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [noMatches, setNoMatches] = useState(false);
    const [polled, setPolled] = useState(false);

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
            setPolled(true);
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

                setNoMatches(false);

                console.log("Match: ", data.match);
            }
        } catch (error) {
            console.error("Error: Failed to fetch settings: ", error);
            setErrorMessage(error);
            setErrorPresent(true);
        }
    }, [needHelp, skills, themes]);

    return (
        <>
            <div className="z-10 flex flex-row w-full h-fit">
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
                </div>
                <div className="w-20 h-full"></div>
            </div>

            <div className="z-50 -mt-[100px] h-fit w-fit p-3 border border-stone-200 bg-slate-100 rounded-xl shadow-lg text-lg">
                <div className="flex items-center gap-3">
                    <select
                        defaultValue="false"
                        className="w-fit border border-stone-200 p-3 rounded-xl hover:ring-2 hover:ring-indigo-300 hover:outline-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={(e) => setNeedHelp(e.target.value === "true")}
                    >
                        <option value="false">I want to help</option>
                        <option value="true">I need help</option>
                    </select>

                    <p>with</p>

                    <select
                        defaultValue="Python"
                        className="w-fit border border-stone-200 p-3 rounded-xl hover:ring-2 hover:ring-indigo-300 hover:outline-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={(e) => handleSelectSkill(e.target.value)}
                    >
                        <option value="Python">Python programming</option>
                        {/* <option value="electrical engineering">electrical engineering</option>
                        <option value="Fusion 360">Autodesk Fusion</option> */}
                        <option value="none" disabled>...and many more!</option>
                    </select>

                    <p>on</p>

                    <select
                        defaultValue="education"
                        className="w-fit border border-stone-200 p-3 rounded-xl hover:ring-2 hover:ring-indigo-300 hover:outline-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onChange={(e) => handleSelectTheme(e.target.value)}
                    >
                        <option value="education">an education project</option>
                        {/* <option value="passion project">a passion project</option>
                        <option value="healthcare">a medical project</option> */}
                        <option value="none" disabled>...and many more!</option>
                    </select>

                    <GradientButton
                        onClick={getMatch}
                        className="px-5 py-2 m-0 text-lg font-normal"
                        type="button"
                    >
                        Search
                    </GradientButton>
                </div>

                {polled && (
                    <div className="mt-3 w-full flex justify-center items-center">
                        {noMatches ? (
                            <p> Oh snap. No matches can be found. Please broaden your horizons.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4 p-4 border border-stone-200 rounded-xl">
                                    <div className="flex-1">
                                        <StyledLink className="font-bold" href={linkedIn}>{name.split(" ")[0]}</StyledLink>
                                        <p className="blur-[3px]">{email}</p>
                                        <p>{bio}</p>

                                    </div>
                                    <div className="flex-1">
                                        {!needHelp && (
                                            <p>Available: {availability}</p>
                                        )}
                                        <p>Skills {name.split(" ")[0]} {needHelp ? "is looing for" : "has"}: {skills.join(", ")}</p>
                                        <p>Themes {needHelp ? "of the project" : `${name.split(" ")[0]} is looking for`}: {themes.join(", ")}</p>                                </div>
                                    {needHelp && (
                                        <div className="flex-1">
                                            <StyledLink className="font-bold" href={projectLink}>Project: {projectName}</StyledLink>
                                            <p>{projectDescription}</p>
                                            {/* <p>Help Needed: {helpDescription}</p> */}
                                            <p>Time Frame: {timeFrame} months</p>
                                        </div>
                                    )}

                                </div>
                                <GradientButton
                                    className="px-5 py-2 text-lg font-normal text-center"
                                    href="/api/auth/login"
                                >
                                    Find more
                                </GradientButton>
                            </div>
                        )}

                    </div>
                )}
            </div >
        </>
    )
}