
from flask import Flask, jsonify, render_template, request
from bson import ObjectId
import json
import mdb

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

    if file.filename == '': # Checking if the user submitted upload without selecting a file
        return 'No file selected'
    ml_config = {
        'removed_channels': request.form['removedChannels'].split(','),
    }
    classifier_name = request.form.get('classifier')
    print(len(ml_config))
    file_contents = file.read() # Read the uploaded file
    return classify_data(file_contents, ml_config, classifier_name)

    data = scipy.io.loadmat(file_obj) # Load data from file object using scipy loadmat()
    # Extract the structured array epo.y
    epo_x = data['epo_train']['x'][0, 0]
    epo_y = data['epo_train']['y'][0, 0]

    #transpose
    reshaped_data = epo_x.transpose(2, 0, 1)

    # Create a dictionary to hold the data for the dataframe
    data_dict = {}

    # Extract the number of trials
    num_trials = reshaped_data.shape[0]

    for channel_idx in range(reshaped_data.shape[2]):
        channel_data = reshaped_data[:, :, channel_idx].reshape(num_trials, -1)
        flattened_channel_data = channel_data.flatten()  # Flatten the 2D array to 1D
        data_dict[f'Channel_{channel_idx+1}'] = flattened_channel_data

    # Create the dataframe
    df = pd.DataFrame(data_dict)
    
    # Create a new dataframe with every 795th row
    new_df = df.iloc[::795]

    # Reset the index of the new dataframe
    new_df.reset_index(drop=True, inplace=True)

    # Create a list to hold the imagined speech for each trial
    imagined_speech = []

    # Mapping of row indices to speech labels
    speech_labels = {
        0: "Hello",
        1: "Help me",
        2: "Stop",
        3: "Thank you",
        4: "Yes"
    }

    # Iterate through each column of epo.y
    for trial_idx in range(epo_y.shape[1]):
        # Find the index of the row with a value of 1
        speech_idx = int(epo_y[:, trial_idx].nonzero()[0])
        
        # Map the speech index to the corresponding label
        if speech_idx in speech_labels:
                imagined_speech.append(speech_labels[speech_idx])
        else:
                imagined_speech.append("None")

    # Add the list as a new column in the dataframe
    new_df['Imagined_Speech'] = imagined_speech

    X = new_df.drop(columns=['Imagined_Speech']) # Change column name to the variable we are trying to predict, in our case, Imagined_Speech
    y = new_df['Imagined_Speech']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 42) # Split data into testing and training sets

    clf = RandomForestClassifier() # Eventually add other classifiers, maybe through a dictionary?
    clf.fit(X_train, y_train) # Train RandomForestClassifier()

    y_pred = clf.predict(X_test) # Predict the target variable using the other attributes of the test set
    accuracy = accuracy_score(y_test, y_pred) # Compare accuracy of predicted target variable vs. actual target variable

    conf_matrix = confusion_matrix(y_test, y_pred) # Create a confusion matrix, then corresponding heatmap
    plt.figure(figsize=(7,5))
    sns.heatmap(conf_matrix, annot=True, cmap='Blues', fmt='g')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Heatmap of Confusion Matrix')

    buf = io.BytesIO() # Convert the heatmap of confusion matrix to base64-encoded image so that it could be json-ified
    plt.savefig(buf, format='png')
    buf.seek(0)
    heatmap_image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    
    return jsonify({'accuracy': accuracy, 'heatmap_image_base64': heatmap_image_base64})
    
if __name__ == "__main__":

    app.run(debug=True, port=5000)

