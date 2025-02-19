"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Header, HeaderLogo, HeaderNav } from "../../components/header";
import GradientButton from "../../components/button";
import { Card, CardContainer, CardTitle, CardInput, CardSubtitle, CardRow, CardBlock, CardButton } from "../../components/card";
import Heading from "../../components/heading";
import StyledLink from "../../components/styledLink";
import Error from "../../components/error";
import Warning from "../../components/warning";
import { set } from "@auth0/nextjs-auth0/dist/session";
import Image from 'next/image';
import Checkbox from "../../components/checkbox";

const SERVER = "http://127.0.0.1:38321";
// const SERVER = "https://problem-dating-app.cnicholson.hackclub.app"

export default function Settings() {
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
  const [timeFrame, setTimeFrame] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [tempImageLink, setTempImageLink] = useState("");
  const [imageChange, setImageChange] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  // const [errorPresent, setErrorPresent] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [themeSearchTerm, setThemeSearchTerm] = useState("");
  const [imageDialog, setImageDialog] = useState(false);
  const [imageError, setImageError] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/api/auth/login");
    }
  }, [isLoading, user]);

  // useEffect(() => {
  //   if (errorMessage !== "") {
  //     const timer = setTimeout(() => {
  //       setErrorMessage("");
  //     }, 5000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [errorMessage]);

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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

  const filteredSkills = listOfSkills
    .filter((skill) =>
      skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b));

  const filteredThemes = listOfThemes
    .filter((theme) =>
      theme.toLowerCase().includes(themeSearchTerm.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b));


  function isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  useEffect(() => {
    if (!isLoading && user) {
      const fetchSettings = async () => {
        try {
          const response = await fetch(SERVER + "/api/get-settings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: user.sub }),
          });
          if (!response.ok) {
            const error = await response.json();
            setErrorMessage("Server-side error: " + error.error);
            // setErrorPresent(true);
          } else {
            const data = await response.json();
            setName(data.name || "");
            setEmail(data.email || "");
            setNeedHelp(data.needHelp || false);
            setLinkedIn(data.linkedIn || "");
            setBio(data.bio || "");
            setAvailability(data.availability || "");
            setSkills(data.skills || []);
            setThemes(data.themes || []);
            setProjectName(data.projectName || "");
            setProjectDescription(data.projectDescription || "");
            setHelpDescription(data.helpDescription || "");
            setProjectLink(data.projectLink || "");
            setTimeFrame(data.timeFrame || "");

            if (data.imageLink === "" || user.picture === "") {
              setImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + data.name);
              setTempImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + data.name);
              setImageChange(true);
            }
            if (data.imageChange && isValidURL(data.imageLink)) {
              setImageLink(data.imageLink || "");
              setTempImageLink(data.imageLink || "");
            } else if (isValidURL(user.picture)) {
              setImageLink(user.picture || "");
              setTempImageLink(user.picture || "");
              setImageChange(false);
            } else {
              setImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + data.name.replace(" ", "+"));
              setTempImageLink("https://ui-avatars.com/api/?size=256&background=random&name=" + data.name.replace(" ", "+"));
              setImageChange(true);
            }

            if (data.name === "" || data.email === "" || data.linkedIn === "" || data.bio === "" || data.availability === "" || data.skills.length === 0 || data.themes.length === 0 || data.timeFrame === "" || (data.needHelp && (data.projectName === "" || data.projectDescription === "" || data.helpDescription === "" || data.projectLink === ""))) {
              setWarningMessage("Psst... you may have been redirected here because one or more of your settings were missing. Please fill them out below!");
            }
          }
        } catch (error) {
          console.error("Failed to fetch settings:", error);
          setErrorMessage("Client-side error: " + error);
          // setErrorPresent(true);
        }
      };

      fetchSettings();
    }
  }, [isLoading, user, imageLink]);

  const saveSettings = async () => {
    const missingFields = [];

    const formatMissingFieldsMessage = (fields) => {
      if (fields.length === 1) {
        return fields[0];
      } else if (fields.length === 2) {
        return `${fields[0]} and ${fields[1]}`;
      } else {
        return `${fields.slice(0, -1).join(", ")}, and ${fields[fields.length - 1]}`;
      }
    };

    if (bio === "") missingFields.push("bio");
    if (email === "") missingFields.push("email");
    if (name === "") missingFields.push("name");
    if (availability === "") missingFields.push("availability");
    if (skills.length === 0) missingFields.push("skills");
    if (themes.length === 0) missingFields.push("themes");
    if (linkedIn === "") missingFields.push("LinkedIn");
    if (timeFrame === "") missingFields.push("time frame");

    if (needHelp) {
      if (projectName === "") missingFields.push("project name");
      if (projectDescription === "") missingFields.push("project description");
      if (helpDescription === "") missingFields.push("help description");
      if (projectLink === "") missingFields.push("project link");
    }

    if (missingFields.length > 0) {
      console.log("Some required fields are missing.");
      setSubmitMessage(`Uh-oh! The following fields are missing: ${formatMissingFieldsMessage(missingFields)}.`);
      return;
    } else if (!isValidEmail(email)) {
      console.log("Email address is invalid.");

      setSubmitMessage("Oh shoot! That email address seems invalid.");

      return;
    } else if (!linkedIn.includes("linkedin.com") || !isValidURL(linkedIn)) {
      console.log("LinkedIn link is invalid.");

      setSubmitMessage("Oh snap! That LinkedIn link seems invalid. Did you remember that https://? :-P");

      return;
    }

    try {
      const response = await fetch(SERVER + "/api/set-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.sub,
          name: name,
          email: email,
          needHelp: needHelp,
          linkedIn: linkedIn,
          bio: bio,
          availability: availability,
          skills: skills,
          themes: themes,
          projectName: projectName,
          projectDescription: projectDescription,
          projectLink: projectLink,
          helpDescription: helpDescription,
          timeFrame: timeFrame,
          imageLink: imageLink,
          imageChange: imageChange,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        setErrorMessage("Server-side error: " + error.error);
        // setErrorPresent(true);
      }

      setSubmitMessage("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to set user information: ", error);
      setErrorMessage("Client-side error: " + error);
      // setErrorPresent(true);
    }
  };

  return (
    <>
      <Header>
        <HeaderLogo href="/">
          <span className="text-[--accent] text-xl font-bold">⁂</span> Ungari
        </HeaderLogo>
        <HeaderNav>
          <GradientButton className="m-3" href="/api/auth/logout">Logout</GradientButton>
        </HeaderNav>
      </Header>

      {errorMessage !== "" && (
        <Error className="sm:w-1/2 w-full mt-24">{errorMessage}</Error>
      )}

      {warningMessage !== "" && (
        <Warning className={`sm:w-1/2 w-full ${errorMessage !== "" ? 'mt-5' : 'mt-24'}`}>{warningMessage}</Warning>
      )}

      <CardContainer className={`${(errorMessage !== "" || warningMessage !== "") ? 'mt-5' : 'mt-24'}`}>
        <Card className="w-full">
          <CardTitle size={2}>Basic info</CardTitle>
          <StyledLink
            href="/match"
            className="italic text-base mb-5 block"
          >
            Back to match
          </StyledLink>

          {isLoading && !user ? (
            <p>Loading...</p>
          ) : errorMessage !== "" ? (
            <p>We{"'"}re down right now, try reloading!</p>
          ) : (
            <>
              {(name !== "" || !imageChange) && (
                <CardBlock>
                  <button onClick={() => setImageDialog(!imageDialog)}>
                    {imageLink !== "" ? (
                      <Image
                        src={imageLink}
                        alt={`${name}'s profile`}
                        className="rounded-full object-cover ring-2 ring-[--border]"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <div
                        className="rounded-full flex items-center justify-center ring-2 ring-[--border]"
                        style={{
                          width: 96,
                          height: 96,
                          backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                        }}
                      >
                        <span className="text-white text-3xl">{name.charAt(0)}</span>
                      </div>
                    )}
                  </button>
                </CardBlock>
              )}

              {imageDialog && (
                <CardBlock>
                  <CardSubtitle className="mb-2">Enter a new image link</CardSubtitle>
                  <CardRow className="flex-col sm:flex-row">
                    <CardInput
                      value={tempImageLink}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempImageLink(e.target.value)}
                      placeholder="Make it blank to use the default image!"
                      className="w-full"
                    />
                    <CardButton
                      onClick={() => {
                        if (isValidURL(tempImageLink) || tempImageLink !== "") {
                          setImageLink(tempImageLink);
                          setImageChange(true);
                          setImageError("");
                        } else {
                          setImageError("Invalid URL!");
                        }
                      }}
                    >
                      Update image
                    </CardButton>
                  </CardRow>
                  {imageError !== "" && (
                    <p className="mt-2">{imageError}</p>
                  )}
                </CardBlock>
              )}

              <CardBlock>
                <CardSubtitle className="mb-2">What{"'"}s your name?</CardSubtitle>
                <CardInput
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">Tell us about yourself! (50 chars)</CardSubtitle>
                <textarea
                  className="w-full p-3 border border-stone-200 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent]"
                  placeholder="Special notes, preferences, favorite color? Max 50 characters."
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={50}
                ></textarea>
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">Email</CardSubtitle>
                <CardInput
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="We'll shoot you an email if we find a match"
                />
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">LinkedIn</CardSubtitle>
                <CardInput
                  value={linkedIn}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkedIn(e.target.value)}
                  placeholder="To help with credibility"
                />
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">Availability (hours per week)</CardSubtitle>
                <CardInput
                  type="number"
                  value={availability}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvailability(e.target.value)}
                  placeholder="How many hours per week are you available?"
                />
              </CardBlock>

              <CardTitle size={2} className="mt-5 mb-3">Matching magic</CardTitle>

              <CardBlock>
                <CardSubtitle className="mb-2">
                  Do you want to help, or do you need help?
                </CardSubtitle>
                <div className="flex flex-col gap-2">
                  <Checkbox
                    onChange={() => setNeedHelp(false)}
                    checked={!needHelp}
                  >
                    I want to help
                  </Checkbox>

                  <Checkbox
                    onChange={() => setNeedHelp(true)}
                    checked={needHelp}
                  >
                    I need help
                  </Checkbox>
                </div>
              </CardBlock>

              {needHelp && (
                <>
                  <CardBlock>
                    <CardSubtitle className="mb-2">What{"'"}s your project called?</CardSubtitle>
                    <CardInput
                      value={projectName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                      placeholder="Automatic cereal feeder to save the rhinos"
                    />
                  </CardBlock>

                  <CardBlock>
                    <CardSubtitle className="mb-2">Tell us about your project! (100 chars)</CardSubtitle>
                    <textarea
                      className="w-full p-3 border border-stone-200 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent]"
                      placeholder="What's it do? Why's it cool? Max 100 characters."
                      rows={3}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      maxLength={100}
                    ></textarea>
                  </CardBlock>

                  <CardBlock>
                    <CardSubtitle className="mb-2">Anything specific you need help on? (100 chars)</CardSubtitle>
                    <textarea
                      className="w-full p-3 border border-stone-200 rounded-xl hover:ring-2 hover:ring-[--accent] hover:outline-none focus:outline-none focus:ring-2 focus:ring-[--accent]"
                      placeholder="I need to make sure the electric boogaloo can attract rhinos. Max 100 characters."
                      rows={3}
                      value={helpDescription}
                      onChange={(e) => setHelpDescription(e.target.value)}
                      maxLength={100}
                    ></textarea>
                  </CardBlock>

                  <CardBlock>
                    <CardSubtitle className="mb-2">Project link</CardSubtitle>
                    <CardInput
                      value={projectLink}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectLink(e.target.value)}
                      placeholder="Like github.com/crnicholson/StratoSoar-MK3"
                    />
                  </CardBlock>
                </>
              )}

              <CardBlock>
                <CardSubtitle className="mb-2">How many months do you {needHelp ? "anticipate the project taking" : "want to work for"}?</CardSubtitle>
                <CardInput
                  type="number"
                  value={timeFrame}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimeFrame(e.target.value)}
                  placeholder="Put 0 for no answer/not necessary"
                />
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">Skills {needHelp ? "I'm looking for" : "I have"}</CardSubtitle>

                {skills.length > 0 && (
                  <p className="mb-2">Current skills include: {skills.join(", ")}</p>
                )}

                <CardBlock>
                  <CardInput
                    type="text"
                    value={skillSearchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkillSearchTerm(e.target.value)}
                    placeholder="Search skills..."
                  />
                </CardBlock>

                <div className="overflow-y-auto border p-3 rounded-xl max-h-60">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="flex justify-between items-center p-2 hover:bg-gray-200 rounded"
                      >
                        <Checkbox
                          onChange={() => handleSelectSkill(skill)}
                          checked={skills.includes(skill)}
                        >
                          {skill}
                        </Checkbox>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Oh snap! No skills found.</p>
                  )}
                </div>
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">{!needHelp ? "Preferred project themes" : "Themes of your project"}</CardSubtitle>

                {themes.length > 0 && (
                  <p className="mb-2">Current themes include: {themes.join(", ")}</p>
                )}

                <CardBlock>
                  <CardInput
                    type="text"
                    value={themeSearchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThemeSearchTerm(e.target.value)}
                    placeholder="Search themes..."
                  />
                </CardBlock>

                <div className="overflow-y-auto border p-3 rounded-xl max-h-60">
                  {filteredThemes.length > 0 ? (
                    filteredThemes.map((theme) => (
                      <div
                        key={theme}
                        className="flex justify-between items-center p-2 hover:bg-gray-200 rounded"
                      >
                        <Checkbox
                          checked={themes.includes(theme)}
                          onChange={() => handleSelectTheme(theme)}
                        >
                          {theme}
                        </Checkbox>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Oh snap! No themes found.</p>
                  )}
                </div>
              </CardBlock>

              <CardButton onClick={saveSettings}>Save settings</CardButton>

              {submitMessage !== "" && (
                <p className="mt-4">{submitMessage}</p>
              )}
            </>
          )}
        </Card>
      </CardContainer >
    </>
  );
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

const listOfSkills = [
  "Mechanical engineering",
  "Electrical engineering",
  "Civil engineering",
  "Aerospace engineering",
  "Robotics",
  "Software engineering",
  "Mechatronics",
  "Materials science",
  "Bioengineering",
  "Computer engineering",
  "Bioinformatics",
  "Chemical engineering",
  "Nanotechnology",
  "Frontend development",
  "Backend development",
  "Fullstack development",
  "Mobile development",
  "Embedded systems",
  "Machine learning",
  "Artificial intelligence",
  "Data science",
  "Cybersecurity",
  "Network engineering",
  "Cloud computing",
  "Embedded programming",
  "Game development",
  "Quantum computing",
  "Autonomous vehicles",
  "Space exploration",
  "Environmental engineering",
  "Renewable energy",
  "Sustainable design",
  "Control systems",
  "Digital signal processing",
  "Additive manufacturing",
  "Augmented reality",
  "Virtual reality",
  "Blockchain technology",
  "Digital twins",
  "Smart cities",
  "Human-computer interaction",
  "Edge computing",
  "Internet of things",
  "Computer vision",
  "Natural language processing",
  "Microelectronics",
  "Optoelectronics",
  "Thermal engineering",
  "Hydraulic systems",
  "Structural engineering",
  "Geotechnical engineering",
  "Transportation engineering",
  "Biomechanics",
  "Pharmaceutical engineering",
  "Process engineering",
  "Energy storage systems",
  "Battery technology",
  "Fuel cells",
  "Hydrogen power",
  "Solar technology",
  "Wind energy",
  "Artificial neural networks",
  "Evolutionary algorithms",
  "Fuzzy logic systems",
  "Augmentative robotics",
  "Soft robotics",
  "Swarm robotics",
  "Human-robot interaction",
  "Autonomous navigation",
  "Aerodynamics",
  "Flight dynamics",
  "Orbital mechanics",
  "Propulsion systems",
  "Spacecraft design",
  "Astrodynamics",
  "Planetary science",
  "Satellite technology",
  "Ground control systems",
  "Sensor networks",
  "Wearable technology",
  "Biometric systems",
  "Digital forensics",
  "Ethical hacking",
  "Penetration testing",
  "Data privacy",
  "Data visualization",
  "Big data analytics",
  "Predictive modeling",
  "Reinforcement learning",
  "Computer graphics",
  "Procedural generation",
  "Audio engineering",
  "Virtual production",
  "Film technology",
  "Interactive storytelling",
  "Educational technology",
  "Digital art",
  "Creative coding",
  "Renewable resources",
  "Ocean engineering",
  "Marine robotics",
  "Aquaculture systems",
  "Deep learning",
  "Genetic programming",
  "Advanced manufacturing",
  "3D printing",
  "Rapid prototyping",
  "Quality assurance",
  "Automotive systems",
  "Aviation safety",
  "Turbomachinery",
  "Structural dynamics",
  "Bioinstrumentation",
  "Clinical engineering",
  "Medical imaging",
  "Telemedicine",
  "Health informatics",
  "Biorobotics",
  "Neural engineering",
  "Synthetic biology",
  "Agricultural technology",
  "Precision farming",
  "Food technology",
  "Packaging science",
  "Recycling technology",
  "Waste management",
  "Water resources",
  "Irrigation systems",
  "Flood management",
  "Erosion control",
  "Seismic engineering",
  "Fire protection engineering",
  "Acoustics",
  "Vibration analysis",
  "Plasma physics",
  "Photonics",
  "Quantum mechanics",
  "Quantum cryptography",
  "Nanophotonics",
  "Metamaterials",
  "Spintronics",
  "Magnetics",
  "Thermoelectric materials",
  "High-performance computing",
  "Parallel processing",
  "Distributed systems",
  "Computer architecture",
  "Compiler design",
  "Operating systems",
  "Virtualization",
  "Serverless computing",
  "DevOps",
  "Site reliability engineering",
  "Continuous integration",
  "Continuous deployment",
  "API design",
  "Microservices",
  "Containerization",
  "Kubernetes",
  "Cloud-native applications",
  "Server architecture",
  "Robust system design",
  "Real-time systems",
  "Low-latency systems",
  "High-availability systems",
  "Fault-tolerant design",
  "Chaos engineering",
  "Scalability",
  "Performance optimization",
  "Memory management",
  "Concurrency",
  "Parallelism",
  "Threading",
  "Asynchronous programming",
  "Functional programming",
  "Object-oriented programming",
  "Procedural programming",
  "Logic programming",
  "Game AI",
  "Physics engines",
  "Shader programming",
  "Augmented storytelling",
  "Creative machine learning",
  "Generative design",
  "Music technology",
  "Speech recognition",
  "Language translation",
  "Sentiment analysis",
  "Social network analysis",
  "Knowledge graphs",
  "Graph databases",
  "Information retrieval",
  "Search engine optimization",
  "Web scraping",
  "Data engineering",
  "Data pipelines",
  "ETL processes",
  "Data governance",
  "Data lineage",
  "Master data management",
  "Business intelligence",
  "Decision support systems",
  "Robotic process automation",
  "Industrial automation",
  "Supply chain optimization",
  "Logistics management",
  "Resource allocation",
  "Scheduling algorithms",
  "Inventory control",
  "Operations research",
  "Financial engineering",
  "Risk management",
  "Portfolio optimization",
  "Algorithmic trading",
  "Cryptography",
  "Steganography",
  "Digital watermarking",
  "Privacy-preserving computation",
  "Federated learning",
  "Differential privacy",
  "Secure multiparty computation",
  "Homomorphic encryption",
  "Organic chemistry",
  "Inorganic chemistry",
  "Physical chemistry",
  "Analytical chemistry",
  "Biochemistry",
  "Molecular biology",
  "Cell biology",
  "Genomics",
  "Proteomics",
  "Metabolomics",
  "Synthetic chemistry",
  "Pharmacology",
  "Toxicology",
  "Immunology",
  "Microbiology",
  "Virology",
  "Epidemiology",
  "Neuroscience",
  "Stem cell research",
  "Regenerative medicine",
  "Biomedical devices",
  "Drug delivery systems",
  "Vaccine development",
  "Cancer research",
  "Clinical trials",
  "Diagnostics",
  "Pathology",
  "Forensic science",
  "Human genetics",
  "Biophysical chemistry",
  "Enzymology",
  "Nanomedicine",
  "Biosensors",
  "Tissue engineering",
  "Bioinformatics pipelines",
  "CRISPR technology",
  "Gene editing",
  "Epigenetics",
  "Metabolic engineering",
  "Protein folding",
  "Structural biology",
  "Quantum biology",
  "Photobiology",
  "Ecotoxicology",
  "Marine biology",
  "Plant science",
  "Agrochemistry",
  "Food chemistry",
  "Flavor chemistry",
  "Cosmetic chemistry",
  "Industrial microbiology",
  "Biofuels",
  "Biodegradable materials",
  "Environmental toxicology",
  "Water purification",
  "Air pollution control",
  "Green chemistry",
  "Life cycle analysis",
  "Waste-to-energy conversion",
  "Carbon capture and storage",
  "Climate modeling",
  "Environmental biotechnology",
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
  "Node.js",
  "Express",
  "Socket.io",
  "GraphQL",
  "Prisma",
  "Hasura",
  "REST APIs",
  "JSON APIs",
  "WebSockets",
  "Serverless",
  "AWS Lambda",
  "Google Cloud Functions",
  "Azure Functions",
  "Firebase",
  "Netlify Functions",
  "Vercel Functions",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "MariaDB",
  "Redis",
  "Memcached",
  "Elasticsearch",
  "Solr",
  "Cassandra",
  "Couchbase",
  "DynamoDB",
  "Firestore",
  "FaunaDB",
  "Supabase",
  "Flask",
  "Django",
  "FastAPI",
  "C language",
  "Assembly",
  "Shell scripting",
  "PowerShell",
  "Bash",
  "Zsh",
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
  "WebAssembly",
  "OpenGL",
  "Wolfram Language",
  "MATLAB",
  "CAD",
  "System design",
  "Software architecture",
  "VHDL",
  "Verilog",
  "FPGA",
  "ASIC",
  "SolidWorks",
  "AutoCAD",
  "Blender",
  "Unity",
  "Fusion 360",
  "KiCad",
  "Eagle",
  "Altium Designer",
  "OrCAD",
  "LTspice",
  "LabVIEW",
  "Simulink",
  "Ansys",
  "PCB design",
  "Graphic design",
  "UI/UX design",
  "Product design",
  "Industrial design",
  "Figma",
  "Adobe Creative Suite",
];
