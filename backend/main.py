from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import json

FLASK_PORT = 40247
MONGO_ADDRESS = "mongodb://root:example@hackclub.app:34209/?authSource=admin"

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
    pastMatches = received.get("pastMatches", [])
    savedMatches = received.get("savedMatches", [])
    
    user = users.find_one({"id": id})

    if user is None:
        users.insert_one({"id": id})
        return jsonify({"error": "User not found in database."}), 404
    
    if needHelp:
        projectName = received.get("projectName", "")
        projectDescription = received.get("projectDescription", "")
        helpDescription = received.get("helpDescription", "")
        projectLink = received.get("projectLink", "")
    
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
            " Past matches: ",
            pastMatches,
            " Saved matches: ",
            savedMatches,
            " Project name: ",
            projectName,
            " Project description: ",
            projectDescription,
            " Help description: ",
            helpDescription,
            " Project link: ",
            projectLink,
        )

        users.update_one(
            {"id": id},
            {
                "$set": {
                    "name": name,
                    "email": email,
                    "linkedIn": linkedIn,
                    "needHelp": needHelp,
                    "bio": bio,
                    "availability": availability,
                    "skills": skills,
                    "themes": themes,
                    "timeFrame": timeFrame,
                    "pastMatches": pastMatches,
                    "savedMatches": savedMatches,
                    "projectName": projectName,
                    "projectDescription": projectDescription,
                    "helpDescription": helpDescription,
                    "projectLink": projectLink,
                }
            },
        )
    else:
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
            " Past matches: ",
            pastMatches,
            " Saved matches: ",
            savedMatches,
        )

        users.update_one(
            {"id": id},
            {
                "$set": {
                    "name": name,
                    "email": email,
                    "linkedIn": linkedIn,
                    "needHelp": needHelp,
                    "bio": bio,
                    "availability": availability,
                    "skills": skills,
                    "themes": themes,
                    "timeFrame": timeFrame,
                    "pastMatches": pastMatches,
                    "savedMatches": savedMatches,
                }
            },
        )

    return jsonify({"": ""}), 200


@app.route("/api/get-match", methods=["POST"])
def get_match():
    received = request.get_json()

    demo = received.get("demo", False)
    
    if demo:
        print("\nDemo mode enabled.\n")
        
        all_users = users.find({"needHelp": not received.get("needHelp")})
        user_skills = received.get("skills")

        matches = []
        
        print(f"User skills: {user_skills}")
        print(f"All users: {all_users}")
        
        for person in all_users:
            required_fields = ["name", "email", "linkedIn", "bio", "availability", "skills", "themes", "timeFrame"]
            if received.get("needHelp"):
                required_fields.extend(["projectName", "projectDescription", "helpDescription", "projectLink"])
            missing_fields = [field for field in required_fields if field not in person]
            
            if missing_fields:
                print("Missing fields. Skipping.")
                continue 

            person_skills = person.get("skills")

            common_skills = []
            
            for skill in user_skills:
                for person_skill in person_skills:
                    if skill.lower() == person_skill.lower():
                        common_skills.append(skill)
                        
                        print(f"Common skill found: {skill}")
                        break

            counter = 0
            for skill in common_skills:
                counter += 1
                
            if counter > 0 and not person.get("needHelp"):
                matches.append(
                    {
                        "name": person.get("name", ""),
                        "email": person.get("email", ""),
                        "linkedIn": person.get("linkedIn", ""),
                        "bio": person.get("bio", ""),
                        "availability": person.get("availability", ""),
                        "skills": person.get("skills", []),
                        "themes": person.get("themes", []),
                        "timeFrame": person.get("timeFrame", ""),
                        "commonSkills": list(common_skills),
                        "score": counter,
                        "needHelp": person.get("needHelp", False),
                        "_id": str(person["_id"]),
                    }
                )
            elif counter > 0 and person.get("needHelp"):
                matches.append(
                    {
                        "name": person.get("name", ""),
                        "email": person.get("email", ""),
                        "linkedIn": person.get("linkedIn", ""),
                        "bio": person.get("bio", ""),
                        "availability": person.get("availability", ""),
                        "skills": person.get("skills", []),
                        "themes": person.get("themes", []),
                        "timeFrame": person.get("timeFrame", ""),
                        "commonSkills": list(common_skills),
                        "score": counter,
                        "needHelp": person.get("needHelp", False),
                        "_id": str(person["_id"]),
                        "projectName": person.get("projectName", ""),
                        "projectDescription": person.get("projectDescription", ""),
                        "helpDescription": person.get("helpDescription", ""),
                        "projectLink": person.get("projectLink", ""),
                    }
                )

        if len(matches) == 0:
            print("\nNo matches found. Try adding more interests.\n")
            return jsonify({"error": "No matches found. Try adding more interests.", "noMatches": True}), 404
        
        matches = sorted(matches, key=lambda x: x["score"], reverse=True)
                    
        print(f"Match: {json.dumps(matches[0], indent=4)}")

        return jsonify({"match": matches[0]})
        
    else:
        user = users.find_one({"id": received.get("id", "")})

        if user is None:
            return jsonify({"error": "User not found. Please fill in settings."})
        
        required_fields = ["name", "email", "linkedIn", "bio", "availability", "skills", "themes"]
        if user.get("needHelp"):
            required_fields.extend(["projectName", "projectDescription", "helpDescription", "projectLink"])
        missing_fields = [field for field in required_fields if field not in user]
        
        if missing_fields:
            print(f"Missing fields: {', '.join(missing_fields)}")
            return jsonify({"error": "Some settings are missing. Please fill in all settings."})

        all_users = users.find({"needHelp": not user.get("needHelp")})
        user_skills = user.get("skills")

        matches = []

        for person in all_users:
            
            # CHANGE THIS TO ID LATER, FOR TESINTG ONLY.
            if person.get("name") == user.get("name"):
                continue
            
            # MISSING FIELDS DOESN"T SEEM TO BE WORKING WITH helpDescription. 
            required_fields = ["name", "email", "linkedIn", "bio", "availability", "skills", "themes", "timeFrame"]
            if user.get("needHelp"):
                required_fields.extend(["projectName", "projectDescription", "helpDescription", "projectLink"])
            missing_fields = [field for field in required_fields if field not in person]
            
            if missing_fields:
                continue 

            person_skills = person.get("skills")

            common_skills = []
            
            for skill in user_skills:
                for person_skill in person_skills:
                    if skill.lower() == person_skill.lower():
                        common_skills.append(skill)
                        break

            counter = 0
            for skill in common_skills:
                counter += 1
                
            if counter > 0 and not person.get("needHelp"):
                matches.append(
                    {
                        "name": person.get("name", ""),
                        "email": person.get("email", ""),
                        "linkedIn": person.get("linkedIn", ""),
                        "bio": person.get("bio", ""),
                        "availability": person.get("availability", ""),
                        "skills": person.get("skills", []),
                        "themes": person.get("themes", []),
                        "timeFrame": person.get("timeFrame", ""),
                        "commonSkills": list(common_skills),
                        "score": counter,
                        "needHelp": person.get("needHelp", False),
                        "_id": str(person["_id"]),
                    }
                )
            elif counter > 0 and person.get("needHelp"):
                matches.append(
                    {
                        "name": person.get("name", ""),
                        "email": person.get("email", ""),
                        "linkedIn": person.get("linkedIn", ""),
                        "bio": person.get("bio", ""),
                        "availability": person.get("availability", ""),
                        "skills": person.get("skills", []),
                        "themes": person.get("themes", []),
                        "timeFrame": person.get("timeFrame", ""),
                        "commonSkills": list(common_skills),
                        "score": counter,
                        "needHelp": person.get("needHelp", False),
                        "_id": str(person["_id"]),
                        "projectName": person.get("projectName", ""),
                        "projectDescription": person.get("projectDescription", ""),
                        "helpDescription": person.get("helpDescription", ""),
                        "projectLink": person.get("projectLink", ""),
                    }
                )

        if len(matches) == 0:
            print("\nNo matches found. Try adding more interests.\n")
            return jsonify({"error": "No matches found. Try adding more interests."}), 404
        
        matches = sorted(matches, key=lambda x: x["score"], reverse=True)

        def check_saved():
            if user.get("savedMatches") is not None:
                if len(matches) == 0:
                    print("\nNo new matches, all have been saved for later.\n")
                    return jsonify({"error": "No new matches, all have been saved for later."})
                for saved in user["savedMatches"]:
                    if matches[0]["id"] == saved:
                        print(f"{matches[0]['name']} is already saved.")
                        matches.pop(0)
                        check_saved()
                
        def check_past():
            if user.get("pastMatches") is not None:
                for past in user["pastMatches"]:
                    if len(matches) == 0:
                        print("\nNo new matches, all have been matched in the past.\n")
                        return jsonify({"error": "No new matches, all have been matched in the past."}), 404
                    print(f"Past: {past}")
                    print(f"Match: {matches[0]}")
                    if matches[0]["_id"] == past:
                        print(f"{matches[0]['name']} is a past match.")
                        matches.pop(0)
                        if len(matches) == 0:
                            print("\nNo new matches, all have been matched in the past.\n")
                            return jsonify({"error": "No new matches, all have been matched in the past."}), 404

        result = check_past()
        if result:
            return result
                
        # check_saved()
            
        # user.setdefault("pastMatches", [])
        # user["pastMatches"].append(matches[0]["_id"])
        # users.update_one({"_id": user["_id"]}, {"$set": {"pastMatches": user["pastMatches"]}}) 
                    
        print(f"Match: {json.dumps(matches[0], indent=4)}")

        return jsonify({"match": matches[0]})


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
