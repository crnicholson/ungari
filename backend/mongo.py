from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client.appdb
users = db.users

for user in users.find():
    print(user)
