import Button from "./button"
import { useState, useCallback } from "react"
import { useUser } from "@auth0/nextjs-auth0/client";
import StyledLink from "./styledLink";
import ProfileCard from "./profileCard";
import { Card, CardBlock, CardContainer } from "./card";

const SERVER = "http://127.0.0.1:38321"
// const SERVER = "https://problem-dating-app.cnicholson.hackclub.app"

export default function Demo() {
    const [demoNeedHelp, setDemoNeedHelp] = useState(false);
    const [demoSkills, setDemoSkills] = useState(["Python"]);
    const [demoThemes, setDemoThemes,] = useState(["education"]);
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
    const [imageLink, setImageLink] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [noMatch, setNoMatch] = useState(false);
    const [polled, setPolled] = useState(false);

    const { user, isLoading } = useUser();

    function isValidURL(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    const handleSelectSkill = (skill) => {
        if (demoSkills.includes(skill)) {
            setDemoSkills(demoSkills.filter((t) => t !== skill));
        } else {
            setDemoSkills([...demoSkills, skill]);
        }
    };

    const handleSelectTheme = (theme) => {
        if (demoThemes.includes(theme)) {
            setDemoThemes(demoThemes.filter((t) => t !== theme));
        } else {
            setDemoThemes([...demoThemes, theme]);
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
                body: JSON.stringify({ needHelp: demoNeedHelp, skills: demoSkills, themes: demoThemes, demo: true }),
            });
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage("Server-side error: " + error.error);
                setErrorPresent(true);
                setNoMatch(error.noMatches);
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
                setNoMatch(data.noMatches || false);

                if (data.match.imageLink === "" || !isValidURL(data.match.imageLink)) {
                    setImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + data.match.name.replace(" ", "+"));
                } else {
                    setImageLink(data.match.imageLink);
                }

                console.log("Match: ", data.match);
            }
        } catch (error) {
            console.error("Error: Failed to fetch settings: ", error);
            setErrorMessage(error);
            setErrorPresent(true);
        }
    }, [demoNeedHelp, demoSkills, demoThemes]);

    return (
        <CardContainer className="mt-16 sm:mt-20 items-center w-full">
            <Card className="w-full sm:w-fit">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <select
                        defaultValue="false"
                        className="w-full md:w-fit border border-[--border] p-3 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent] bg-[--bg]"
                        onChange={(e) => setDemoNeedHelp(e.target.value === "true")}
                    >
                        <option value="false">I want to help</option>
                        <option value="true">I need help</option>
                    </select>

                    <p className="hidden md:block">with</p>

                    <select
                        defaultValue="Python"
                        className="w-full md:w-fit border border-[--border] p-3 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent] bg-[--bg]"
                        onChange={(e) => setDemoSkills([e.target.value])}
                    >
                        <option value="Python">Python programming</option>
                        <option value="Fusion 360">Autodesk Fusion</option>
                        <option value="none" disabled>...and many more!</option>
                    </select>

                    <p className="hidden md:block">on</p>

                    <select
                        defaultValue="education"
                        className="w-full md:w-fit border border-[--border] p-3 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent] bg-[--bg]"
                        onChange={(e) => setDemoThemes([e.target.value])}
                    >
                        <option value="education">an education project</option>
                        <option value="healthcare">a medical project</option>
                        <option value="none" disabled>...and many more!</option>
                    </select>

                    <Button
                        onClick={getMatch}
                        className="w-full md:w-auto px-5 py-2 m-0 text-lg text-[--accent] border-[--accent] border-2"
                        type="button"
                    >
                        Search
                    </Button>
                </div>

                {polled && (
                    <div className="mt-5 w-full">
                        {noMatch && (
                            <CardBlock>
                                <p>Psst... there are no exact matches, so have a random one!</p>
                            </CardBlock>
                        )}
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
                                timeFrame,
                                imageLink
                            }} />
                            <Button
                                className="px-5 py-2 text-lg font-normal text-center"
                                href="/api/auth/login"
                            >
                                Find more
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </CardContainer>
    )
}