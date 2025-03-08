import Button from "./button"
import { useState, useCallback, useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0/client";
import StyledLink from "./styledLink";
import ProfileCard from "./profileCard";
import { Card, CardBlock, CardContainer } from "./card";
import { error } from "console";

const SERVER = "http://127.0.0.1:38321"
// const SERVER = "https://problem-dating-app.cnicholson.hackclub.app"

export default function Demo() {
    const [demoNeedHelp, setDemoNeedHelp] = useState(false);
    const [demoSkills, setDemoSkills] = useState(["Python"]);
    const [demoThemes, setDemoThemes,] = useState(["education"]);

    const [_id, setID] = useState("");

    const [image, setImage] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [x, setX] = useState("");
    const [gitHub, setGitHub] = useState("");
    const [personalWebsite, setPersonalWebsite] = useState("");

    const [bio, setBio] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [availability, setAvailability] = useState("");

    const [needHelp, setNeedHelp] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [helpDescription, setHelpDescription] = useState("");
    const [projectLink, setProjectLink] = useState("");
    const [timeFrame, setTimeFrame] = useState(0);

    const [skills, setSkills] = useState([]);
    const [skillLevels, setSkillLevels] = useState<{ [key: string]: number }>({});
    const [themes, setThemes] = useState([]);

    const [noMatches, setNoMatches] = useState(false);
    const [polled, setPolled] = useState(false);

    const [warningMessage, setWarningMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function isValidURL(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    const getMatch = useCallback(async () => {
        try {
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
                setPolled(false);
            } else {
                setPolled(true);

                const data = await response.json();

                setName(data.match.name || "");
                setEmail(data.match.email || "");
                setLinkedIn(data.match.linkedIn || "");
                setX(data.match.x || "");
                setGitHub(data.match.gitHub || "");
                setPersonalWebsite(data.match.personalWebsite || "");

                setBio(data.match.bio || "");
                setCountry(data.match.country || "");
                setCity(data.match.city || "");
                setAvailability(data.match.availability || "");

                setNeedHelp(data.match.needHelp || false);
                setProjectName(data.match.projectName || "");
                setProjectDescription(data.match.projectDescription || "");
                setHelpDescription(data.match.helpDescription || "");
                setProjectLink(data.match.projectLink || "");
                setTimeFrame(data.match.timeFrame || "");

                setSkills(data.match.skills || []);
                setSkillLevels(data.match.skillLevels || {});
                setThemes(data.match.themes || []);

                setNoMatches(data.noMatches || false);

                if (data.match.image === "" || !isValidURL(data.match.image)) {
                    setImage("https://ui-avatars.com/api/?size=256&background=random&name=" + data.match.name.replace(" ", "+"));
                } else {
                    setImage(data.match.image);
                }
            }
        } catch (error) {
            console.error("Error: Failed to fetch settings: ", error);
            setErrorMessage(error);
            setPolled(false);
        }
    }, [demoNeedHelp, demoSkills, demoThemes]);

    useEffect(() => {
        getMatch();
    }, [getMatch]);

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
                        {noMatches && (
                            <CardBlock>
                                <p>Psst... there are no exact matches, so have a random one!</p>
                            </CardBlock>
                        )}
                        <div className="flex flex-col gap-5">
                            <ProfileCard user={{
                                name,
                                email,
                                linkedIn,
                                x,
                                gitHub,
                                personalWebsite,
                                image,
                                bio,
                                country,
                                city,
                                availability,
                                needHelp,
                                projectName,
                                projectDescription,
                                helpDescription,
                                projectLink,
                                timeFrame,
                                skills,
                                skillLevels,
                                themes,
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
                {errorMessage && (
                    <CardBlock>
                        {errorMessage}
                    </CardBlock>
                )}
            </Card>
        </CardContainer>
    )
}