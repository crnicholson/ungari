from pymongo import MongoClient

client = MongoClient("mongodb://root:example@hackclub.app:34209/?authSource=admin")
db = client["problem-dating-app"]
users = db.users

data = [
    {
        "name": "Bob Frank",
        "email": "bob@gmail.com",
        "linkedIn": "https://linkedin.com/",
        "bio": "Snakes are pretty cool.",
        "availability": 10,  # Hours per week.
        "skills": [
            "Mechanical engineering",
            "Electrical engineering",
            "Java",
            "Python",
        ],
        "themes": ["Environment", "Healthcare", "Education"],
        "timeFrame": 6,  # Months.
        "needHelp": False,
        "pastMatches": [],
        "savedMatches": [],
    },
    {
        "name": "Alice Smith",
        "email": "alice@gmail.com",
        "linkedIn": "https://linkedin.com/",
        "bio": "dogs are pretty cool",
        "availability": 10,  # Hours per week.
        "skills": ["Java", "Kotlin", "UI design", "Python"],
        "themes": ["Education"],
        "timeFrame": 7,  # Months.
        "needHelp": True,
        "pastMatches": [],
        "savedMatches": [],
        "projectName": "Gradle",
        "projectDescription": "I am making an app for students to calculate their GPA.",
        "helpNeeded": "I need help with the UI design of the app using Kotlin for Android.",
        "projectLink": "https://github.com/crnicholson/StratoSoar-MK3",
    },
    {
        "name": "Charlie Brown",
        "email": "charlie@gmail.com",
        "linkedIn": "https://linkedin.com/",
        "bio": "I love hiking and outdoor activities.",
        "availability": 15,  # Hours per week.
        "skills": ["C++", "Python", "Data Analysis"],
        "themes": ["Environment", "Technology"],
        "timeFrame": 5,  # Months.
        "needHelp": False,
        "pastMatches": [],
        "savedMatches": [],
    },
    {
        "name": "Diana Prince",
        "email": "diana@gmail.com",
        "linkedIn": "https://linkedin.com/",
        "bio": "Passionate about AI and machine learning.",
        "availability": 20,  # Hours per week.
        "skills": ["Machine Learning", "Python", "TensorFlow"],
        "themes": ["Healthcare", "Technology"],
        "timeFrame": 8,  # Months.
        "needHelp": True,
        "pastMatches": [],
        "savedMatches": [],
        "projectName": "HealthAI",
        "projectDescription": "Developing an AI model to predict health issues.",
        "helpNeeded": "Looking for experts in TensorFlow and data preprocessing.",
        "projectLink": "https://github.com/dianaprince/HealthAI",
    },
    {
        "name": "Eve Adams",
        "email": "eve@gmail.com",
        "linkedIn": "https://linkedin.com/",
        "bio": "Enjoys painting and exploring new technologies.",
        "availability": 12,  # Hours per week.
        "skills": ["JavaScript", "React", "Node.js"],
        "themes": ["Education", "Technology"],
        "timeFrame": 4,  # Months.
        "needHelp": False,
        "pastMatches": [],
        "savedMatches": [],
    },
    {
        "name": "Frank Castle",
        "email": "frank@gmail.com",
        "linkedIn": "https://linkedin.com/",
        "bio": "A fitness enthusiast and software developer.",
        "availability": 18,  # Hours per week.
        "skills": ["Java", "Spring Boot", "Microservices"],
        "themes": ["Healthcare", "Technology"],
        "timeFrame": 6,  # Months.
        "needHelp": True,
        "pastMatches": [],
        "savedMatches": [],
        "projectName": "FitTrack",
        "projectDescription": "Building a fitness tracking app.",
        "helpNeeded": "Need assistance with backend development using Spring Boot.",
        "projectLink": "https://github.com/frankcastle/FitTrack",
    },
    {
        "name": "Grace Hopper",
        "email": "grace@gmail.com",
        "linkedIn": "https://linkedin.com/",
        "bio": "Enjoys cooking and learning about cybersecurity.",
        "availability": 10,  # Hours per week.
        "skills": ["Cybersecurity", "Python", "Networking"],
        "themes": ["Technology", "Education"],
        "timeFrame": 3,  # Months.
        "needHelp": False,
        "pastMatches": [],
        "savedMatches": [],
    },
    {
        "name": "Hank Pym",
        "email": "hank@gmail.com",
        "linkedIn": "https://linkedin.com/",
        "bio": "Avid traveler and cloud computing expert.",
        "availability": 25,  # Hours per week.
        "skills": ["AWS", "Docker", "Kubernetes"],
        "themes": ["Technology", "Environment"],
        "timeFrame": 9,  # Months.
        "needHelp": True,
        "pastMatches": [],
        "savedMatches": [],
        "projectName": "EcoCloud",
        "projectDescription": "Creating a cloud platform for environmental data analysis.",
        "helpNeeded": "Looking for cloud engineers with experience in AWS and Kubernetes.",
        "projectLink": "https://github.com/hankpym/EcoCloud",
    },
]

users.insert_many(data)

print("Data inserted successfully.")

for user in users.find():
    print(user)
