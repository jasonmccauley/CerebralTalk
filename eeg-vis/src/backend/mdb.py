from pymongo import MongoClient

# MongoDB connection string (replace with your actual connection string)
mongo_uri = "mongodb+srv://oelkhafi:scrumineers1870@cluster0.yeo11hr.mongodb.net/"
client = MongoClient(mongo_uri)

# Access the database and collection
db = client.get_database("databaseScrumineers")

def get_db():
    return db

def get_collection(collection_name):
    return db.get_collection(collection_name)