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

    common_interest_users = []
    for person in all_users:
        if person["id"] == user_id:
            continue

        common_interests = set(user["interests"]).intersection(
            set(person.get("interests", []))
        )
        if common_interests:
            common_interest_users.append(
                {"id": person["id"], "common_interests": list(common_interests)}
            )

    print(common_interest_users)

    common_interest_users = {
        "name": "Sam",
        "email": "sam@gmail.com",
        "linkedIn": "https://linkedin.com/",
        "bio": "sams are pretty cool",
        "availability": 5000,
        "interests": {
            "Bean engineering": 5,
            "Electrical engineering": 4,
            "Espresso": 3,
        },
    }

    return jsonify({"matches": common_interest_users})


if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You are successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    app.run(debug=True, port=FLASK_PORT)
