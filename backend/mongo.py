from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["problem-dating-app"]
users = db.users

data = [
    {
        "name": "Alice",
        "email": "alice@example.com",
        "linkedIn": "https://linkedin.com/alice",
        "bio": "I love hiking and outdoor activities.",
        "availability": 20,
        "interests": {
            "Mechanical engineering": 4,
            "Electrical engineering": 3,
            "Python": 5,
        },
    },
    {
        "name": "Bob",
        "email": "bob@example.com",
        "linkedIn": "https://linkedin.com/bob",
        "bio": "Avid reader and tech enthusiast.",
        "availability": 30,
        "interests": {
            "Civil engineering": 5,
            "Robotics": 4,
            "JavaScript": 3,
        },
    },
    {
        "name": "Carol",
        "email": "carol@example.com",
        "linkedIn": "https://linkedin.com/carol",
        "bio": "Passionate about AI and machine learning.",
        "availability": 40,
        "interests": {
            "Aerospace engineering": 5,
            "Software engineering": 4,
            "Machine Learning": 5,
        },
    },
    {
        "name": "Dave",
        "email": "dave@example.com",
        "linkedIn": "https://linkedin.com/dave",
        "bio": "Enjoys playing guitar and coding.",
        "availability": 25,
        "interests": {
            "Bioengineering": 3,
            "Computer engineering": 4,
            "C++": 5,
        },
    },
    {
        "name": "Eve",
        "email": "eve@example.com",
        "linkedIn": "https://linkedin.com/eve",
        "bio": "Loves painting and exploring new technologies.",
        "availability": 35,
        "interests": {
            "Chemical engineering": 4,
            "Nanotechnology": 5,
            "React": 3,
        },
    },
    {
        "name": "Frank",
        "email": "frank@example.com",
        "linkedIn": "https://linkedin.com/frank",
        "bio": "A fitness enthusiast and software developer.",
        "availability": 15,
        "interests": {
            "Frontend development": 4,
            "Backend development": 5,
            "Node.js": 4,
        },
    },
    {
        "name": "Grace",
        "email": "grace@example.com",
        "linkedIn": "https://linkedin.com/grace",
        "bio": "Enjoys cooking and learning about cybersecurity.",
        "availability": 20,
        "interests": {
            "Cybersecurity": 5,
            "Network engineering": 4,
            "Python": 5,
        },
    },
    {
        "name": "Hank",
        "email": "hank@example.com",
        "linkedIn": "https://linkedin.com/hank",
        "bio": "Avid traveler and cloud computing expert.",
        "availability": 30,
        "interests": {
            "Cloud computing": 5,
            "DevOps": 4,
            "AWS": 5,
        },
    },
    {
        "name": "Ivy",
        "email": "ivy@example.com",
        "linkedIn": "https://linkedin.com/ivy",
        "bio": "Passionate about game development and design.",
        "availability": 25,
        "interests": {
            "Game development": 5,
            "Unity": 4,
            "C#": 4,
        },
    },
    {
        "name": "Jack",
        "email": "jack@example.com",
        "linkedIn": "https://linkedin.com/jack",
        "bio": "Enjoys reading and working on embedded systems.",
        "availability": 20,
        "interests": {
            "Embedded systems": 5,
            "IoT": 4,
            "C": 5,
        },
    },
    {
        "name": "Karen",
        "email": "karen@example.com",
        "linkedIn": "https://linkedin.com/karen",
        "bio": "Loves teaching and mentoring.",
        "availability": 40,
        "interests": {
            "Education": 5,
            "Public speaking": 4,
            "Python": 5,
        },
    },
    {
        "name": "Leo",
        "email": "leo@example.com",
        "linkedIn": "https://linkedin.com/leo",
        "bio": "Enjoys photography and web development.",
        "availability": 30,
        "interests": {
            "Photography": 5,
            "Web development": 4,
            "JavaScript": 5,
        },
    },
    {
        "name": "Mia",
        "email": "mia@example.com",
        "linkedIn": "https://linkedin.com/mia",
        "bio": "Passionate about data science and analytics.",
        "availability": 35,
        "interests": {
            "Data science": 5,
            "Analytics": 4,
            "R": 3,
        },
    },
    {
        "name": "Nina",
        "email": "nina@example.com",
        "linkedIn": "https://linkedin.com/nina",
        "bio": "Enjoys writing and content creation.",
        "availability": 25,
        "interests": {
            "Writing": 5,
            "Content creation": 4,
            "SEO": 3,
        },
    },
    {
        "name": "Oscar",
        "email": "oscar@example.com",
        "linkedIn": "https://linkedin.com/oscar",
        "bio": "Loves working on open-source projects.",
        "availability": 20,
        "interests": {
            "Open-source": 5,
            "Linux": 4,
            "Python": 5,
        },
    },
    {
        "name": "Paul",
        "email": "paul@example.com",
        "linkedIn": "https://linkedin.com/paul",
        "bio": "Enjoys playing chess and solving puzzles.",
        "availability": 15,
        "interests": {
            "Chess": 5,
            "Puzzles": 4,
            "Java": 3,
        },
    },
]

users.insert_many(data)

print("Data inserted successfully.")

for user in users.find():
    print(user)
