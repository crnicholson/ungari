import Button from "./button"
import { useState, useCallback } from "react"
import { useUser } from "@auth0/nextjs-auth0/client";
import StyledLink from "./styledLink";
import ProfileCard from "./profileCard";
import { Card } from "./card";

// const SERVER = "http://127.0.0.1:5000"
const SERVER = "https://problem-dating-app.cnicholson.hackclub.app"

export default function Demo() {
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
        <div className="w-full h-fit flex justify-center items-center mt-20">
            <Card>
                <div className="flex items-center gap-3">
                    <select
                        defaultValue="false"
                        className="w-fit border border-[--border] p-3 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent] bg-[--bg]"
                        onChange={(e) => setNeedHelp(e.target.value === "true")}
                    >
                        <option value="false">I want to help</option>
                        <option value="true">I need help</option>
                    </select>

                    <p>with</p>

                    <select
                        defaultValue="Python"
                        className="w-fit border border-[--border] p-3 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent] bg-[--bg]"
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
                        className="w-fit border border-[--border] p-3 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent] bg-[--bg]"
                        onChange={(e) => handleSelectTheme(e.target.value)}
                    >
                        <option value="education">an education project</option>
                        {/* <option value="passion project">a passion project</option>
                        <option value="healthcare">a medical project</option> */}
                        <option value="none" disabled>...and many more!</option>
                    </select>

                    <Button
                        onClick={getMatch}
                        className="px-5 py-2 m-0 text-lg text-[--accent] border-[--accent] border-2"
                        type="button"
                    >
                        Search
                    </Button>
                </div>

                {polled && (
                    <div className="mt-5 w-full">
                        {noMatches ? (
                            <p className="text-center">Oh snap. No matches can be found. Please broaden your horizons.</p>
                        ) : (
                            <div className="flex flex-col gap-5">
                                <ProfileCard match={{
                                    name,
                                    email,
                                    linkedIn,
                                    bio,
                                    availability,
                                    skills,
                                    themes,
                                    needHelp,
                                    projectName,
                                    projectDescription,
                                    projectLink,
                                    timeFrame
                                }} />
                                <Button
                                    className="px-5 py-2 text-lg font-normal text-center"
                                    href="/api/auth/login"
                                >
                                    Find more
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}