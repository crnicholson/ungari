from flask import Flask, jsonify, request  # type: ignore
from flask_cors import CORS  # type: ignore
from pymongo import MongoClient  # type: ignore
import json
import os
from dotenv import load_dotenv  # type: ignore

load_dotenv(dotenv_path=f"{os.getcwd()}/.env.local")

FLASK_PORT = 38321
# MONGO_ADDRESS = os.getenv("MONGO_ADDRESS")
MONGO_ADDRESS = "mongodb://localhost:27017"

client = MongoClient(MONGO_ADDRESS)
db = client["problem-dating-app"]
users = db.users

app = Flask(__name__)
CORS(app)


# EXPAND THIS FUNCTION TO CHECK FOR MORE FIELDS
def check_fields(need_help, user):
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
        return missing_fields


@app.route("/api/get-status", methods=["POST"])
def get_status():
    received = request.get_json()
    id = received.get("id", "")

    user = users.find_one({"id": id})

    if user is None:
        return jsonify({"noSettings": True}), 200
    else:
        missing_fields = check_fields(user.get("needHelp", False), user)
        if missing_fields:
            print("Missing fields: ", missing_fields)
            return (
                jsonify(
                    {
                        "someSettings": True,
                        "missingFields": missing_fields,
                        "redirectMessage": "Hey there! You were redirected to the settings page to finish filling out your settings.",
                    }
                ),
                200,
            )
        else:
            return jsonify({"allSettings": True}), 200


@app.route("/api/get-settings", methods=["POST"])
def get_settings():
    received = request.get_json()
    id = received.get("id", "")

    user = users.find_one({"id": id})

    # if user is None:
    #     users.insert_one({"id": id})
    #     # return jsonify({"": ""}), 404

    return (
        jsonify(
            {
                "imageLink": user.get("imageLink", ""),
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "linkedIn": user.get("linkedIn", ""),
                "x": user.get("x", ""),
                "personalWebsite": user.get("personalWebsite", ""),
                "gitHub": user.get("gitHub", ""),
                "bio": user.get("bio", ""),
                "country": user.get("country", ""),
                "city": user.get("city", ""),
                "availability": user.get("availability", 0),
                "needHelp": user.get("needHelp"),
                "projectName": user.get("projectName", ""),
                "projectDescription": user.get("projectDescription", ""),
                "helpDescription": user.get("helpDescription", ""),
                "projectLink": user.get("projectLink", ""),
                "timeFrame": user.get("timeFrame", 0),
                "skills": user.get("skills", []),
                "skillLevels": user.get("skillLevels", {}),
                "themes": user.get("themes", []),
            }
        ),
        200,
    )


@app.route("/api/set-onboarding-settings", methods=["POST"])
def set_onboarding_settings():
    received = request.get_json()

    id = received.get("id", "")
    name = received.get("name", "")
    email = received.get("email", "")
    linkedIn = received.get("linkedIn", "")
    x = received.get("x", "")
    personalWebsite = received.get("personalWebsite", "")
    gitHub = received.get("gitHub", "")

    imageLink = received.get("imageLink", "")

    bio = received.get("bio", "")
    country = received.get("country", "")
    city = received.get("city", "")
    availability = received.get("availability", 0)

    needHelp = received.get("needHelp", False)
    projectName = received.get("projectName", "")
    projectDescription = received.get("projectDescription", "")
    helpDescription = received.get("helpDescription", "")
    projectLink = received.get("projectLink", "")
    timeFrame = received.get("timeFrame", 0)

    skills = received.get("skills", [])
    skillLevels = received.get("skillLevels", {})
    themes = received.get("themes", [])

    user = users.find_one({"id": id})

    if user is None:
        users.insert_one({"id": id})

    setting_fields = {
        "name": name,
        "email": email,
        "linkedIn": linkedIn,
        "x": x,
        "personalWebsite": personalWebsite,
        "gitHub": gitHub,
        "imageLink": imageLink,
        "bio": bio,
        "country": country,
        "city": city,
        "availability": availability,
        "needHelp": needHelp,
        "timeFrame": timeFrame,
        "skills": skills,
        "skillLevels": skillLevels,
        "themes": themes,
    }

    if needHelp:
        projectName = received.get("projectName", "")
        projectDescription = received.get("projectDescription", "")
        helpDescription = received.get("helpDescription", "")
        projectLink = received.get("projectLink", "")

        setting_fields.update(
            {
                "projectName": projectName,
                "projectDescription": projectDescription,
                "helpDescription": helpDescription,
                "projectLink": projectLink,
            }
        )

    else:
        users.update_one({"id": id}, {"$set": setting_fields})

    return jsonify({"": ""}), 200


@app.route("/api/set-settings", methods=["POST"])
def set_settings():
    received = request.get_json()

    id = received.get("id", "")

    imageLink = received.get("imageLink", "")
    name = received.get("name", "")
    email = received.get("email", "")
    linkedIn = received.get("linkedIn", "")
    x = received.get("x", "")
    personalWebsite = received.get("personalWebsite", "")
    gitHub = received.get("gitHub", "")

    bio = received.get("bio", "")
    country = received.get("country", "")
    city = received.get("city", "")
    availability = received.get("availability", 0)

    needHelp = received.get("needHelp", False)
    projectName = received.get("projectName", "")
    projectDescription = received.get("projectDescription", "")
    helpDescription = received.get("helpDescription", "")
    projectLink = received.get("projectLink", "")
    timeFrame = received.get("timeFrame", 0)

    skills = received.get("skills", [])
    skillLevels = received.get("skillLevels", {})
    themes = received.get("themes", [])

    update_fields = {
        "imageLink": imageLink,
        "name": name,
        "email": email,
        "linkedIn": linkedIn,
        "x": x,
        "personalWebsite": personalWebsite,
        "gitHub": gitHub,
        "bio": bio,
        "country": country,
        "city": city,
        "availability": availability,
        "needHelp": needHelp,
        "timeFrame": timeFrame,
        "skills": skills,
        "skillLevels": skillLevels,
        "themes": themes,
    }

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

    else:
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

            if check_fields(need_help, random_user):
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
                "matchID": str(random_user.get("_id", "")),
            }
        return None

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
                        "matchID": str(potential_match.get("_id", "")),
                        "projectName": potential_match.get("projectName", ""),
                        "projectDescription": potential_match.get(
                            "projectDescription", ""
                        ),
                        "helpDescription": potential_match.get("helpDescription", ""),
                        "projectLink": potential_match.get("projectLink", ""),
                        "imageLink": potential_match.get("imageLink", ""),
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

        missing_fields = check_fields(user.get("needHelp"), user)

        if missing_fields:
            print("Missing fields. Redirecting to settings page.")
            return jsonify({"settingsPresent": False})

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
                        "matchID": str(potential_match.get("_id", "")),
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

        if user.get("pastMatches") is not None:
            for past in user.get("pastMatches"):
                matches = [match for match in matches if match.get("_id", "") != past]
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
                                "noNewMatches": True,
                            }
                        ),
                        200,
                    )

        # check_saved()

        past_matches = user.get("pastMatches", [])
        past_matches.append(matches[0].get("_id", ""))
        users.update_one(
            {"_id": user.get("_id")}, {"$set": {"pastMatches": past_matches}}
        )

        print(f"Match: {json.dumps(matches[0], indent=4)}")

        return jsonify({"match": matches[0]}), 200


@app.route("/api/save-match", methods=["POST"])
def save_match():
    received = request.get_json()

    user = users.find_one({"id": received.get("id", "")})

    if user is None:
        return jsonify({"error": "User not found"}), 404

    update_operation = {
        "$push": {
            "savedMatches": received.get("matchID", ""),
        }
    }

    users.update_one({"id": received.get("id")}, update_operation)

    return jsonify({"": ""}), 200


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
