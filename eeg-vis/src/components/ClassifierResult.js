import React from "react";

const ClassifierResult = ({ classifier, accuracy, removedChannels, heatmapImage, label }) => (
    <>
        <h2>{label}: {classifier}</h2>
        <p>Accuracy: {accuracy}</p>
        {removedChannels.length !== 0 ? (
            <p>Removed channels: {removedChannels.join(', ')}</p>
        ):(
            <p>Removed channels: none</p>
        )}
        {heatmapImage && (
            <div>
                <img src={`data:image/jpeg;base64,${heatmapImage}`} alt={`Heatmap for ${label}`} />
            </div>
        )}
    </>
);

export default ClassifierResult;