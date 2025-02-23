"use client";

import { Card, CardContainer, CardTitle, CardInput, CardSubtitle, CardInputError, CardBlock, CardButton, CardRow } from "../../components/card";
import { Header, HeaderLogo, HeaderNav } from "../../components/header";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import Warning from "../../components/warning";
import Error from "../../components/error";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useUser } from "@auth0/nextjs-auth0/client";
import { set } from "@auth0/nextjs-auth0/dist/session";

const SERVER = "http://127.0.0.1:38321";
// const SERVER = "https://problem-dating-app.cnicholson.hackclub.app";

export default function Onboarding() {
    const [step, setStep] = useState(1);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [x, setX] = useState("");
    const [personalWebsite, setPersonalWebsite] = useState("");
    const [gitHub, setGitHub] = useState("");

    const [nameMessage, setNameMessage] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [linkedInMessage, setLinkedInMessage] = useState("");
    const [xMessage, setXMessage] = useState("");
    const [personalWebsiteMessage, setPersonalWebsiteMessage] = useState("");
    const [gitHubMessage, setGitHubMessage] = useState("");

    const [imageLink, setImageLink] = useState("");

    const [tempImageLink, setTempImageLink] = useState("");
    const [imageMessage, setImageMessage] = useState("");

    const [bio, setBio] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);
    const [availability, setAvailability] = useState(1);

    const [bioMessage, setBioMessage] = useState("");
    const [countryMessage, setCountryMessage] = useState("");
    const [cityMessage, setCityMessage] = useState("");
    const [availabilityMessage, setAvailabilityMessage] = useState("");

    const [needHelp, setNeedHelp] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [helpDescription, setHelpDescription] = useState("");
    const [projectLink, setProjectLink] = useState("");
    const [timeFrame, setTimeFrame] = useState(0);

    const [projectNameMessage, setProjectNameMessage] = useState("");
    const [projectDescriptionMessage, setProjectDescriptionMessage] = useState("");
    const [helpDescriptionMessage, setHelpDescriptionMessage] = useState("");
    const [projectLinkMessage, setProjectLinkMessage] = useState("");

    const [skills, setSkills] = useState([]);
    const [skillLevels, setSkillLevels] = useState<{ [key: string]: number }>({});
    const [themes, setThemes] = useState([]);

    const [skillsMessage, setSkillsMessage] = useState("");
    const [themesMessage, setThemesMessage] = useState("");

    const [skillSearchTerm, setSkillSearchTerm] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const [themeSearchTerm, setThemeSearchTerm] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [warningMessage, setWarningMessage] = useState("");
    const [submitMessage, setSubmitMessage] = useState("");

    const { user, isLoading } = useUser();
    const router = useRouter();

    // Basic auth
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/api/auth/login");
        }
    }, [isLoading, router, user]);

    useEffect(() => {
        if (!isLoading && user) {
            const getStatus = async () => {
                try {
                    const response = await fetch(SERVER + "/api/get-status", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: user.sub }),
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        setErrorMessage("Server-side error: " + error.error);
                    } else {
                        const data = await response.json();

                        if (data.someSettings ?? false) {
                            const message = encodeURIComponent("You were redirected here because some fields are not filled out or a new field was added.");
                            router.push(`/settings?redirectMessage=${message}`);
                        }
                        if (data.allSettings ?? false) {
                            const message = encodeURIComponent("You were redirected here because you already have done the onboarding process.");
                            router.push(`/settings?redirectMessage=${message}`);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch settings:", error);
                    setErrorMessage("Client-side error: " + error);
                }
            };

            getStatus();
        }
    }, [isLoading, user, router]);

    // Verification 
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidName(name: string): boolean {
        const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
        return nameRegex.test(name);
    }

    function isValidURL(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Loading image link 
    useEffect(() => {
        if (step === 2) {
            if (user && user.picture === "") {
                setImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + name.replace(" ", "+"));
                setTempImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + name.replace(" ", "+"));
            } else if (user && user.picture) {
                setImageLink(user.picture);
                setTempImageLink(user.picture);
            }
        }
    }, [step, user, name]);

    // Country selection 
    useEffect(() => {
        if (country) {
            setCities(countries[country]);
            setCity("");
        }
    }, [country]);

    // Skills
    const handleSkillLevelChange = (skill: string, level: number) => {
        setSkillLevels(prev => ({
            ...prev,
            [skill]: level
        }));
    };

    const getSkillLevelLabel = (level: number) => {
        const labels = [
            'Beginner',
            'Advanced Beginner',
            'Intermediate',
            'Advanced',
            'Expert'
        ];
        return labels[level - 1] || labels[0];
    };

    const filteredSkills = skillSearchTerm
        ? Object.values(categorizedSkills).flatMap(category => {
            if (typeof category === 'object' && !Array.isArray(category)) {
                return Object.values(category)
                    .flat()
                    .filter((skill): skill is string =>
                        typeof skill === 'string' &&
                        skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
                    );
            }
            return [];
        }).sort((a, b) => a.localeCompare(b))
        : [];

    const handleSelectSkill = (skill: string) => {
        if (skills.includes(skill)) {
            setSkills(skills.filter((s) => s !== skill));
            setSkillLevels(prev => {
                const { [skill]: _, ...rest } = prev;
                return rest;
            });
        } else {
            setSkills([...skills, skill]);
            setSkillLevels(prev => ({
                ...prev,
                [skill]: 1
            }));
        }
    };

    const toggleDropdown = (path) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const renderSkills = (items, path = "") => {
        if (Array.isArray(items)) {
            return items.map((skill) => (
                <div
                    key={skill}
                    className="flex flex-col lg:flex-row items-start justify-start lg:items-center lg:justify-between gap-5 p-2 border border-transparent hover:border-[--border] rounded-xl"
                >
                    <div className="w-full lg:w-auto">
                        <Checkbox
                            onChange={() => handleSelectSkill(skill)}
                            checked={skills.includes(skill)}
                        >
                            {skill}
                        </Checkbox>
                    </div>
                    {skills.includes(skill) && (
                        <div className="flex items-center gap-3 w-full lg:w-1/2">
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={skillLevels[skill] || 1}
                                onChange={(e) => handleSkillLevelChange(skill, parseInt(e.target.value))}
                                className="w-full lg:w-1/2 h-1 rounded-xl appearance-none cursor-pointer accent-[--lighter] bg-[--border]"
                            />
                            <span className="text-sm min-w-fit text-[--light]">
                                {getSkillLevelLabel(skillLevels[skill] || 1)}
                            </span>
                        </div>
                    )}
                </div>
            ));
        } else if (typeof items === "object") {
            return Object.entries(items).map(([key, value]) => {
                const newPath = path ? `${path}.${key}` : key;
                const isExpanded = expandedCategories[newPath];
                return (
                    <div key={key} className="mb-4">
                        <div
                            className="flex items-center cursor-pointer h-fit mb-2"
                            onClick={() => toggleDropdown(newPath)}
                        >
                            <h3 className="font-semibold h-full">{key}</h3>
                            <span className="h-full ml-2">{isExpanded ? "▼" : "▶"}</span>
                        </div>
                        {isExpanded && (
                            <div className="ml-4">{renderSkills(value, newPath)}</div>
                        )}
                    </div>
                );
            });
        }
        return null;
    };

    // Themes
    const handleSelectTheme = (theme) => {
        if (themes.includes(theme)) {
            setThemes(themes.filter((t) => t !== theme));
        } else {
            setThemes([...themes, theme]);
        }
    };

    const filteredThemes = listOfThemes
        .filter((theme) =>
            theme.toLowerCase().includes(themeSearchTerm.toLowerCase())
        )
        .sort((a, b) => a.localeCompare(b));

    // Step processing
    const handlePreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleNextStep = () => {
        let missingFields = [];
        let hasErrors = false;

        const validateURL = (url) => {
            if (!url.startsWith("https://")) {
                url = "https://" + url;
            }
            return isValidURL(url) ? url : "";
        };

        switch (step) {
            case 1:
                if (!name) {
                    missingFields.push("name");
                    setNameMessage("Name is required");
                    hasErrors = true;
                } else {
                    setNameMessage("");
                }
                if (!email) {
                    missingFields.push("email");
                    setEmailMessage("Email is required");
                    hasErrors = true;
                } else if (!isValidEmail(email)) {
                    setEmailMessage("Invalid email");
                    hasErrors = true;
                } else {
                    setEmailMessage("");
                }
                if (!linkedIn) {
                    missingFields.push("LinkedIn");
                    setLinkedInMessage("LinkedIn is required");
                    hasErrors = true;
                } else {
                    const url = validateURL(linkedIn);
                    if (!url) {
                        setLinkedInMessage("Invalid LinkedIn URL");
                        hasErrors = true;
                    } else {
                        setLinkedInMessage("");
                    }
                    setLinkedIn(url);
                }
                if (x) {
                    const url = validateURL(x);
                    if (!x) {
                        setXMessage("Invalid X URL");
                        hasErrors = true;
                    } else {
                        setXMessage("");
                    }
                    setX(url);
                }
                if (personalWebsite) {
                    const url = validateURL(personalWebsite);
                    if (!url) {
                        setPersonalWebsiteMessage("Invalid personal website URL");
                        hasErrors = true;
                    } else {
                        setPersonalWebsiteMessage("");
                    }
                    setPersonalWebsite(url);
                }
                if (gitHub) {
                    const url = validateURL(gitHub);
                    if (!url) {
                        setGitHubMessage("Invalid GitHub URL");
                        hasErrors = true;
                    } else {
                        setGitHubMessage("");
                    }
                    setGitHub(url);
                }
                break;
            case 2:
                if (!imageLink) {
                    missingFields.push("profile picture");
                    setImageMessage("Profile picture is required");
                    hasErrors = true;
                } else {
                    setImageMessage("");
                }
                break;
            case 3:
                if (!bio) {
                    missingFields.push("bio");
                    setBioMessage("Bio is required");
                    hasErrors = true;
                } else if (bio.length < 10) {
                    setBioMessage(`A ${bio.length} character bio?`);
                    hasErrors = true;
                } else {
                    setBioMessage("");
                }
                if (!country) {
                    missingFields.push("country");
                    setCountryMessage("Country is required");
                    hasErrors = true;
                } else {
                    setCountryMessage("");
                }
                if (country && country !== "Prefer not to say" && !city) {
                    missingFields.push("city");
                    setCityMessage("City is required");
                    hasErrors = true;
                } else {
                    setCityMessage("");
                }
                if (availability === 0) {
                    missingFields.push("availability");
                    setAvailabilityMessage("You're available for 0 hours?");
                    hasErrors = true;
                } else {
                    setAvailabilityMessage("");
                }
                break;
            case 4:
                if (needHelp) {
                    if (!projectName) {
                        missingFields.push("project name");
                        setProjectNameMessage("Project name is required");
                        hasErrors = true;
                    } else {
                        setProjectNameMessage("");
                    }
                    if (!projectDescription) {
                        missingFields.push("project description");
                        setProjectDescriptionMessage("Project description is required");
                        hasErrors = true;
                    } else {
                        setProjectDescriptionMessage("");
                    }
                    if (!helpDescription) {
                        missingFields.push("help description");
                        setHelpDescriptionMessage("Help description is required");
                        hasErrors = true;
                    } else {
                        setHelpDescriptionMessage("");
                    }
                    if (!projectLink) {
                        missingFields.push("project link");
                        setProjectLinkMessage("Project link is required");
                        hasErrors = true;
                    } else {
                        const url = validateURL(projectLink);
                        if (!validateURL(projectLink)) {
                            setProjectLinkMessage("URL doesn't seem to be working");
                            hasErrors = true;
                        } else {
                            setProjectLinkMessage("");
                        }
                        setProjectLink(url);
                    }
                }
                break;
            case 5:
                if (skills.length === 0) {
                    missingFields.push("skills");
                    setSkillsMessage("Skills are required");
                    hasErrors = true;
                } else if (skills.length < 3) {
                    setSkillsMessage("You need at least three skills selected");
                    hasErrors = true;
                } else {
                    setSkillsMessage("");
                }
                if (themes.length === 0) {
                    missingFields.push("themes");
                    setThemesMessage("Themes are required");
                    hasErrors = true;
                } else if (themes.length < 3) {
                    setThemesMessage("You need at least three themes selected");
                    hasErrors = true;
                } else {
                    setThemesMessage("");
                }
                break;
            default:
                break;
        }

        if (missingFields.length > 0 || hasErrors) {
            const formattedMessage = missingFields.length === 1
                ? `${missingFields[0]} is missing`
                : `${missingFields.slice(0, -1).join(", ")} and ${missingFields[missingFields.length - 1]} are missing`;
            // setSubmitMessage(`Uh oh, ${formattedMessage}.`);
        } else {
            setSubmitMessage("");
            setStep(step + 1);
        }
    };

    // Syncing with backend 
    const saveSettings = async () => {
        try {
            const response = await fetch(SERVER + "/api/set-onboarding-settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: user.sub,
                    name: name,
                    email: email,
                    linkedIn: linkedIn,
                    x: x,
                    personalWebsite: personalWebsite,
                    gitHub: gitHub,
                    imageLink: imageLink,
                    bio: bio,
                    country: country,
                    city: city,
                    availability: availability,
                    needHelp: needHelp,
                    projectName: projectName,
                    projectDescription: projectDescription,
                    projectLink: projectLink,
                    helpDescription: helpDescription,
                    timeFrame: timeFrame,
                    skills: skills,
                    skillLevels: skillLevels,
                    themes: themes,
                }),
            });
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage("Server-side error: " + error.error);
            }
            setSubmitMessage("Settings saved successfully! Redirecting to match...");

            router.push("/match");
        } catch (error) {
            console.error("Failed to set user information: ", error);
            setErrorMessage("Client-side error: " + error);
        }
    };

    // Displaying each section of the form, final function
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <CardBlock>
                            <CardSubtitle className="mb-2">What{"'"}s your name? *</CardSubtitle>
                            <CardInput
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameMessage(e.target.value === "" || isValidName(e.target.value) ? "" : "Please enter a valid name");
                                }}
                                placeholder="Enter your full name"
                            />
                            <CardInputError>{nameMessage}</CardInputError>
                        </CardBlock>
                        <CardBlock>
                            <CardSubtitle className="mb-2">Email *</CardSubtitle>
                            <CardInput
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setEmailMessage(e.target.value === "" || isValidEmail(e.target.value) ? "" : "Hmm... that email doesn't seem right");
                                }}
                                placeholder="We'll shoot you an email if we find a match"
                            />
                            <CardInputError>{emailMessage}</CardInputError>
                        </CardBlock>
                        <CardBlock>
                            <CardSubtitle className="mb-2">LinkedIn *</CardSubtitle>
                            <CardInput
                                value={linkedIn}
                                onChange={(e) => {
                                    setLinkedIn(e.target.value)
                                    setLinkedInMessage(e.target.value === "" || e.target.value.includes("linkedin.co") ? "" : "LinkedIn without linkedin.com? 🤔");
                                }}
                                placeholder="To help with credibility"
                            />
                            <CardInputError>{linkedInMessage}</CardInputError>
                        </CardBlock>
                        <CardBlock>
                            <CardSubtitle className="mb-2">X (optional)</CardSubtitle>
                            <CardInput
                                value={x}
                                onChange={(e) => {
                                    setX(e.target.value)
                                    setXMessage(e.target.value === "" || e.target.value.includes("x.co") ? "" : "X without x.com? 🤔");
                                }}
                                placeholder="For funsies"
                            />
                            <CardInputError>{xMessage}</CardInputError>
                        </CardBlock>
                        <CardBlock>
                            <CardSubtitle className="mb-2">Personal website (optional)</CardSubtitle>
                            <CardInput
                                value={personalWebsite}
                                onChange={(e) => {
                                    setPersonalWebsite(e.target.value)
                                    setPersonalWebsiteMessage(personalWebsite.includes("onlyfans.co") ? "I see what you're doing there" : "");
                                }}
                                placeholder="Have a portfolio? Share it here"
                            />
                            <CardInputError>{personalWebsiteMessage}</CardInputError>
                        </CardBlock>
                        <CardBlock>
                            <CardSubtitle className="mb-2">GitHub (optional)</CardSubtitle>
                            <CardInput
                                value={gitHub}
                                onChange={(e) => {
                                    setGitHub(e.target.value)
                                    setGitHubMessage(e.target.value === "" || e.target.value.includes("github.co") ? "" : "GitHub without github.com? 🤔");

                                }}
                                placeholder="Git off the Hub"
                            />
                            <CardInputError>{gitHubMessage}</CardInputError>
                        </CardBlock>
                    </>
                );
            case 2:
                return (
                    <>
                        <CardBlock>
                            <CardSubtitle className="mb-2">Does this profile picture look good?</CardSubtitle>
                            <Image
                                src={imageLink}
                                alt={`${name}'s profile`}
                                className="rounded-full object-cover ring-2 ring-[--border]"
                                width={96}
                                height={96}
                            />
                        </CardBlock>

                        <CardBlock>
                            <CardSubtitle className="mb-2">Enter a new image link (optional)</CardSubtitle>
                            <CardRow className="flex-col sm:flex-row">
                                <CardInput
                                    value={tempImageLink}
                                    onChange={(e) => setTempImageLink(e.target.value)}
                                    placeholder="Make it blank to use the default image!"
                                    className="w-full"
                                />
                                <CardButton
                                    onClick={() => {
                                        if (tempImageLink !== "") {
                                            if (isValidURL(tempImageLink)) {
                                                setImageLink(tempImageLink);
                                                setImageMessage("");
                                            } else {
                                                setImageMessage("Invalid URL!");
                                            }
                                        } else {
                                            if (user && user.picture === "") {
                                                setImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + name.replace(" ", "+"));
                                                setTempImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + name.replace(" ", "+"));
                                                setImageMessage("");
                                            } else if (user && user.picture !== "") {
                                                setImageLink(user.picture);
                                                setTempImageLink(user.picture);
                                                setImageMessage("");
                                            }
                                        }
                                    }}
                                >
                                    Update image
                                </CardButton>
                            </CardRow>
                            <CardInputError>{imageMessage}</CardInputError>
                        </CardBlock>
                    </>
                )
            case 3:
                return (
                    <>
                        <CardBlock>
                            <CardSubtitle className="mb-2">Tell us about yourself! ({50 - bio.length} chars) *</CardSubtitle>
                            <textarea
                                className="w-full p-3 border border-stone-200 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent]"
                                placeholder="Special notes, preferences, favorite color? Max 50 characters."
                                rows={3}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={50}
                            ></textarea>
                            <CardInputError>{bioMessage}</CardInputError>
                        </CardBlock>

                        <CardBlock>
                            <CardSubtitle className="mb-2">Choose your country *</CardSubtitle>
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full border border-[--border] p-3 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent]"
                            >
                                <option value="">Select a country</option>
                                {Object.keys(countries).map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                            <CardInputError>{countryMessage}</CardInputError>
                        </CardBlock>
                        {(country && country != "Prefer not to say") && (
                            <CardBlock>
                                <CardSubtitle className="mb-2">Choose your city *</CardSubtitle>
                                <select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full border border-[--border] p-3 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent]"
                                >
                                    <option value="">Select a city</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                                <CardInputError>{cityMessage}</CardInputError>
                            </CardBlock>
                        )}

                        <CardBlock>
                            <CardSubtitle className="mb-2">Availability (hours per week) *</CardSubtitle>
                            <CardInput
                                type="number"
                                value={availability.toString()}
                                onChange={(e) => {
                                    const value = Math.max(0, Math.min(125, Number(e.target.value)));
                                    setAvailability(value);
                                }}
                                placeholder="How many hours per week are you available?"
                            />
                            <CardInputError>{availabilityMessage}</CardInputError>
                        </CardBlock>
                    </>
                );
            case 4:
                return (
                    <>
                        <CardBlock>
                            <CardSubtitle className="mb-2">
                                Do you want to help, or do you need help? *
                            </CardSubtitle>
                            <div className="flex flex-col gap-2">
                                <Checkbox
                                    onChange={() => setNeedHelp(false)}
                                    checked={!needHelp}
                                >
                                    I want to help, I have no project
                                </Checkbox>

                                <Checkbox
                                    onChange={() => setNeedHelp(true)}
                                    checked={needHelp}
                                >
                                    I need help, I have a project
                                </Checkbox>
                            </div>
                        </CardBlock>

                        {needHelp && (
                            <>
                                <CardBlock>
                                    <CardSubtitle className="mb-2">What{"'"}s your project called? *</CardSubtitle>
                                    <CardInput
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        placeholder="Automatic cereal feeder to save the rhinos"
                                    />
                                    <CardInputError>{projectNameMessage}</CardInputError>
                                </CardBlock>
                                <CardBlock>
                                    <CardSubtitle className="mb-2">Tell us about your project! ({100 - projectDescription.length} chars) *</CardSubtitle>
                                    <textarea
                                        className="w-full p-3 border border-stone-200 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent]"
                                        placeholder="What's it do? Why's it cool? Max 100 characters."
                                        rows={3}
                                        value={projectDescription}
                                        onChange={(e) => setProjectDescription(e.target.value)}
                                        maxLength={100}
                                    ></textarea>
                                    <CardInputError>{projectDescriptionMessage}</CardInputError>
                                </CardBlock>
                                <CardBlock>
                                    <CardSubtitle className="mb-2">Anything specific you need help on? We{"'"}ll ask about skills later. ({100 - helpDescription.length} chars) *</CardSubtitle>
                                    <textarea
                                        className="w-full p-3 border border-stone-200 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent]"
                                        placeholder="I need to make sure the electric boogaloo can attract rhinos. Max 100 characters."
                                        rows={3}
                                        value={helpDescription}
                                        onChange={(e) => setHelpDescription(e.target.value)}
                                        maxLength={100}
                                    ></textarea>
                                    <CardInputError>{helpDescriptionMessage}</CardInputError>
                                </CardBlock>
                                <CardBlock>
                                    <CardSubtitle className="mb-2">Project link *</CardSubtitle>
                                    <CardInput
                                        value={projectLink}
                                        onChange={(e) => setProjectLink(e.target.value)}
                                        placeholder="Like github.com/crnicholson/StratoSoar-MK3"
                                    />
                                    <CardInputError>{projectLinkMessage}</CardInputError>
                                </CardBlock>
                            </>
                        )}
                        <CardBlock>
                            <CardSubtitle className="mb-2">{!needHelp ? "How many months do you want to work for? 0 for unknown. *" : "How many months do you anticipate the project taking? 0 for unknown. *"}</CardSubtitle>
                            <CardInput
                                type="number"
                                value={timeFrame.toString()}
                                onChange={(e) => {
                                    const value = Math.max(0, Math.min(60, Number(e.target.value)));
                                    setTimeFrame(value);
                                }}
                                placeholder={`${!needHelp ? "How many months do you want to work for? 0 for unknown." : "How many months do you anticipate the project taking? 0 for unknown"}`}
                            />
                        </CardBlock>
                    </>
                );
            case 5:
                return (
                    <>
                        <CardBlock>
                            <CardSubtitle className="mb-2">Skills {needHelp ? "I'm looking for" : "I have"} *</CardSubtitle>
                            <CardInput
                                type="text"
                                value={skillSearchTerm}
                                onChange={(e) => setSkillSearchTerm(e.target.value)}
                                placeholder="Search across all categories..."
                            />
                        </CardBlock>
                        <CardBlock>
                            <div className="overflow-y-auto border p-3 rounded-xl max-h-[60vh]">
                                {skillSearchTerm ? (
                                    filteredSkills.length > 0 ? (
                                        filteredSkills.map((skill) => (
                                            <div key={skill} className="flex flex-col lg:flex-row items-start justify-start lg:items-center lg:justify-between gap-5 p-2 border border-transparent hover:border-[--border] rounded-xl">
                                                <div className="w-full lg:w-auto">
                                                    <Checkbox
                                                        onChange={() => handleSelectSkill(skill)}
                                                        checked={skills.includes(skill)}
                                                    >
                                                        {skill}
                                                    </Checkbox>
                                                </div>
                                                {skills.includes(skill) && (
                                                    <div className="flex flex-row justify-left items-center gap-3 w-full lg:w-1/2">
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="5"
                                                            value={skillLevels[skill] || 1}
                                                            onChange={(e) => handleSkillLevelChange(skill, parseInt(e.target.value))}
                                                            className="w-full lg:w-1/2 h-1 rounded-xl appearance-none cursor-pointer accent-[--lighter] bg-[--border]"
                                                        />
                                                        <span className="text-sm min-w-fit text-[--light]">
                                                            {getSkillLevelLabel(skillLevels[skill] || 1)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center h-32 text-gray-500">
                                            No skills found matching {'"'}{skillSearchTerm}{'"'}
                                        </div>
                                    )
                                ) : (
                                    renderSkills(categorizedSkills)
                                )}
                            </div>
                            <CardInputError>{skillsMessage}</CardInputError>
                        </CardBlock>

                        <CardBlock>
                            <CardSubtitle className="mb-2">{!needHelp ? "Preferred project themes" : "Themes of your project"} *</CardSubtitle>
                            <CardInput
                                type="text"
                                value={themeSearchTerm}
                                onChange={(e) => setThemeSearchTerm(e.target.value)}
                                placeholder="Search themes..."
                            />
                        </CardBlock>

                        <CardBlock>
                            <div className="overflow-y-auto border p-3 rounded-xl max-h-60">
                                {filteredThemes.map((theme) => (
                                    <div key={theme} className="flex justify-between items-center p-2 border border-transparent hover:border-[--border] rounded-xl">
                                        <Checkbox
                                            checked={themes.includes(theme)}
                                            onChange={() => handleSelectTheme(theme)}
                                        >
                                            {theme}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                            <CardInputError>{themesMessage}</CardInputError>
                        </CardBlock>
                    </>
                );
            case 6:
                return (
                    <CardBlock>
                        <CardSubtitle className="mb-2">Ready to submit?</CardSubtitle>
                        <p>You can always go back and change your settings in the settings tab.</p>
                    </CardBlock>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Header>
                <HeaderLogo href="/">
                    <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
                </HeaderLogo>
                <HeaderNav>
                    <Button href="/api/auth/logout">Logout</Button>
                </HeaderNav>
            </Header>

            {errorMessage !== "" && (
                <Error onClick={() => setErrorMessage("")} className="sm:w-1/2 w-full mt-24">{errorMessage}</Error>
            )}

            {warningMessage !== "" && (
                <Warning onClick={() => setWarningMessage("")} className={`sm:w-1/2 w-full ${errorMessage !== "" ? 'mt-5' : 'mt-24'}`}>{warningMessage}</Warning>
            )}

            <CardContainer className={`sm:w-3/4 lg:w-2/3 xl:w-1/2 w-full ${(errorMessage !== "" || warningMessage !== "") ? 'mt-5' : 'mt-24'}`}>
                <Card className="w-full">
                    <CardTitle size={2}>Onboarding</CardTitle>

                    {errorMessage !== "" ? (
                        <p>We{"'"}re down right now, try reloading!</p>
                    ) : (
                        <>
                            {renderStep()}

                            <div className="flex justify-between mt-5">
                                {step > 1 ? (
                                    <CardButton onClick={handlePreviousStep}>Previous</CardButton>
                                ) : (
                                    <div></div>
                                )}
                                {step < 6 ? (
                                    <div className={`flex flex-row items-center justify-center gap-3`}>
                                        <p>({step}/6)</p>
                                        <CardButton onClick={handleNextStep}>Next</CardButton>
                                    </div>
                                ) : (
                                    <CardButton onClick={saveSettings}>Submit!</CardButton>
                                )}
                            </div>

                            {submitMessage !== "" && (
                                <p className="mt-4">{submitMessage}</p>
                            )}
                        </>
                    )}
                </Card>
            </CardContainer>
        </>
    );
}

const countries = {
    "Prefer not to say": [],
    "USA": [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        "Philadelphia",
        "San Antonio",
        "San Diego",
        "Dallas",
        "San Jose",
        "Austin",
        "Jacksonville",
        "Fort Worth",
        "Columbus",
        "Charlotte",
        "San Francisco",
        "Indianapolis",
        "Seattle",
        "Denver",
        "Washington, D.C.",
        "Boston",
        "El Paso",
        "Nashville",
        "Detroit",
        "Oklahoma City",
        "Portland",
        "Las Vegas",
        "Memphis",
        "Louisville",
        "Baltimore",
        "Milwaukee",
        "Albuquerque",
        "Tucson",
        "Fresno",
        "Sacramento",
        "Kansas City",
        "Long Beach",
        "Mesa",
        "Atlanta",
        "Colorado Springs",
        "Virginia Beach",
        "Raleigh",
        "Omaha",
        "Miami",
        "Oakland",
        "Minneapolis",
        "Tulsa",
        "Wichita",
        "New Orleans",
        "Arlington",
        "Other"
    ],
    "Canada": [
        "Toronto",
        "Vancouver",
        "Montreal",
        "Calgary",
        "Ottawa",
        "Edmonton",
        "Winnipeg",
        "Quebec City",
        "Hamilton",
        "Kitchener",
        "London",
        "Victoria",
        "Halifax",
        "Oshawa",
        "Windsor",
        "Saskatoon",
        "St. Catharines",
        "Regina",
        "St. John's",
        "Kelowna",
        "Other"
    ],
    "UK": [
        "London",
        "Manchester",
        "Birmingham",
        "Leeds",
        "Glasgow",
        "Liverpool",
        "Edinburgh",
        "Bristol",
        "Sheffield",
        "Newcastle",
        "Leicester",
        "Nottingham",
        "Southampton",
        "Portsmouth",
        "Oxford",
        "Cambridge",
        "Cardiff",
        "Belfast",
        "Aberdeen",
        "Dundee",
        "Other"
    ],
    "Australia": [
        "Sydney",
        "Melbourne",
        "Brisbane",
        "Perth",
        "Adelaide",
        "Gold Coast",
        "Canberra",
        "Newcastle",
        "Wollongong",
        "Hobart",
        "Geelong",
        "Townsville",
        "Cairns",
        "Toowoomba",
        "Darwin",
        "Ballarat",
        "Bendigo",
        "Albury",
        "Launceston",
        "Mackay",
        "Other"
    ],
    "India": [
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Hyderabad",
        "Chennai",
        "Kolkata",
        "Pune",
        "Ahmedabad",
        "Surat",
        "Jaipur",
        "Lucknow",
        "Kanpur",
        "Nagpur",
        "Indore",
        "Thane",
        "Bhopal",
        "Visakhapatnam",
        "Patna",
        "Vadodara",
        "Ghaziabad",
        "Other"
    ],
    "Germany": [
        "Berlin",
        "Hamburg",
        "Munich",
        "Cologne",
        "Frankfurt",
        "Stuttgart",
        "Düsseldorf",
        "Dortmund",
        "Essen",
        "Leipzig",
        "Bremen",
        "Dresden",
        "Hanover",
        "Nuremberg",
        "Duisburg",
        "Bochum",
        "Wuppertal",
        "Bielefeld",
        "Bonn",
        "Münster",
        "Other"
    ],
    "France": [
        "Paris",
        "Marseille",
        "Lyon",
        "Toulouse",
        "Nice",
        "Nantes",
        "Strasbourg",
        "Montpellier",
        "Bordeaux",
        "Lille",
        "Rennes",
        "Reims",
        "Le Havre",
        "Saint-Étienne",
        "Toulon",
        "Grenoble",
        "Dijon",
        "Angers",
        "Nîmes",
        "Villeurbanne",
        "Other"
    ],
    "Japan": [
        "Tokyo",
        "Osaka",
        "Nagoya",
        "Sapporo",
        "Fukuoka",
        "Kobe",
        "Kyoto",
        "Kawasaki",
        "Saitama",
        "Hiroshima",
        "Sendai",
        "Kitakyushu",
        "Chiba",
        "Sakai",
        "Niigata",
        "Hamamatsu",
        "Shizuoka",
        "Okayama",
        "Kumamoto",
        "Sagamihara",
        "Other"
    ],
    "China": [
        "Beijing",
        "Shanghai",
        "Guangzhou",
        "Shenzhen",
        "Chengdu",
        "Tianjin",
        "Wuhan",
        "Chongqing",
        "Hangzhou",
        "Xi'an",
        "Nanjing",
        "Shenyang",
        "Harbin",
        "Qingdao",
        "Dalian",
        "Zhengzhou",
        "Jinan",
        "Changsha",
        "Kunming",
        "Fuzhou",
        "Other"
    ],
    "Brazil": [
        "São Paulo",
        "Rio de Janeiro",
        "Brasília",
        "Salvador",
        "Fortaleza",
        "Belo Horizonte",
        "Manaus",
        "Curitiba",
        "Recife",
        "Porto Alegre",
        "Belém",
        "Goiânia",
        "Guarulhos",
        "Campinas",
        "São Luís",
        "São Gonçalo",
        "Maceió",
        "Duque de Caxias",
        "Natal",
        "Teresina",
        "Other"
    ]
}

const listOfThemes = [
    "Healthcare",
    "Education",
    "Environment",
    "Social justice",
    "Technology",
    "Art",
    "Science",
    "Engineering",
    "Design",
    "Business",
    "Finance",
    "Marketing",
    "Entertainment",
    "Sports",
    "Food",
    "Fashion",
    "Travel",
    "Passion project"
];

const categorizedSkills = {
    "Engineering Disciplines": {
        "Core Engineering": [
            "Mechanical engineering",
            "Electrical engineering",
            "Civil engineering",
            "Aerospace engineering",
            "Chemical engineering",
            "Computer engineering",
            "Environmental engineering",
            "Industrial engineering",
            "Nuclear engineering",
            "Materials science"
        ],
        "Interdisciplinary Engineering": [
            "Bioengineering",
            "Mechatronics",
            "Neural engineering",
            "Financial engineering",
            "Systems engineering",
            "Automotive engineering",
            "Ocean engineering",
            "Clinical engineering"
        ]
    },

    "Specialized Engineering": {
        "Emerging Fields": [
            "Nanoengineering",
            "Quantum engineering",
            "Plasma engineering",
            "Cryogenic engineering"
        ],
        "Industry-Specific Engineering": [
            "Textile engineering",
            "Agricultural engineering",
            "Mining engineering",
            "Petroleum engineering",
            "Marine engineering",
            "Railway engineering",
            "Packaging engineering",
            "Fire protection engineering",
            "Geodetic engineering",
            "Geomatics engineering"
        ],
        "Infrastructure & Construction": [
            "Architectural engineering",
            "Construction engineering",
            "Pipeline engineering",
            "Water resources engineering",
            "Earthquake engineering",
            "Building services engineering"
        ],
        "Technology-Driven Engineering": [
            "Control systems engineering",
            "Optical engineering",
            "Power systems engineering",
            "Telecommunications engineering",
            "Space systems engineering",
            "Avionics engineering"
        ]
    },

    "Software Development": {
        "Programming Languages": [
            "Java",
            "Python",
            "JavaScript",
            "TypeScript",
            "C++",
            "C#",
            "Ruby",
            "Swift",
            "Kotlin",
            "Rust",
            "Go",
            "Dart",
            "Scala",
            "Haskell",
            "Clojure",
            "Erlang",
            "R language",
            "Perl",
            "PHP",
            "SQL",
            "C language",
            "Assembly",
            "WebAssembly",
            "Wolfram Language",
            "MATLAB",
            "Cobol",
            "Julia",
            "F#",
            "Lisp",
            "Bash scripting",
            "Ada",
            "ABAP",
            "ActionScript",
            "APL",
            "Ballerina",
            "Crystal",
            "D",
            "Delphi",
            "Elixir",
            "Elm",
            "Fortran",
            "Groovy",
            "Hack",
            "Io",
            "J",
            "Lua",
            "Mercury",
            "Nim",
            "OCaml",
            "Pascal",
            "Prolog",
            "PureScript",
            "Racket",
            "Reason",
            "ReScript",
            "Scheme",
            "Smalltalk",
            "Standard ML",
            "TCL",
            "VBA",
            "Zig"
        ],
        "Web Development": {
            "Frontend": [
                "HTML",
                "CSS",
                "Tailwind CSS",
                "Bootstrap",
                "Material-UI",
                "React",
                "Angular",
                "Vue",
                "Svelte",
                "Next.js",
                "Gatsby",
                "Nuxt.js",
                "SolidJS",
                "Alpine.js",
                "Astro",
                "Ember.js",
                "Lit",
                "Marko",
                "Mithril",
                "Polymer",
                "Preact",
                "Qwik",
                "Remix",
                "Stimulus",
                "Stencil",
                "Svelte Kit",
                "Web Components"
            ],
            "Backend": [
                "Node.js",
                "Deno",
                "Express",
                "Socket.io",
                "GraphQL",
                "Prisma",
                "Hasura",
                "REST APIs",
                "JSON APIs",
                "WebSockets",
                "Flask",
                "Django",
                "FastAPI",
                "Spring Boot",
                "Ruby on Rails",
                "Laravel",
                "NestJS",
                "AdonisJS",
                "ASP.NET Core",
                "Axum",
                "Bottle",
                "CakePHP",
                "Chi",
                "Echo",
                "Falcon",
                "Fiber",
                "Gin",
                "Grails",
                "Ktor",
                "Micronaut",
                "Quarkus",
                "Rocket",
                "Sails.js",
                "Symfony",
                "Tornado",
                "Vert.x",
                "Vapor"
            ],
            "Build Tools & Bundlers": [
                "Babel",
                "Browserify",
                "ESBuild",
                "Grunt",
                "Gulp",
                "Parcel",
                "Rollup",
                "Snowpack",
                "SWC",
                "Turbopack",
                "Vite",
                "Webpack"
            ]
        },
        "Databases": {
            "Relational": [
                "PostgreSQL",
                "MySQL",
                "SQLite",
                "MariaDB"
            ],
            "NoSQL": [
                "MongoDB",
                "Redis",
                "Memcached",
                "Elasticsearch",
                "Cassandra",
                "Couchbase",
                "DynamoDB",
                "Firestore",
                "FaunaDB",
                "Supabase"
            ],
            "Specialized": [
                "Graph databases",
                "Time-series databases",
                "Neo4j",
                "InfluxDB"
            ]
        },
        "DevOps & Cloud": {
            "Cloud Platforms": [
                "Amazon Web Services (AWS)",
                "Google Cloud Platform (GCP)",
                "Microsoft Azure",
                "Alibaba Cloud",
                "DigitalOcean",
                "Heroku",
                "IBM Cloud",
                "Oracle Cloud",
                "Rackspace",
                "Red Hat OpenShift",
                "SAP Cloud Platform",
                "VMware Cloud"
            ],
            "DevOps Tools": [
                "Docker",
                "Kubernetes",
                "Terraform",
                "Ansible",
                "Helm",
                "Jenkins",
                "Prometheus",
                "Grafana",
                "Datadog",
                "Splunk",
                "ELK Stack",
                "New Relic",
                "OpenTelemetry",
                "Zipkin"
            ],
            "Serverless & Functions": [
                "AWS Lambda",
                "Google Cloud Functions",
                "Azure Functions",
                "Firebase",
                "Netlify Functions",
                "Vercel Functions"
            ]
        }
    },

    "Data Science & Analytics": {
        "Core Concepts": [
            "Statistical analysis",
            "Data mining",
            "Data cleaning",
            "Feature engineering",
            "Dimensionality reduction",
            "Time series analysis",
            "Anomaly detection",
            "Pattern recognition",
            "Cluster analysis",
            "Regression analysis",
            "Classification algorithms",
            "Ensemble methods",
            "Cross-validation",
            "Hyperparameter tuning"
        ],
        "Tools & Libraries": [
            "NumPy",
            "Pandas",
            "SciPy",
            "Scikit-learn",
            "TensorFlow",
            "PyTorch",
            "Keras",
            "XGBoost",
            "LightGBM",
            "CatBoost",
            "Spark MLlib",
            "H2O.ai",
            "RAPIDS",
            "Dask"
        ],
        "Visualization": [
            "Matplotlib",
            "Seaborn",
            "Plotly",
            "D3.js",
            "Tableau",
            "Power BI",
            "Looker",
            "Grafana",
            "Kibana",
            "Observable"
        ]
    },

    "Artificial Intelligence": {
        "Core AI": [
            "Machine learning",
            "Deep learning",
            "Artificial neural networks",
            "Reinforcement learning",
            "Explainable AI",
            "AI ethics"
        ],
        "Applications": [
            "Natural language processing",
            "Computer vision",
            "Predictive modeling",
            "Big data analytics",
            "Business intelligence",
            "Data engineering"
        ]
    },

    "Game Development": {
        "Engines & Frameworks": [
            "Unity",
            "Unreal Engine",
            "Godot",
            "LÖVE",
            "Phaser",
            "Cocos2d",
            "MonoGame",
            "PlayCanvas",
            "Babylon.js",
            "Three.js"
        ],
        "Graphics Programming": [
            "DirectX",
            "Vulkan",
            "Metal",
            "WebGL",
            "OpenGL",
            "GLSL",
            "HLSL",
            "Ray tracing",
            "Shader programming",
            "Particle systems"
        ],
        "Game Design": [
            "Level design",
            "Game mechanics",
            "Game balance",
            "Game economy",
            "Character design",
            "Sound design",
            "UI/UX for games",
            "Game analytics",
            "Multiplayer networking",
            "Physics simulation"
        ]
    },

    "Digital Content Creation": {
        "2D Graphics": [
            "Adobe Photoshop",
            "Adobe Illustrator",
            "Affinity Designer",
            "Affinity Photo",
            "Krita",
            "GIMP",
            "Inkscape",
            "Sketch",
            "CorelDRAW",
            "Vector graphics"
        ],
        "3D Graphics": [
            "Maya",
            "3ds Max",
            "Cinema 4D",
            "ZBrush",
            "Houdini",
            "Substance Painter",
            "Substance Designer",
            "Marvelous Designer",
            "SketchUp",
            "Rhinoceros 3D"
        ],
        "Video & Motion": [
            "Adobe Premiere Pro",
            "Adobe After Effects",
            "DaVinci Resolve",
            "Final Cut Pro",
            "Motion",
            "Nuke",
            "Fusion",
            "Mocha Pro",
            "Avid Media Composer",
            "Animation"
        ]
    },

    "Hardware & Electronics": {
        "Embedded Systems": [
            "Arduino",
            "Raspberry Pi",
            "ESP32",
            "ESP8266",
            "STM32",
            "PIC",
            "AVR",
            "ARM",
            "MIPS",
            "x86",
            "FPGA",
            "ASIC",
            "PCB design",
            "Microelectronics",
            "Embedded programming",
            "Verilog",
            "VHDL",
            "Embedded C",
            "Embedded Rust"
        ],
        "IoT & Wearables": [
            "IoT hardware",
            "Wearable electronics",
            "Flexible electronics"
        ],
        "Electronics": [
            "Analog design",
            "Power systems",
            "Radiation shielding",
            "Digital logic",
            "Soldering",
        ],
        "Communication": [
            "LoRa",
            "Bluetooth",
            "WiFi",
            "UHF",
            "VHF",
            "HF",
            "MF",
            "SHF",
            "EHF",
            "RF design",
            "Radio engineering",
            "Ham radio",
            "Zigbee"
        ]
    },

    "Quantum Technologies": {
        "Quantum Computing": [
            "Quantum algorithms",
            "Quantum error correction",
            "Quantum machine learning",
            "Quantum simulation",
            "Quantum optimization",
            "Quantum chemistry",
            "Quantum communication",
            "Quantum networking",
            "Quantum software development"
        ],
        "Hardware & Tools": [
            "Qiskit",
            "Cirq",
            "Q#",
            "Forest",
            "ProjectQ",
            "OpenQASM",
            "Quantum hardware control",
            "Quantum circuit design",
            "Quantum error mitigation",
            "Quantum validation"
        ]
    },

    "Security": {
        "Cybersecurity": [
            "Cybersecurity",
            "Digital forensics",
            "Ethical hacking",
            "Penetration testing",
            "Data privacy",
            "Cryptography",
            "Quantum cryptography",
            "Steganography",
            "Digital watermarking",
            "Malware analysis",
            "Reverse engineering"
        ]
    },

    "Biotechnology & Life Sciences": {
        "Core Fields": [
            "Bioinformatics",
            "Synthetic biology",
            "Molecular biology",
            "Cell biology",
            "Genomics",
            "Proteomics",
            "CRISPR technology",
            "Gene editing",
            "Biomedical devices",
            "Tissue engineering",
            "Stem cell research",
            "Biophotonics",
            "Biomechanics"
        ]
    },

    "Chemistry & Materials": {
        "Core Chemistry": [
            "Organic chemistry",
            "Inorganic chemistry",
            "Physical chemistry",
            "Analytical chemistry",
            "Biochemistry",
            "Green chemistry"
        ],
        "Materials Science": [
            "Nanotechnology",
            "Metamaterials",
            "Biodegradable materials",
            "Polymers",
            "Ceramics",
            "Superconductors"
        ]
    },

    "Environmental & Energy": {
        "Renewable Energy": [
            "Solar technology",
            "Wind energy",
            "Hydrogen power",
            "Biofuels",
            "Carbon capture and storage",
            "Nuclear fusion"
        ],
        "Environmental Science": [
            "Climate modeling",
            "Environmental biotechnology",
            "Water purification",
            "Air pollution control",
            "Sustainable design"
        ]
    },

    "Robotics & Automation": {
        "Core Robotics": [
            "Robotics",
            "Soft robotics",
            "Swarm robotics",
            "Biorobotics",
            "Industrial automation",
            "Robotic process automation",
            "Human-robot interaction",
            "Autonomous navigation",
            "Autonomous vehicles",
            "Drone technology",
            "Exoskeletons",
            "Biomimicry"
        ]
    },

    "System Architecture": {
        "Core Concepts": [
            "System design",
            "Software architecture",
            "Computer architecture",
            "Server architecture",
            "Microservices",
            "Distributed systems",
            "High-performance computing",
            "Real-time systems",
            "Edge computing",
            "Parallel computing"
        ]
    },

    "Mathematics & Theoretical Computing": {
        "Core Mathematics": [
            "Linear algebra",
            "Calculus",
            "Probability & statistics",
            "Differential equations",
            "Fourier analysis",
            "Graph theory",
            "Combinatorics",
            "Game theory",
            "Information theory",
            "Mathematical optimization",
            "Numerical methods",
            "Chaos theory"
        ],
        "Theoretical Computing": [
            "Quantum computing",
            "Computational complexity",
            "Algorithm design",
            "Turing machines",
            "Formal methods"
        ]
    }
};