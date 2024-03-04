import unittest
from pymongo import MongoClient

class TestDatabaseConnections(unittest.TestCase):
    
    def test_makeConnection(self):
        posts = db.get_collection("posts")

        test_post = {
            'title': "Test",
            'content': "Test content"
        }

        if (db.posts.find_one(test_post)):
            db.posts.replace_one(test_post,test_post)
        else:
            db.posts.insert_one(test_post)
        
        data = list(posts.find({}))
        
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


if __name__ == '__main__':
    # MongoDB connection string (replace with your actual connection string)
    mongo_uri = "mongodb+srv://bknobloc:scrumineers1870@cluster0.yeo11hr.mongodb.net/"
    client = MongoClient(mongo_uri)

    # Access the database and collection
    db = client.get_database("databaseScrumineers")
    unittest.main()