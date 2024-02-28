from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection string (replace with your actual connection string)
mongo_uri = "mongodb://127.0.0.1:27017//databaseScrumineers"
client = MongoClient(mongo_uri)

# Access the database and collection
db = client.get_database("database_name")
collection = db.get_collection("collection_name")

# Define routes
@app.route("/")
def home():
    return "Welcome to the backend of your React application!"

@app.route("/data", methods=["GET"])
def get_data():
    # Retrieve data from MongoDB collection
    data = list(collection.find({}))
    return jsonify({"data": data})

if __name__ == "__main__":
    app.run(debug=True)
