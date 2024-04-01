import React from "react";
import FeedbackButton from "./Feedback";

function AnalysisResults({ classifier, accuracy, removedChannels, heatmapImage}){
    return (
        <div>
            {classifier ?(
                <h2>Classifier: {classifier}</h2>
            ):(
                <h2>Classifier: Random Forest</h2>
            )}
            
            <p>Accuracy: {accuracy}</p>
            {removedChannels.length !== 0 ? (
                <p>Removed channels: {removedChannels.join(', ')}</p>
            ):(
                <p>Removed channels: none</p>
            )}
            <img src={`data:image/jpeg;base64,${heatmapImage}`} alt='Heatmap' />
        </div>
    )
}

export default AnalysisResults