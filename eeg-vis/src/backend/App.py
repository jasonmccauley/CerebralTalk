from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection string (replace with your actual connection string)
mongo_uri = "mongodb://lkibalo:scrumineers1870@host:3000//databaseScrumineers"
client = MongoClient(mongo_uri)

# Access the database and collection
db = client.get_database("databaseScrumineers")
collection = db.get_collection("collectionScrumineers")

# Define routes
@app.route("/")
def home():
    return "Welcome to the backend of your React application!"

#sup dawgs this is a flask route example of implementing our collection
@app.route("/data", methods=["GET"])
def get_data():
    # this retrieves data from MongoDB collection
    data = list(collection.find({}))
    return jsonify({"data": data})

if __name__ == "__main__":
    app.run(debug=True)
