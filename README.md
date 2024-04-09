# Scrumineers

### This is the repository for our project for SSW 555 - Agile Software and Methodologies.

The goal of this project is to make ECG data ML processing interactive and visual.

To run the project, enter the following commands after cloning and opening the repository:


npm install only needs to be ran if new changes were pulled

To run this project on your local machine
1. Navigate to eeg-vis, install node packages, and build react project
```
cd eeg-vis
npm install --legacy-peer-deps
npm run build
```
2. Install Python libraries  
Navigate to folder with requirements.txt:
```
cd src/backend
```
Install using pip:
```
pip install -r requirements.txt
```
Using Conda:
```
conda install --file requirements.txt
```
Lastly run App.py
```
python App.py
```
If that command fails, specify your Python version. For example, for python3 enter:
```
python3 App.py
```

App.py serves the React build. Serving the React build this way eliminates the need for a separate server for Flask and React as well as not triggering the browser CORS policy.
