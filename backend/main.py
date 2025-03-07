from flask import Flask, jsonify, request  # type: ignore
from flask_cors import CORS  # type: ignore
from flask_socketio import SocketIO, emit, join_room, leave_room
from pymongo import MongoClient  # type: ignore
import json
import os
import datetime
from dotenv import load_dotenv  # type: ignore
from bson.objectid import ObjectId  # Add this import at the top

load_dotenv(dotenv_path=f"{os.getcwd()}/.env.local")

FLASK_PORT = 38321
# MONGO_ADDRESS = os.getenv("MONGO_ADDRESS")
MONGO_ADDRESS = "mongodb://localhost:27017"

client = MongoClient(MONGO_ADDRESS)
db = client["problem-dating-app"]
users = db.users
chats = db.chats

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


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
    auth0_id = received.get("auth0_id", "")

    user = users.find_one({"id": auth0_id})

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
    auth0_id = received.get("auth0_id", "")

    user = users.find_one({"id": auth0_id})

    # if user is None:
    #     users.insert_one({"id": id})
    #     # return jsonify({"": ""}), 404

    return (
        jsonify(
            {
                "image": user.get(
                    "image",
                    f"https://ui-avatars.com/api/?size=256&background=random&name={user.get("name").replace(' ', '+')}",
                ),
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

    auth0_id = received.get("auth0_id", "")
    name = received.get("name", "")
    email = received.get("email", "")
    linkedIn = received.get("linkedIn", "")
    x = received.get("x", "")
    personalWebsite = received.get("personalWebsite", "")
    gitHub = received.get("gitHub", "")

    image = received.get("image", f"https://ui-avatars.com/api/?size=256&background=random&name={received.get("name").replace(' ', '+')}")

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

    user = users.find_one({"id": auth0_id})

    if user is None:
        users.insert_one({"id": auth0_id})

    setting_fields = {
        "name": name,
        "email": email,
        "linkedIn": linkedIn,
        "x": x,
        "personalWebsite": personalWebsite,
        "gitHub": gitHub,
        "image": image,
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
        users.update_one({"id": auth0_id}, {"$set": setting_fields})

    return jsonify({"": ""}), 200


@app.route("/api/set-settings", methods=["POST"])
def set_settings():
    received = request.get_json()

    auth0_id = received.get("auth0_id", "")

    name = received.get("name", "")

    image = received.get("image", f"https://ui-avatars.com/api/?size=256&background=random&name={name.replace(' ', '+')}")
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
        "image": image,
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
        users.update_one({"id": auth0_id}, {"$set": update_fields})

    return jsonify({"": ""}), 200


@app.route("/api/get-profile", methods=["POST"])
def get_profile():
    received = request.get_json()
    
    _id = received.get("_id", "")
    
    try:
        _id = ObjectId(_id)
    except:
        return jsonify({"error": "User not found", "noUser": True}), 404

    user = users.find_one({"_id": _id})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    user_data = {
        "match_id": str(user.get("_id", "")),
        "image": user.get("image", f"https://ui-avatars.com/api/?size=256&background=random&name={user.get("name").replace(' ', '+')}"),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "linkedIn": user.get("linkedIn", ""),
        "x": user.get("x", ""),
        "personalWebsite": user.get("personalWebsite", ""),
        "gitHub": user.get("gitHub", ""),
        "bio": user.get("bio", ""),
        "country": user.get("country", ""),
        "city": user.get("city", ""),
        "availability": user.get("availability", ""),
        "needHelp": user.get("needHelp", False),
        "projectName": user.get("projectName", ""),
        "projectDescription": user.get(
            "projectDescription", ""
        ),
        "helpDescription": user.get("helpDescription", ""),
        "projectLink": user.get("projectLink", ""),
        "timeFrame": int(
            user.get("timeFrame", "")
            .replace("months", "")
            .strip()
        ),
        "skills": user.get("skills", []),
        "skillLevels": user.get("skillLevels", {}),
        "themes": user.get("themes", []),
    }
            
    print(f"User data: {json.dumps(user_data, indent=4)}")

    return jsonify({"user": user_data})


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
                "match_id": str(random_user.get("_id", "")),
                "user_id": str(user.get("_id", "")),
                "image": random_user.get("image", f"https://ui-avatars.com/api/?size=256&background=random&name={random_user.get("name").replace(' ', '+')}"),
                "name": random_user.get("name", ""),
                "email": random_user.get("email", ""),
                "linkedIn": random_user.get("linkedIn", ""),
                "x": random_user.get("x", ""),
                "personalWebsite": random_user.get("personalWebsite", ""),
                "gitHub": random_user.get("gitHub", ""),
                "bio": random_user.get("bio", ""),
                "country": random_user.get("country", ""),
                "city": random_user.get("city", ""),
                "availability": random_user.get("availability", ""),
                "needHelp": random_user.get("needHelp", False),
                "projectName": random_user.get("projectName", ""),
                "projectDescription": random_user.get("projectDescription", ""),
                "helpDescription": random_user.get("helpDescription", ""),
                "projectLink": random_user.get("projectLink", ""),
                "timeFrame": int(
                    random_user.get("timeFrame", "").replace("months", "").strip()
                ),
                "skills": random_user.get("skills", []),
                "skillLevels": random_user.get("skillLevels", {}),
                "themes": random_user.get("themes", []),
            }
        return None

    def calculate_score(
        user_skills,
        user_skill_levels,
        match_skills,
        match_skill_levels,
        themes,
        match_themes,
    ):
        score = 0
        common_skills = []
        skill_score_details = {}

        for skill in user_skills:
            if skill in match_skills:
                common_skills.append(skill)
                user_level = user_skill_levels.get(skill, 1)
                match_level = match_skill_levels.get(skill, 1)

                skill_score = 1.0

                level_diff = match_level - user_level
                if level_diff > 0:
                    skill_score += min(level_diff * 0.75, 2.0)
                elif level_diff == 0:
                    skill_score += 0.5
                else:
                    skill_score *= max(0.5, (match_level / user_level))

                score += skill_score
                skill_score_details[skill] = skill_score

        common_themes = set(themes).intersection(set(match_themes))
        theme_score = sum(1 / (i + 1) for i in range(len(common_themes)))
        score += theme_score * 2

        if user_skills:
            coverage_ratio = len(common_skills) / len(user_skills)
            score *= (1 + coverage_ratio) / 2

        normalized_score = round(min(10, score), 2)

        return (
            normalized_score,
            list(common_skills),
            list(common_themes),
            skill_score_details,
        )

    if demo:
        print("\nDemo mode enabled.\n")
        print(f"Received: {received}")

        all_users = users.find({"needHelp": {"$ne": received.get("needHelp")}})
        user_skills = received.get("skills", [])
        user_skill_levels = received.get("skillLevels", {})
        user_themes = received.get("themes", [])

        matches = []

        print(f"User skills: {user_skills}")
        print(f"All users: {all_users}")

        for potential_match in all_users:
            if check_fields(received.get("needHelp"), potential_match):
                print("Potential match has missing fields. Skipping.")
                continue

            potential_match_skills = potential_match.get("skills", [])
            potential_match_skill_levels = potential_match.get("skillLevels", {})
            potential_match_themes = potential_match.get("themes", [])

            score, common_skills, common_themes, skill_score_details = calculate_score(
                user_skills,
                user_skill_levels,
                potential_match_skills,
                potential_match_skill_levels,
                user_themes,
                potential_match_themes,
            )

            if score > 0:
                matches.append(
                    {
                        "match_id": str(potential_match.get("_id", "")),
                        # "user_id": str(user.get("_id", "")),
                        "image": potential_match.get("image", f"https://ui-avatars.com/api/?size=256&background=random&name={potential_match.get("name").replace(' ', '+')}"),
                        "name": potential_match.get("name", ""),
                        "email": potential_match.get("email", ""),
                        "linkedIn": potential_match.get("linkedIn", ""),
                        "x": potential_match.get("x", ""),
                        "personalWebsite": potential_match.get("personalWebsite", ""),
                        "gitHub": potential_match.get("gitHub", ""),
                        "bio": potential_match.get("bio", ""),
                        "country": potential_match.get("country", ""),
                        "city": potential_match.get("city", ""),
                        "availability": potential_match.get("availability", ""),
                        "needHelp": potential_match.get("needHelp", False),
                        "projectName": potential_match.get("projectName", ""),
                        "projectDescription": potential_match.get(
                            "projectDescription", ""
                        ),
                        "helpDescription": potential_match.get("helpDescription", ""),
                        "projectLink": potential_match.get("projectLink", ""),
                        "timeFrame": int(
                            potential_match.get("timeFrame", "")
                            .replace("months", "")
                            .strip()
                        ),
                        "skills": potential_match.get("skills", []),
                        "skillLevels": potential_match.get("skillLevels", {}),
                        "themes": potential_match.get("themes", []),
                        "commonSkills": common_skills,
                        "commonThemes": common_themes,
                        "score": score,
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
        user = users.find_one({"id": received.get("auth0_id", "")})

        if user is None:
            print("Redirecting to settings page.")
            return jsonify({"settingsPresent": False})

        all_users = users.find({"needHelp": {"$ne": user.get("needHelp")}})
        user_skills = user.get("skills", [])
        user_skill_levels = user.get("skillLevels", {})
        user_themes = user.get("themes", [])

        matches = []

        for potential_match in all_users:
            if potential_match.get("_id") == user.get("_id"):
                continue

            if check_fields(user.get("needHelp"), potential_match):
                print("Potential match has missing fields. Skipping.")
                continue

            potential_match_skills = potential_match.get("skills", [])
            potential_match_skill_levels = potential_match.get("skillLevels", {})
            potential_match_themes = potential_match.get("themes", [])

            score, common_skills, common_themes, skill_score_details = calculate_score(
                user_skills,
                user_skill_levels,
                potential_match_skills,
                potential_match_skill_levels,
                user_themes,
                potential_match_themes,
            )

            if score > 0:
                matches.append(
                    {
                        "match_id": str(potential_match.get("_id", "")),
                        "user_id": str(user.get("_id", "")),
                        "image": potential_match.get("image", f"https://ui-avatars.com/api/?size=256&background=random&name={potential_match.get("name").replace(' ', '+')}"),
                        "name": potential_match.get("name", ""),
                        "email": potential_match.get("email", ""),
                        "linkedIn": potential_match.get("linkedIn", ""),
                        "x": potential_match.get("x", ""),
                        "personalWebsite": potential_match.get("personalWebsite", ""),
                        "gitHub": potential_match.get("gitHub", ""),
                        "bio": potential_match.get("bio", ""),
                        "country": potential_match.get("country", ""),
                        "city": potential_match.get("city", ""),
                        "availability": potential_match.get("availability", ""),
                        "needHelp": potential_match.get("needHelp", False),
                        "projectName": potential_match.get("projectName", ""),
                        "projectDescription": potential_match.get(
                            "projectDescription", ""
                        ),
                        "helpDescription": potential_match.get("helpDescription", ""),
                        "projectLink": potential_match.get("projectLink", ""),
                        "timeFrame": int(
                            potential_match.get("timeFrame", "")
                            .replace("months", "")
                            .strip()
                        ),
                        "skills": potential_match_skills,
                        "skillLevels": potential_match_skill_levels,
                        "themes": potential_match_themes,
                        "commonSkills": common_skills,
                        "commonThemes": common_themes,
                        "score": score,
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

        if user.get("pastMatches"):
            matches = [
                match
                for match in matches
                if match.get("_id") not in user.get("pastMatches")
            ]

            if not matches:
                random_match = check_length(
                    "No new matches, all have been matched in the past.",
                    matches,
                    user.get("needHelp"),
                    user.get("_id"),
                )
                if random_match:
                    return jsonify({"match": random_match, "noNewMatches": True}), 200

        past_matches = user.get("pastMatches", [])
        past_matches.append(matches[0].get("_id", ""))
        users.update_one(
            {"_id": user.get("_id")}, {"$set": {"pastMatches": past_matches}}
        )

        print(f"Match: {json.dumps(matches[0], indent=4)}")

        return jsonify({"match": matches[0]}), 200


# @app.route("/api/save-match", methods=["POST"])
# def save_match():
#     received = request.get_json()

#     user = users.find_one({"id": received.get("id", "")})

#     if user is None:
#         return jsonify({"error": "User not found"}), 404

#     update_operation = {
#         "$push": {
#             "savedMatches": received.get("_id", ""),
#         }
#     }

#     users.update_one({"id": received.get("id")}, update_operation)

#     return jsonify({"": ""}), 200


# @app.route("/api/delete-saved-match", methods=["POST"])
# def delete_saved_match():
#     received = request.get_json()

#     update_operation = {
#         "$pull": {
#             "savedMatches": received["matchID"],
#         }
#     }

#     users.update_one({"id": received["id"]}, update_operation)


@app.route("/api/create-chat", methods=["POST"])
def create_chat():
    received = request.get_json()

    user = users.find_one({"id": received.get("id")})

    user_id = user.get("_id")  # _id of the user.
    match_id = received.get("match_id")  # _id of the match.

    matchName = users.find_one({"_id": ObjectId(match_id)}).get("name")
    userName = user.get("name")

    if matchName and userName:
        new_chat = {
            "participants": {
                match_id: matchName,
                user_id: userName,
            },
            "messages": [],
        }

        chats.insert_one(new_chat)

        return jsonify({"": ""}), 200
    else:
        return jsonify({"error": "Could not create chat."}), 404


@app.route("/api/get-chat", methods=["POST"])
def get_chat():
    received = request.get_json()

    print(f"Get chat request: {json.dumps(received, indent=4)}")

    user = users.find_one({"id": received.get("auth0_id")})

    user_id = str(user.get("_id")) # _id of the user.
    match_id = received.get("match_id") # _id of the match.

    match = users.find_one({"_id": ObjectId(match_id)})
    matchName = match.get("name")
    matchImage = match.get(
        "image",
        f"https://ui-avatars.com/api/?size=256&background=random&name={matchName.replace(' ', '+')}",
    )
    
    chat = chats.find_one(
        {
            f"participants.{match_id}": {"$exists": True},
            f"participants.{user_id}": {"$exists": True},
        }
    )

    messages = []
    for message in chat.get("messages", []):
        messages.append(
            {
                "content": message.get("content", ""),
                "auth0_id": message.get("auth0_id", ""),
                "timestamp": message.get("timestamp", ""),
            }
        )

    return jsonify({"matchName": matchName, "matchImage": matchImage, "messages": messages}), 200


@app.route("/api/get-chats", methods=["POST"])
def get_chats():
    received = request.get_json()

    user = users.find_one({"id": received.get("auth0_id")})

    user_id = str(user.get("_id")) # _id of the user.

    print(user_id)

    all_chats = list(chats.find({
        f"participants.{user_id}": {"$exists": True}
    }))

    chat_list = []
    for chat in all_chats:
        for participant_id, participant_name in chat.get("participants").items():
            if participant_id != user_id:
                match_profile = users.find_one({"_id": ObjectId(participant_id)})
                chat_list.append(
                    {
                        "match_id": participant_id,
                        "matchName": participant_name,
                        "matchImage": match_profile.get(
                            "image",
                            f"https://ui-avatars.com/api/?size=256&background=random&name={participant_name.replace(' ', '+')}",
                        ),
                        "lastMessage": (
                            chat.get("messages", [{}])[-1].get("content", "")
                            if chat.get("messages")
                            else ""
                        ),
                    }
                )

    print(chat_list)

    return jsonify({"chatList": chat_list}), 200


@socketio.on("connect")
def handle_connect():
    print(f"Client connected: {request.sid}")
    emit("chat_message", "Welcome to the chat!")


@socketio.on("disconnect")
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")


@socketio.on("message")
def handle_chat_message(received):
    # try:
    print(f"Message: {json.dumps(received, indent=4)}")

    user = users.find_one({"id": received.get("auth0_id")})
    
    user_id = str(user.get("_id")) # _id of the user.
    match_id = received.get("match_id")  # _id of the match, already in string form.

    new_message = {
        "content": received.get("content", ""),
        "sender_id": user_id,
        "auth0_id": received.get("auth0_id", ""),
        "timestamp": str(datetime.datetime.now(datetime.UTC)),
    }

    result = chats.update_one(
        {
            f"participants.{user_id}": {"$exists": True},
            f"participants.{match_id}": {"$exists": True},
        },
        {"$push": {"messages": new_message}},
    )

    if result.modified_count == 1:
        emit("message", new_message, broadcast=True, include_self=False)
    else:
        print("Error: Could not save message to database")

    # except Exception as e:
    #     print(f"Error handling chat message: {e}")


if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You are successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    socketio.run(app, debug=True, port=FLASK_PORT)
