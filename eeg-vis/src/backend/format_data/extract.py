import scipy.io
import pandas as pd

data = scipy.io.loadmat('Data_Sample01_training.mat')

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
        for i in range(0,795):
            imagined_speech.append(speech_labels[speech_idx])
    else:
        for i in range(0,795):
            imagined_speech.append("None")

# Add the list as a new column in the dataframe
df['Imagined_Speech'] = imagined_speech


print(df)