# Scrumineers

### This is the repository for our project for SSW 555 - Agile Software and Methodologies.

The goal of this project is to make ECG data ML processing interactive and visual.

To run the project, enter the following commands after cloning and opening the repository:


npm install only needs to be ran if new changes were pulled

To run this project on your local machine
1. Navigate to eeg-vis and install node packages
```
cd eeg-vis
npm install
```
2. Install Python libraries  
Using pip:
```
pip install -r requirements.txt
```
  Using Conda:
```
conda install --file requirements.txt
```
3. If on MacOS, in line 19 of App.py change "shell=True" to "shell=False"
4. While in eeg-vis, run App.py. Open App.py and run it with code runner VS code extension

App.py executes "npm run build" and serves the React build. Serving the React build this way eliminates the need for a separate server for Flask and React as well as not triggering the browser CORS policy.
