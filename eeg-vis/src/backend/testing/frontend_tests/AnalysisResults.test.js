import { render, screen } from '@testing-library/react';
import AnalysisResults from '../../../components/AnalysisResults';

let classifier = "Random Forest"
let accuracy = 0.5
let removedChannels = []
let secondClassifier = "Logistic Regression"
let secondAccuracy = 0.6

test('checks that each part of the analysis result is tested with no removed channels', () => {
    render(<AnalysisResults classifier={classifier} accuracy={accuracy} removedChannels={removedChannels} heatmapImage="test" />);
    
    // check classifier name
    const classifierName = screen.getByText("Heatmap: " + classifier);
    expect(classifierName).toBeInTheDocument();

    // check accuracy value
    const accuracyValue = screen.getByText("Accuracy: " + accuracy);
    expect(accuracyValue).toBeInTheDocument();

    // check removed channels
    const removedChannelsList = screen.getByText("Removed channels: none");
    expect(removedChannelsList).toBeInTheDocument();

    const heatmapDisplay = screen.getByAltText("Heatmap for Heatmap");
    expect(heatmapDisplay).toBeInTheDocument();
});

test('checks that specifying removed channels displays correctly', () => {
    removedChannels = ['Fp1', 'Fp2', 'F7', 'F3', 'Fz', 'F4', 'F8', 'FC5']

    render(<AnalysisResults classifier={classifier} accuracy={accuracy} removedChannels={removedChannels} heatmapImage="" />);

    // check removed channels
    const removedChannelsList = screen.getByText("Removed channels: " + removedChannels.join(', ') );
    expect(removedChannelsList).toBeInTheDocument();
});

test('verify output of comparison results', () => {
    render(
        <AnalysisResults comparison={true} classifier={classifier} secondClassifier={secondClassifier} 
            accuracy={accuracy} secondAccuracy={secondAccuracy} 
            removedChannels={removedChannels} heatmapImage='' secondHeatmapImage='' 
        />
    );

    // check classifiers
    const classifier1 = screen.getByText("Classifier 1: " + classifier);
    expect(classifier1).toBeInTheDocument();

    const classifier2 = screen.getByText("Classifier 2: " + secondClassifier);
    expect(classifier2).toBeInTheDocument();

    // check accuracy
    const accuracy1 = screen.getByText("Accuracy: " + accuracy);
    expect(accuracy1).toBeInTheDocument();
        
    const accuracy2 = screen.getByText("Accuracy: " + secondAccuracy);
    expect(accuracy2).toBeInTheDocument();

    // check comparison message
    const message = screen.getByText("Logistic Regression has a higher accuracy at prediction than Random Forest for this data set.");
    expect(message).toBeInTheDocument();
});