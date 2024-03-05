import unittest
from pymongo import MongoClient
from flask import jsonify
from bson import ObjectId
import json

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

# Test code for user story: As a casual explorer of ML algorithms, I want to pull data from the internet and save my own generated images to the internet without uploading or downloading files. 
class TestDatabaseConnections(unittest.TestCase):
    
    def test_makeConnection(self):
        posts = db.get_collection("posts")

        # Create sample post with arbitrary data.
        test_post = {
            'title': "Test",
            'content': "Test content"
        }

        # If the test post already exists, replace it. If it does not, insert it.
        if (db.posts.find_one(test_post)):
            db.posts.replace_one(test_post,test_post)
        else:
            db.posts.insert_one(test_post)
        
        data = list(posts.find({}))
        
        # Assert that the test post exists and that only one copy of it exists in the database.
        self.assertTrue(data[0]['title'] == "Test")
        self.assertTrue(len(data) == 1)

    def test_collections(self):
        # Verify the existence of real collections in the database.
        self.assertTrue("collectionScrumineers" in db.list_collection_names())
        self.assertTrue("posts" in db.list_collection_names())

        # Verify the nonexistence of a collection name that does not exist in the database.
        self.assertFalse("nonexistentCollection" in db.list_collection_names())

        # Verify collection creation and deletion.
        try:
            db.create_collection("nonexistentCollection")
            self.assertTrue("nonexistentCollection" in db.list_collection_names())
            db.drop_collection("nonexistentCollection")
            self.assertFalse("nonexistentCollection" in db.list_collection_names())
        except:
            self.fail("Collection creation and/or deletion yielded an error.")
    
    def test_pullImage(self):
        collection = db.get_collection("confusion_matrix")
        data = list(collection.find({}))
        
        # Test the existence and correctness of a JSON/BSON object containing base64 image data.
        try:
            image_data = json.loads(JSONEncoder().encode(data))[0]
            # Test that accuracy is a float between 0 and 1, inclusive.
            self.assertTrue(image_data['accuracy'] >= 0 and image_data['accuracy'] <= 1)
            # Test that the heatmap data exists.
            self.assertTrue(image_data['heatmap_image_base64'])
        except:
            self.fail("Could not pull encoded image from database.")


if __name__ == '__main__':
    # MongoDB connection string (replace with your actual connection string)
    mongo_uri = "mongodb+srv://bknobloc:scrumineers1870@cluster0.yeo11hr.mongodb.net/"
    client = MongoClient(mongo_uri)

    # Access the database and collection
    db = client.get_database("databaseScrumineers")
    unittest.main()