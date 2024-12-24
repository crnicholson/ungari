"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Header, HeaderLogo, HeaderNav } from "../../components/header";
import GradientButton from "../../components/gradientButton";
import { Card, CardContainer, CardTitle, CardInput, CardContent, CardImage, CardSubtitle, CardBlock, CardButton } from "../../components/card";
import Heading from "../../components/heading";
import StyledLink from "../../components/styledLink";
import Error from "../../components/error";

const SERVER = "http://127.0.0.1:5000";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [skillsCheck, setSkillsCheck] = useState(false);
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/api/auth/login");
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (errorMessage !== "") {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSelectInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev[interest]) {
        const { [interest]: _, ...rest } = prev as { [key: string]: number };
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

  const filteredInterests = interests
    .filter((interest) =>
      interest.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b));

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
          } else {
            const data = await response.json();
            setName(data.name || "");
            setEmail(data.email || "");
            setSkillsCheck(data.skillsCheck || false);
            setLinkedIn(data.linkedIn || "");
            setBio(data.bio || "");
            setAvailability(data.availability || "");
            setSelectedInterests(data.interests || {});
          }
        } catch (error) {
          console.error("Failed to fetch settings:", error);
          setErrorMessage("Client-side error: " + error);
        }
      };

      fetchSettings();
    }
  }, [isLoading, user]);

  const saveSettings = async () => {
    console.log(name);
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
          skillsCheck: skillsCheck,
          linkedIn: linkedIn,
          bio: bio,
          availability: availability,
          interests: selectedInterests,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        setErrorMessage("Server-side error: " + error.error);
      }
    } catch (error) {
      console.error("Failed to set user information: ", error);
      setErrorMessage("Client-side error: " + error);
    }
  };

  return (
    <>
      <Header>
        <HeaderLogo href="/">
          Acme
        </HeaderLogo>
        <HeaderNav>
          <GradientButton href="/api/auth/logout">Logout</GradientButton>
        </HeaderNav>
      </Header>

      <Error className="mt-24 w-1/2">{errorMessage}</Error>

      <CardContainer className={`${errorMessage == "" ? 'mt-24' : 'mt-5'}`}>
        <Card className="w-full">
          <CardTitle size={2}>Settings</CardTitle>
          <StyledLink
            href="/match"
            className="italic text-base mb-5 block"
          >
            Back to match
          </StyledLink>

          {isLoading && !user ? (
            <p>Loading...</p>
          ) : (
            <>
              <CardBlock>
                <CardSubtitle className="mb-2">Name:</CardSubtitle>
                <CardInput
                  inputValue={name}
                  inputOnChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  inputPlaceholder="Enter your full name"
                />
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">Email:</CardSubtitle>
                <CardInput
                  inputValue={email}
                  inputOnChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  inputPlaceholder="We'll shoot you an email if we find a match"
                />
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">LinkedIn:</CardSubtitle>
                <CardInput
                  inputValue={linkedIn}
                  inputOnChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkedIn(e.target.value)}
                  inputPlaceholder="To help with credibility"
                />
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">
                  Are you looking for someone with these skills or do you have these skills?
                </CardSubtitle>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!skillsCheck}
                      onChange={() => setSkillsCheck(false)}
                    />
                    I have these skills
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={skillsCheck}
                      onChange={() => setSkillsCheck(true)}
                    />
                    Looking for these skills
                  </label>
                </div>
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">Availability (hours per week):</CardSubtitle>
                <CardInput
                  inputValue={availability}
                  inputOnChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvailability(e.target.value)}
                  inputPlaceholder="How many hours per week are you available?"
                />
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">About you:</CardSubtitle>
                <textarea
                  className="w-full p-3 border border-stone-200 rounded-xl"
                  placeholder="Tell us about yourself, and some past projects you've worked on"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </CardBlock>

              <CardBlock>
                <CardSubtitle className="mb-2">Skills and confidence levels:</CardSubtitle>
                <input
                  type="text"
                  placeholder="Search interests..."
                  className="w-full p-3 border border-stone-200 rounded-xl mb-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="overflow-y-auto border p-3 rounded-xl max-h-60">
                  {filteredInterests.map((interest) => (
                    <div
                      key={interest}
                      className="flex justify-between items-center p-2 hover:bg-gray-200 rounded"
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
              </CardBlock>

              <CardButton onClick={saveSettings}>Save settings</CardButton>
            </>
          )}
        </Card>
      </CardContainer>

      <div className="mt-5 w-full">
        {Object.keys(selectedInterests).length > 0 && (
          <div className="mt-5">
            <Heading size={2}>
              Selected interests and skill levels:
            </Heading>
            <ul className="list-disc ml-5">
              {Object.entries(selectedInterests).map(([interest, level]) => (
                <li key={interest} className="mb-1">
                  <strong>{interest}</strong> at a level of <strong>{level as number}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

const interests = [
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
