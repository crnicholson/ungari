from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import json
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=f"{os.getcwd()}/.env.local")

FLASK_PORT = 38321
# MONGO_ADDRESS = os.getenv("MONGO_ADDRESS")
MONGO_ADDRESS = "mongodb://localhost:27017"

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
        # return jsonify({"": ""}), 404

    return (
        jsonify(
            {
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "linkedIn": user.get("linkedIn", ""),
                "needHelp": user.get("needHelp"),
                "projectName": user.get("projectName", ""),
                "projectDescription": user.get("projectDescription", ""),
                "helpDescription": user.get("helpDescription", ""),
                "projectLink": user.get("projectLink", ""),
                "bio": user.get("bio", ""),
                "availability": user.get("availability", ""),
                "skills": user.get("skills", []),
                "themes": user.get("themes", []),
                "timeFrame": user.get("timeFrame", ""),
                "imageLink": user.get("imageLink", ""),
                "imageChange": user.get("imageChange", False),
            }
        ),
        200,
    )


@app.route("/api/set-settings", methods=["POST"])
def set_settings():
    received = request.get_json()
    id = received.get("id", "")
    name = received.get("name", "")
    email = received.get("email", "")
    linkedIn = received.get("linkedIn", "")
    bio = received.get("bio", "")
    availability = received.get("availability", "")
    skills = received.get("skills", [])
    themes = received.get("themes", [])
    timeFrame = received.get("timeFrame", "")
    needHelp = received.get("needHelp", "")
    imageLink = received.get("imageLink", "")
    imageChange = received.get("imageChange", False)

    user = users.find_one({"id": id})

    if user is None:
        users.insert_one({"id": id})
        return jsonify({"error": "User not found in database."}), 404

    update_fields = {
        "name": name,
        "email": email,
        "linkedIn": linkedIn,
        "needHelp": needHelp,
        "bio": bio,
        "availability": availability,
        "skills": skills,
        "themes": themes,
        "timeFrame": timeFrame,
        "imageLink": imageLink,
        "imageChange": imageChange,
    }

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
        " Need help: ",
        needHelp,
        " Availability (hours per week): ",
        availability,
        " Time frame (months): ",
        timeFrame,
        " Skills: ",
        skills,
        " Themes: ",
        themes,
        " Image Change: ",
        imageChange,
        " Image Link: ",
        imageLink,
        end="",
    )

    if needHelp:
        projectName = received.get("projectName", "")
        projectDescription = received.get("projectDescription", "")
        helpDescription = received.get("helpDescription", "")
        projectLink = received.get("projectLink", "")

        update_fields.update(
            {
                "projectName": projectName,
                "projectDescription": projectDescription,
                "helpDescription": helpDescription,
                "projectLink": projectLink,
            }
        )

        print(
            " Project name: ",
            projectName,
            " Project description: ",
            projectDescription,
            " Help description: ",
            helpDescription,
            " Project link: ",
            projectLink,
        )

    else:
        print()
        users.update_one({"id": id}, {"$set": update_fields})

    return jsonify({"": ""}), 200


@app.route("/api/get-match", methods=["POST"])
def get_match():
    received = request.get_json()

    demo = received.get("demo", False)

    def check_length(message, array, need_help, _id=""):
        if len(array) == 0:
            print(f"\n{message}\n")

            random_user = users.aggregate(
                [
                    {"$match": {"needHelp": {"$ne": need_help}, "_id": {"$ne": _id}}},
                    {"$sample": {"size": 1}},
                ]
            ).next()

            print(f"Random user: {random_user}")

            if check_fields(need_help, random_user, True):
                print("Check again")
                return check_length(message, array, not need_help, _id)

            return {
                "name": random_user.get("name", ""),
                "email": random_user.get("email", ""),
                "linkedIn": random_user.get("linkedIn", ""),
                "bio": random_user.get("bio", ""),
                "availability": random_user.get("availability", ""),
                "skills": random_user.get("skills", []),
                "themes": random_user.get("themes", []),
                "timeFrame": random_user.get("timeFrame", ""),
                "needHelp": random_user.get("needHelp", False),
                "projectName": random_user.get("projectName", ""),
                "projectDescription": random_user.get("projectDescription", ""),
                "helpDescription": random_user.get("helpDescription", ""),
                "projectLink": random_user.get("projectLink", ""),
                "imageLink": random_user.get("imageLink", ""),
                "exactMatch": False,
            }
        return None

    def check_fields(need_help, user, redirect=False):
        required_fields = [
            "name",
            "email",
            "linkedIn",
            "bio",
            "availability",
            "skills",
            "themes",
            "timeFrame",
        ]
        if need_help:
            required_fields.extend(
                [
                    "projectName",
                    "projectDescription",
                    "helpDescription",
                    "projectLink",
                ]
            )
        missing_fields = [field for field in required_fields if field not in user]

        if missing_fields:
            # return jsonify({"match": {"noSettings": True}})
            return jsonify({"settingsPresent": False})

    if demo:
        print("\nDemo mode enabled.\n")
        print(f"Received: {received}")

        all_users = users.find({"needHelp": {"$ne": received.get("needHelp")}})
        user_skills = received.get("skills")

        matches = []

        print(f"User skills: {user_skills}")
        print(f"All users: {all_users}")

        for potential_match in all_users:
            if check_fields(received.get("needHelp"), potential_match):
                print("Potential match has missing fields. Skipping.")
                continue

            potential_match_skills = potential_match.get("skills")

            common_skills = []

            for skill in user_skills:
                for potential_match_skill in potential_match_skills:
                    if skill.lower() == potential_match_skill.lower():
                        common_skills.append(skill)

                        print(f"Common skill found: {skill}")
                        break

            counter = 0
            for skill in common_skills:
                counter += 1

            if counter > 0:
                matches.append(
                    {
                        "name": potential_match.get("name", ""),
                        "email": potential_match.get("email", ""),
                        "linkedIn": potential_match.get("linkedIn", ""),
                        "bio": potential_match.get("bio", ""),
                        "availability": potential_match.get("availability", ""),
                        "skills": potential_match.get("skills", []),
                        "themes": potential_match.get("themes", []),
                        "timeFrame": potential_match.get("timeFrame", ""),
                        "commonSkills": list(common_skills),
                        "score": counter,
                        "needHelp": potential_match.get("needHelp", False),
                        "_id": str(potential_match["_id"]),
                        "projectName": potential_match.get("projectName", ""),
                        "projectDescription": potential_match.get(
                            "projectDescription", ""
                        ),
                        "helpDescription": potential_match.get("helpDescription", ""),
                        "projectLink": potential_match.get("projectLink", ""),
                        "imageLink": potential_match.get("imageLink", ""),
                        "exactMatch": True,
                    }
                )

        random_match = check_length(
            "No matches found. Try adding more interests.",
            matches,
            received.get("needHelp"),
        )
        if random_match:
            return jsonify({"match": random_match, "noMatches": True}), 200

        matches = sorted(matches, key=lambda x: x["score"], reverse=True)

        print(f"Match: {json.dumps(matches[0], indent=4)}")

        return jsonify({"match": matches[0]})

    else:
        user = users.find_one({"id": received.get("id", "")})

        if user is None:
            print("Redirecting to settings page.")
            return jsonify({"settingsPresent": False})

        def check_saved():
            if user.get("savedMatches") is not None:
                random_match = check_length(
                    "No new matches, all have been saved.",
                    matches,
                    user.get("needHelp"),
                    user.get("_id"),
                )
                if random_match:
                    return jsonify({"match": random_match, "noMatches": True}), 200
                for saved in user["savedMatches"]:
                    if matches[0]["id"] == saved:
                        print(f"{matches[0]['name']} is already saved.")
                        matches.pop(0)
                        check_saved()

        def check_past():
            if user.get("pastMatches") is not None:
                for past in user.get("pastMatches"):
                    random_match = check_length(
                        "No new matches, all have been matched in the past.",
                        matches,
                        user.get("needHelp"),
                        user.get("_id"),
                    )
                    if random_match:
                        return (
                            jsonify(
                                {
                                    "match": random_match,
                                    "noMatches": True,
                                    "settingsPresent": True,
                                }
                            ),
                            200,
                        )

                    print(f"Past: {past}")
                    print(f"Match: {matches[0]}")
                    if matches[0]["_id"] == past:
                        print(f"{matches[0]['name']} is a past match.")
                        matches.pop(0)
                        random_match = check_length(
                            "No new matches, all have been matched in the past.",
                            matches,
                            user.get("needHelp"),
                            user.get("_id"),
                        )
                        if random_match:
                            return (
                                jsonify({"match": random_match, "noMatches": True}),
                                200,
                            )

        missing_fields = check_fields(user.get("needHelp"), user)

        if missing_fields:
            print("Missing fields. Redirecting to settings page.")
            return missing_fields

        all_users = users.find({"needHelp": {"$ne": user.get("needHelp")}})
        user_skills = user.get("skills")

        matches = []

        for potential_match in all_users:
            if potential_match.get("_id") == user.get("_id"):
                continue

            if check_fields(user.get("needHelp"), potential_match):
                print("Potential match has missing fields. Skipping.")
                continue

            potential_match_skills = potential_match.get("skills")

            common_skills = []

            for skill in user_skills:
                for potential_match_skill in potential_match_skills:
                    if skill.lower() == potential_match_skill.lower():
                        common_skills.append(skill)
                        break

            counter = 0
            for skill in common_skills:
                counter += 1

            if counter > 0:
                matches.append(
                    {
                        "name": potential_match.get("name", ""),
                        "email": potential_match.get("email", ""),
                        "linkedIn": potential_match.get("linkedIn", ""),
                        "bio": potential_match.get("bio", ""),
                        "availability": potential_match.get("availability", ""),
                        "skills": potential_match.get("skills", []),
                        "themes": potential_match.get("themes", []),
                        "timeFrame": potential_match.get("timeFrame", ""),
                        "commonSkills": list(common_skills),
                        "score": counter,
                        "needHelp": potential_match.get("needHelp", False),
                        "_id": str(potential_match["_id"]),
                        "projectName": potential_match.get("projectName", ""),
                        "projectDescription": potential_match.get(
                            "projectDescription", ""
                        ),
                        "helpDescription": potential_match.get("helpDescription", ""),
                        "projectLink": potential_match.get("projectLink", ""),
                        "exactMatch": True,
                        "imageLink": potential_match.get("imageLink", ""),
                    }
                )

        random_match = check_length(
            "No matches found. Try adding more interests.",
            matches,
            user.get("needHelp"),
            user.get("_id"),
        )
        if random_match:
            return jsonify({"match": random_match, "noMatches": True}), 200

        matches = sorted(matches, key=lambda x: x["score"], reverse=True)

        # result = check_past()
        # if result:
        #     return jsonify({result}), 200

        # check_saved()

        # user.setdefault("pastMatches", [])
        # user["pastMatches"].append(matches[0]["_id"])
        # users.update_one({"_id": user["_id"]}, {"$set": {"pastMatches": user["pastMatches"]}})

        print(f"Match: {json.dumps(matches[0], indent=4)}")

        return jsonify({"match": matches[0]}), 200


@app.route("/api/save-match", methods=["POST"])
def save_match():
    received = request.get_json()

    update_operation = {
        "$push": {
            "savedMatches": received["matchID"],
        }
    }

    users.update_one({"id": received["id"]}, update_operation)


@app.route("/api/delete-saved-match", methods=["POST"])
def delete_saved_match():
    received = request.get_json()

    update_operation = {
        "$pull": {
            "savedMatches": received["matchID"],
        }
    }

    users.update_one({"id": received["id"]}, update_operation)


if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You are successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    app.run(debug=True, port=FLASK_PORT)
