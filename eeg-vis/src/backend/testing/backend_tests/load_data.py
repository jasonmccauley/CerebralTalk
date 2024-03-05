"""
These functions all involve extracting relevant eeg data from the provided eeg data files
Since there is too much data to display at once, this code displays the dimensions of each extracted matrix while also displaying the data for the smaller matricies

While these tests may seem simple, they are EXTREMELY important because without this functionality we cannot format the data
in a way that the ML algorithms can understand
"""
import scipy.io

"""
This function extracts the matrix "x" from a matlab eeg file

To get the matrix, we first have to navigate to the structured array "epo_train"
Within "epo_train" there are many matrices but the one with most of the eeg data we want is called "x"

data['epo_train']['x'] returns a list object that can't be accessed 
so we do data['epo_train']['x'][0,0] to get inside the list to use for our purposes
"""
#This function extracts the matrix "x" and prints dimensions 
def x_dimensions(file_path):
    data = scipy.io.loadmat(file_path)
    epo_x = data['epo_train']['x'][0, 0]
    
    depth = len(epo_x)
    rows = len(epo_x[0])
    columns = len(epo_x[0][0])

    return [depth, rows, columns]

#This function extracts the matrix "x" and prints dimensions 
def y_dimensions(file_path):
    data = scipy.io.loadmat(file_path)
    epo_y = data['epo_train']['y'][0, 0]
    
    rows = len(epo_y)
    columns = len(epo_y[0])

    return [rows, columns]

#This function extracts the matrix "classNames" and prints dimensions 
def className_dimensions(file_path):
    data = scipy.io.loadmat(file_path)
    classNames = data['epo_train']['className'][0, 0]
    rows = len(classNames)
    columns = len(classNames[0])

    return [rows, columns]

#This function extracts the matrix "classNames" and prints the data
def className_data(file_path):
    data = scipy.io.loadmat(file_path)
    classNames = data['epo_train']['className'][0, 0][0]

    result = []
    for i in range(0, len(classNames)):
        # each item in classNames is np array so each item needs to be individually converted to a python list
        result.append(classNames[i].tolist())
    return result

#This function extracts the matrix "classNames" and prints the data
def channel_dimensions(file_path):
    data = scipy.io.loadmat(file_path)
    channel_names = data['epo_train']['clab'][0, 0]

    rows = len(channel_names)
    columns = len(channel_names[0])

    return [rows, columns]

#This function extracts the matrix "clab" and prints the data. "clab" contains the eeg channel names
def channel_data(file_path):
    data = scipy.io.loadmat(file_path)
    channel_names = data['epo_train']['clab'][0, 0][0]

    result = []
    for i in range(0, len(channel_names)):
        # each item in classNames is np array so each item needs to be individually converted to a python list
        result.append(channel_names[i].tolist())
    return result
