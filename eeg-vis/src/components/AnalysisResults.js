import React from "react";

function AnalysisResults({ comparison, classifier, secondClassifier, accuracy, secondAccuracy, removedChannels, heatmapImage, secondHeatmapImage}){
    return (
        
        comparison ?
            
            (<div>
                <div>
                    {/* Separate div for the comparison message to ensure it takes full width */}
                    <div className="comparison-message">
                    {accuracy > secondAccuracy ? (
                        <p>Random Forest has a higher accuracy at prediction than Logistic Regression for this data set.</p>
                    ) : accuracy < secondAccuracy ? (
                        <p>Logistic Regression has a higher accuracy at prediction than Random Forest for this data set.</p>
                    ) : (
                        <p>Random Forest and Logistic Regression have equal accuracy at prediction of this data set.</p>
                    )}
                    </div>
                    <div className="comparison-results">
                    <div className="classifier-result">
                        <h2>Classifier 1: {classifier}</h2>
                        <p>Accuracy: {accuracy}</p>
                        {removedChannels.length !== 0 && (
                        <p>Removed channels: {removedChannels.join(', ')}</p>
                        )}
                        {heatmapImage && (
                        <div>
                            <img src={`data:image/jpeg;base64,${heatmapImage}`} alt='Heatmap 1' />
                        </div>
                        )}
                    </div>
                    <div className="classifier-result">
                        <h2>Classifier 2: {secondClassifier}</h2>
                        <p>Accuracy: {secondAccuracy}</p>
                        {removedChannels.length !== 0 && (
                        <p>Removed channels: {removedChannels.join(', ')}</p>
                        )}
                        {secondHeatmapImage && (
                        <div>
                            <img src={`data:image/jpeg;base64,${secondHeatmapImage}`} alt='Heatmap 2' />
                        </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>)
            
            :
            
            (
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
    )
}

export default AnalysisResults