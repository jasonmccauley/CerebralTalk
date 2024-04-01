import matplotlib
matplotlib.use('Agg')  # Use a non-interactive backend

# Other imports
from flask import jsonify
import scipy.io
import io
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier 
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from pymongo import MongoClient
import mdb

# Access the database and collection
db = mdb.get_db()
collection = mdb.get_collection("confusion_matrix")

def classify_data(file_contents, ml_config, classifier_name):
    file_obj = io.BytesIO(file_contents) # Create a file object from the memory of the file contents

    data = scipy.io.loadmat(file_obj) # Load data from file object using scipy loadmat()

    # EEG channel removal
    list_of_channels = [item[0] for sublist in data['epo_train']['clab'] for subsublist in sublist for array in subsublist for item in array]
    indices_to_remove = []

    # Finds indices of removed channels if there is ≥1 channel being removed
    if ml_config['removed_channels'][0] != '':
        for channel in ml_config['removed_channels']:
            indices_to_remove.append(list_of_channels.index(channel))
    else:
        ml_config['removed_channels'] = ['none']

    
    # Extract the structured array epo.y
    epo_x = data['epo_train']['x'][0, 0]
    epo_y = data['epo_train']['y'][0, 0]

    #transpose
    reshaped_data = epo_x.transpose(2, 0, 1)

    # Create a dictionary to hold the data for the dataframe
    data_dict = {}

    # Extract the number of trials
    num_trials = reshaped_data.shape[0]

    # drops channel columns the user doesn't want
    for channel_idx in range(reshaped_data.shape[2]):
        if not channel_idx in indices_to_remove:
            channel_data = reshaped_data[:, :, channel_idx].reshape(num_trials, -1)
            flattened_channel_data = channel_data.flatten()  # Flatten the 2D array to 1D
            data_dict[f'Channel_{channel_idx+1}'] = flattened_channel_data

    # Create the dataframe
    df = pd.DataFrame(data_dict)
    
    # Create a new dataframe with every 795th row
    time_dimension = len(epo_x)
    new_df = df.iloc[::time_dimension]

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


    # Initialize clf to None
    clf = None


    #Checking which classifier the user picked, training model accordingly
    if classifier_name == 'Random Forest':
         
        clf = RandomForestClassifier()
        clf.fit(X_train, y_train) # Train RandomForestClassifier()

    if classifier_name == 'Logistic Regression':
         
         clf = LogisticRegression()
         clf.fit(X_train, y_train) # Train LogisticRegression()

    #Would add other if statements here accordingly for different classifiers
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
    image_json = {'classifier': classifier_name, 'accuracy': accuracy, 'heatmap_image_base64': heatmap_image_base64, 'excluded_channels' : ml_config['removed_channels']}
    images_db = db.get_collection("confusion_matrix")
    images_db.insert_one(image_json)

    return jsonify({'accuracy': accuracy, 'heatmap_image_base64': heatmap_image_base64,'classifier': classifier_name, 'excluded_channels' : ml_config['removed_channels']})