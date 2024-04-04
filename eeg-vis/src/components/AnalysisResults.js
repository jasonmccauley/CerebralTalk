import React from "react";
import ClassifierResult from "./ClassifierResult";

function AnalysisResults({ comparison, classifier, secondClassifier, accuracy, secondAccuracy, removedChannels, heatmapImage, secondHeatmapImage}){
    return (
        
        comparison ?
            
            (<div >
                <div className="comparison-message">
                    {accuracy > secondAccuracy ? (
                        <p>Random Forest has a higher accuracy at prediction than Logistic Regression for this data set.</p>
                    ) : accuracy < secondAccuracy ? (
                        <p>Logistic Regression has a higher accuracy at prediction than Random Forest for this data set.</p>
                    ) : (
                        <p>Random Forest and Logistic Regression have equal accuracy at prediction of this data set.</p>
                    )}
                </div>
            
                <br/>

                <div className='comparison-results'>
                    
                    <div className='classifier-result'>
                        <ClassifierResult
                            classifier={classifier}
                            accuracy={accuracy}
                            removedChannels={removedChannels}
                            heatmapImage={heatmapImage}
                            label="Classifier 1"
                        />
                    </div>
                    
                    <div className='classifier-result'>
                        <ClassifierResult
                            classifier={secondClassifier}
                            accuracy={secondAccuracy}
                            removedChannels={removedChannels}
                            heatmapImage={secondHeatmapImage}
                            label="Classifier 2"
                        />
                    </div>
                
                </div>
            </div>)
            
        :
            
            (
            <div className='comparison-results'>
                <div>
                    <ClassifierResult
                        classifier={classifier}
                        accuracy={accuracy}
                        removedChannels={removedChannels}
                        heatmapImage={heatmapImage}
                        label="Classifier"
                    />
                </div>
            </div>
            )
    )
}

export default AnalysisResults