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
    print(id)

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


if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You are successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    app.run(debug=True, port=FLASK_PORT)
