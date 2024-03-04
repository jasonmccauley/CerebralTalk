from flask import Flask, request, jsonify
import scipy.io
import io
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier # We can import more classifiers later, such as SVC and LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from mongopy import MongoClient

app = Flask(__name__)

# MongoDB connection string (replace with your actual connection string)
mongo_uri = "mongodb+srv://bknobloc:scrumineers1870@cluster0.yeo11hr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri)

# Access the database and collection
db = client.get_database("databaseScrumineers")
collection = db.get_collection("posts")
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files: # Checking if the user hasn't uploaded a file, therefore would not appear in requests
        return 'No file uploaded'

    file = request.files['file'] # If file is uploaded, set assign file to the uploaded file

    if file.filename == '': # Checking if the user submitted upload without selecting a file
        return 'No file selected'
    
    file_contents = file.read() # Read the uploaded file
    file_obj = io.BytesIO(file_contents) # Create a file object from the memory of the file contents

    data = scipy.io.loadmat(file_obj) # Load data from file object using scipy loadmat()
    df = pd.DataFrame(data) # Create a dataframe from that data

    X = df.drop(columns=['className']) # Change column name to the variable we are trying to predict, in our case, className
    y = df['className']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 42) # Split data into testing and training sets

    clf = RandomForestClassifier() # Eventually add other classifiers, maybe through a dictionary?
    clf.fit(X_train, y_train) # Train RandomForestClassifier()

    y_pred = clf.predict(X_test) # Predict the target variable using the other attributes of the test set
    accuracy = accuracy_score(y_test, y_pred) # Compare accuracy of predicted target variable vs. actual target variable

    conf_matrix = confusion_matrix(y_test, y_pred) # Create a confusion matrix, then corresponding heatmap
    plt.figure(figsize=(8,6))
    sns.heatmap(conf_matrix, annot=True, cmap='Blues', fmt='g')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Heatmap of Confusion Matrix')

    buf = io.BytesIO() # Convert the heatmap of confusion matrix to base64-encoded image so that it could be json-ified
    plt.savefig(buf, format='jpg')
    buf.seek(0)
    heatmap_image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    return jsonify({'accuracy': accuracy, 'heatmap_image_base64': heatmap_image_base64})

#sup dawgs this is a flask route example of implementing our collection
@app.route("/data", methods=["GET"])
def get_data():
    # this retrieves data from MongoDB collection
    data = list(db.posts.find_one({}))
    return jsonify({"data": data})
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)