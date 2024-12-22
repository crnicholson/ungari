"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import Link from "next/link";

const SERVER = "http://127.0.0.1:5000";

export default function Settings() {
  const [isScrolled, setIsScrolled] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState({});

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
          const data = await response.json();
          setName(data.name || "");
          setEmail(data.email || "");
          setLinkedIn(data.linkedIn || "");
          setBio(data.bio || "");
          setAvailability(data.availability || "");
          setSelectedInterests(data.interests || {});
        } catch (error) {
          console.error("Failed to fetch settings:", error);
        }
      };

      fetchSettings();
    }
  }, [isLoading, user]);

  const saveSettings = async () => {
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
          linkedIn: linkedIn,
          bio: bio,
          availability: availability,
          interests: selectedInterests,
        }),
      });
      // const data = await response.json();
    } catch (error) {
      console.error("Failed to set user information:", error);
    }
  };

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
              <label className="block mb-2">LinkedIn:</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="To help with credibility"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">
                Availability (hours per week):
              </label>
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
                rows={3}
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
                    {interest}: <strong>Level {level as number}</strong>
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
