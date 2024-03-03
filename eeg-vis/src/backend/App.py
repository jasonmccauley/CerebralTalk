from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection string (replace with your actual connection string)
mongo_uri = "mongodb+srv://bknobloc:scrumineers1870@cluster0.yeo11hr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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

#specify app route for function, doesn't matter what it is but it will be used to call the function from React
@app.route("/send_string", methods=["POST"])
def send_string():
    #creates dictionary
    data = {'message': 'Hello from Flask!'}

    #converts data into a json and returns it (See HomePage.js for more)
    return jsonify(data)
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)
