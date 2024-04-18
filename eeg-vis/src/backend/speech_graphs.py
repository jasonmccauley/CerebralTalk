import matplotlib
matplotlib.use('Agg')  # Use a non-interactive backend

# Other imports
from flask import jsonify
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

def speech_graphs(eeg_df):
    sorted_df = {}

    # organizes sorted_df
    for index, row in eeg_df.iterrows():
        if row["Imagined_Speech"] not in sorted_df:
            sorted_df[row["Imagined_Speech"]] = pd.DataFrame(columns=eeg_df.columns).drop('Imagined_Speech', axis=1)

        sorted_df[row["Imagined_Speech"]].loc[len(sorted_df[row["Imagined_Speech"]])] = row.drop('Imagined_Speech')

    # Rename the columns to remove the 'channel_' prefix
    for key in sorted_df:
        sorted_df[key].columns = sorted_df[key].columns.str.replace('Channel_', '').astype(int)
        transposed_df = sorted_df[key].T

        # Plot each column as a separate line
        transposed_df.plot(legend=False)
        plt.xlabel('Channel Number')
        plt.ylabel('Amplitude')
        plt.title(f'Imagined Speech: \"{key}\"')
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        sorted_df[key] = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()
        plt.clf()
    return sorted_df


