import matplotlib
matplotlib.use('Agg')  # Use a non-interactive backend

# Other imports
from flask import jsonify
import pandas as pd
import matplotlib.pyplot as plt

def speech_graphs(new_df):
    sorted_df = {}

    # organizes sorted_df
    for index, row in new_df.iterrows():
        if row["Imagined_Speech"] not in sorted_df:
            sorted_df[row["Imagined_Speech"]] = pd.DataFrame(columns=new_df.columns).drop('Imagined_Speech', axis=1)

        sorted_df[row["Imagined_Speech"]].loc[len(sorted_df[row["Imagined_Speech"]])] = row.drop('Imagined_Speech')

    # Rename the columns to remove the 'channel_' prefix
    for key in sorted_df:
        sorted_df[key].columns = sorted_df[key].columns.str.replace('Channel_', '').astype(int)
        transposed_df = sorted_df[key].T

        # Plot each column as a separate line
        ax = transposed_df.plot(legend=False)
        ax.set_xlabel('Channel Number')
        ax.set_ylabel('Amplitude')
        ax.set_title(f'Imagined Speech: \"{key}\"')
        plt.show()
    return


