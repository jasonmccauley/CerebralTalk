# Import flask app variable to connect to App.py

# Other imports
from flask import jsonify
import scipy.io
import io
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier # We can import more classifiers later, such as SVC and LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from pymongo import MongoClient


# MongoDB connection string (replace with your actual connection string)
mongo_uri = "mongodb+srv://bknobloc:scrumineers1870@cluster0.yeo11hr.mongodb.net/"
client = MongoClient(mongo_uri)

# Access the database and collection
db = client.get_database("databaseScrumineers")
collection = db.get_collection("confusion_matrix")

def classify_data(file_contents):
    file_obj = io.BytesIO(file_contents) # Create a file object from the memory of the file contents

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
    
    # Save generated heatmap image to an appropriate location in the Mongo database
    image_json = {'accuracy': accuracy, 'heatmap_image_base64': heatmap_image_base64}
    images_db = db.get_collection("confusion_matrix")
    images_db.insert_one(image_json)

    return jsonify({'accuracy': accuracy, 'heatmap_image_base64': heatmap_image_base64})