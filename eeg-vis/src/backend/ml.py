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
import uuid
import mdb
import speech_graphs

# Access the database and collection
db = mdb.get_db()
collection = mdb.get_collection("confusion_matrix")

# Function that loads data from uploaded MATLAB file
def load_data(file_contents):
    file_obj = io.BytesIO(file_contents)
    data = scipy.io.loadmat(file_obj)
    return data

# Function that removes channels from the data according to specified indices
def remove_channels(reshaped_data, indices_to_remove):
    data_dict = {}
    num_trials = reshaped_data.shape[0]
    for channel_idx in range(reshaped_data.shape[2]):
        if channel_idx not in indices_to_remove:
            channel_data = reshaped_data[:, :, channel_idx].reshape(num_trials, -1)
            flattened_channel_data = channel_data.flatten()
            data_dict[f'Channel_{channel_idx+1}'] = flattened_channel_data
    return pd.DataFrame(data_dict)

# Function that maps numeric imagined speech labels to their corresponding text
def map_speech_labels(epo_y):
    imagined_speech = []
    speech_labels = {
        0: "Hello",
        1: "Help me",
        2: "Stop",
        3: "Thank you",
        4: "Yes"
    }
    for trial_idx in range(epo_y.shape[1]):
        speech_idx = int(epo_y[:, trial_idx].nonzero()[0])
        imagined_speech.append(speech_labels.get(speech_idx, "None"))
    return imagined_speech

# Function to generate base64-encoded image of the confusion matrix
def save_confusion_matrix_image(conf_matrix):
    plt.figure(figsize=(7,5))
    sns.heatmap(conf_matrix, annot=True, cmap='Blues', fmt='g')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Heatmap of Confusion Matrix')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    heatmap_image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    plt.clf()
    return heatmap_image_base64

# Function to train the classifier according to the selected name
def train_classifier(classifier_name, X_train, y_train):
    if classifier_name == 'Random Forest':
        return RandomForestClassifier().fit(X_train, y_train)
    elif classifier_name == 'Logistic Regression':
        return LogisticRegression().fit(X_train, y_train)
    else:
        raise ValueError("Unsupported classifier")


def classify_data(file_contents, ml_config, classifier_name, groupId, password, index):
    # Call to load data from file contents
    data = load_data(file_contents)

    # Determine indices of channels to remove based on configuration
    indices_to_remove = []
    if ml_config['removed_channels'][0] != '':
        list_of_channels = [item[0] for sublist in data['epo_train']['clab'] for subsublist in sublist for array in subsublist for item in array]
        for channel in ml_config['removed_channels']:
            indices_to_remove.append(list_of_channels.index(channel))
    
    # Call to remove specified channels from the data
    epo_x = data['epo_train']['x'][0, 0].transpose(2, 0, 1)
    new_df = remove_channels(epo_x, indices_to_remove)

    # Create a new DataFrame with every 795th row and reset its indices
    time_dimension = len(data['epo_train']['x'][0, 0])
    new_df = new_df.iloc[::time_dimension]
    new_df.reset_index(drop=True, inplace=True)

    # Call to map the speech labels according to their corresponding indices
    new_df['Imagined_Speech'] = map_speech_labels(data['epo_train']['y'][0, 0])

    # Call to generate speech graphs based on new processed dataframe
    # only make speech graphs once, index != 0 when doing comparison
    if index == 0:
        speeches = speech_graphs.speech_graphs(new_df)
        plt.clf()
    # Prepares data from training by first separating features from variable to be predicted
    X = new_df.drop(columns=['Imagined_Speech'])
    y = new_df['Imagined_Speech']

    # Split the data into training and testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Call to train the classifier according to the name selected, utilizing the training and testing sets
    clf = train_classifier(classifier_name, X_train, y_train)

    # Predict target variable using the training classifier and feature test data
    y_pred = clf.predict(X_test)

    # Calculate accuracy by comparing target variable predictions to actual target variable values
    accuracy = accuracy_score(y_test, y_pred)

    # Generate confusion matrix from these predictions
    conf_matrix = confusion_matrix(y_test, y_pred)

    # Call to generate base64-encoded image of the confusion matrix
    heatmap_image_base64 = save_confusion_matrix_image(conf_matrix)

    # Saves the input information and results to MongoDB
    image_json = {'groupId': groupId, 'password': password, 'classifier': classifier_name, 'accuracy': accuracy,
                  'heatmap_image_base64': heatmap_image_base64, 'excluded_channels': ml_config['removed_channels']}
    images_db = db.get_collection("confusion_matrix")
    images_db.insert_one(image_json)

    # Return the results as a JSON object
    if index == 0:
        return jsonify({'accuracy': accuracy, 'heatmap_image_base64': heatmap_image_base64,
                    'classifier': classifier_name, 'excluded_channels': ml_config['removed_channels'],
                    'speech_graphs': speeches})
    else:
        return jsonify({'accuracy': accuracy, 'heatmap_image_base64': heatmap_image_base64,
            'classifier': classifier_name, 'excluded_channels': ml_config['removed_channels']})