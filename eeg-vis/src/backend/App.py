
from flask import Flask, jsonify, render_template, request
from bson import ObjectId
import json
import mdb

# Import external modules
from ml import classify_data

app = Flask(__name__, template_folder='../../build', static_folder='../../build', static_url_path='')

# For shell parameter, specify: True for Windows, False for Mac
#subprocess.run(["npm", "run", "build"], shell=False)

# Access the database and collection
db = mdb.get_db()
collection = mdb.get_collection("confusion_matrix")

# Define routes
@app.route('/')
def index():
    return render_template('index.html')


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)
    
#sup dawgs this is a flask route example of implementing our collection
@app.route("/data", methods=["GET"])
def get_data():
    collection = db.get_collection("confusion_matrix")
    data = list(collection.find({}))
    return jsonify({"data": json.loads(JSONEncoder().encode(data))})

def get_file_from_database(data_label):
     collection = db.get_collection("eeg-data")
     data = list(collection.find_one({"epo_train.title": data_label}))[0]
     
     return jsonify(data)

@app.route('/classify_remote_data', methods=['POST'])
def classify_remote_data():
    
    data_label = request.form.get('file_select')
    file_contents = get_file_from_database(data_label)
    return classify_data(file_contents)

@app.route('/upload', methods=['POST'])
def classify_uploaded_file_eeg():

    if 'file' in request.files:
         file = request.files['file'] # If file is uploaded, set assign file to the uploaded file
    else: # Checking if the user hasn't uploaded a file, therefore would not appear in requests
         file = get_file_from_database(request)
    if 'file' in request.files:
         file = request.files['file'] # If file is uploaded, set assign file to the uploaded file
    else: # Checking if the user hasn't uploaded a file, therefore would not appear in requests
         file = get_file_from_database(request)

    if file.filename == '': # Checking if the user submitted upload without selecting a file
        return 'No file selected'
    ml_config = {
        'removed_channels': request.form['removedChannels'].split(','),
    }
    classifier_name = request.form.get('classifier')
    file_contents = file.read() # Read the uploaded file
    return classify_data(file_contents, ml_config, classifier_name)

if __name__ == "__main__":
    app.run(debug=True, port=5000)

