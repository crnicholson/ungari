from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

FLASK_PORT = 5000
MONGO_ADDRESS = "mongodb://localhost:27017/"

client = MongoClient(MONGO_ADDRESS)
db = client["problem-dating-app"]
users = db.users

app = Flask(__name__)
CORS(app)


@app.route("/api/get-settings", methods=["POST"])
def get_settings():
    received = request.get_json()
    id = received["id"]

    user = users.find_one({"id": id})

    if user is None:
        users.insert_one({"id": id})
        return jsonify({"": ""}), 404

    return (
        jsonify(
            # {
            #     "name": "Charlie",
            #     "email": "charlienicholsonr@gmail.com",
            #     "linkedIn": "https://linkedin.com/",
            #     "bio": "cats are pretty cool",
            #     "availability": 50,
            #     "interests": {
            #         "Mechanical engineering": 5,
            #         "Electrical engineering": 4,
            #         "Java": 3,
            #     },
            # }
            {
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "linkedIn": user.get("linkedIn", ""),
                "skillsCheck": user.get("skillsCheck", ""),
                "bio": user.get("bio", ""),
                "availability": user.get("availability", ""),
                "interests": user.get("interests", {}),
            }
        ),
        200,
    )


@app.route("/api/set-settings", methods=["POST"])
def set_settings():
    received = request.get_json()
    id = received["id"]
    name = received["name"]
    email = received["email"]
    linkedIn = received["linkedIn"]
    skillsCheck = received["skillsCheck"]
    bio = received["bio"]
    availability = received["availability"]
    interests = received["interests"]

    print(
        "ID: ",
        id,
        " Name: ",
        name,
        " Email: ",
        email,
        " LinkedIn: ",
        linkedIn,
        " Skills Check: ",
        skillsCheck,
        " Bio: ",
        bio,
        " Availability: ",
        availability,
        " Interests: ",
        interests,
    )

    user = users.find_one({"id": id})

    if user is None:
        users.insert_one({"id": id})
        return jsonify({"error": "User not found in database."}), 404

    users.update_one(
        {"id": id},
        {
            "$set": {
                "name": name,
                "email": email,
                "linkedIn": linkedIn,
                "skillsCheck": skillsCheck,
                "bio": bio,
                "availability": availability,
                "interests": interests,
            }
        },
    )

    return jsonify({"": ""}), 200


@app.route("/api/get-match", methods=["POST"])
def get_match():
    received = request.get_json()
    user_id = received["id"]

    user = users.find_one({"id": user_id})

    if user is None:
        users.insert_one({"id": user_id, "interests": []})
        return jsonify({"error": "Please fill in settings."})

    all_users = users.find()

    potential_matches = []

    for person in all_users:
        if person["name"] == received["name"]:
            continue

        common_interests = set(user["interests"]).intersection(
            set(person.get("interests", []))
        )

        if common_interests:
            score = 0
            for interest in common_interests:
                user_skill = user["interests"].get(interest, 0)
                person_skill = person["interests"].get(interest, 0)
                score += min(user_skill, person_skill)

            potential_matches.append(
                {
                    "name": person["name"],
                    "email": person["email"],
                    "linkedIn": person["linkedIn"],
                    "bio": person["bio"],
                    "availability": person["availability"],
                    "common_interests": list(common_interests),
                    "score": score,
                }
            )

    potential_matches.sort(key=lambda x: x["score"], reverse=True)

    if not potential_matches:
        return jsonify({"matches": []})

    return jsonify({"matches": potential_matches})


if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You are successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    app.run(debug=True, port=FLASK_PORT)
